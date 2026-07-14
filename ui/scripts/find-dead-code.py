#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP_ROOT = ROOT / "src" / "app"

entry_files = [
    APP_ROOT / "app.ts",
    APP_ROOT / "app.routes.ts",
    APP_ROOT / "app.config.ts",
    APP_ROOT / "main.ts",
]

import_re = re.compile(r"from ['\"]([^'\"]+)['\"]")
import_call_re = re.compile(r"import\(['\"]([^'\"]+)['\"]\)")


def resolve_import(spec: str, from_file: Path):
    if not spec.startswith("."):
        return None
    p = (from_file.parent / spec).resolve()
    candidates = [
        p,
        p.with_suffix(".ts"),
        p.with_suffix(".tsx"),
        p.with_suffix(".js"),
        p / "index.ts",
        p / "index.js",
    ]
    for cand in candidates:
        if cand.exists():
            return cand
    return None


def collect_reachable_files():
    reachable = set()
    queue = [f for f in entry_files if f.exists()]
    seen = set()

    while queue:
        f = queue.pop()
        if f in seen:
            continue
        seen.add(f)
        if f.suffix != ".ts":
            continue
        reachable.add(f.relative_to(APP_ROOT).as_posix())
        try:
            content = f.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue

        if f.name == "app.routes.ts":
            for m in re.finditer(r"import\('([^']+)'\)\.then", content):
                spec = m.group(1)
                if spec.startswith("."):
                    resolved = resolve_import(spec, f)
                    if resolved and resolved.is_relative_to(APP_ROOT):
                        queue.append(resolved)

        for spec in import_re.findall(content) + import_call_re.findall(content):
            resolved = resolve_import(spec, f)
            if resolved and resolved.is_relative_to(APP_ROOT):
                queue.append(resolved)

    return reachable


def main():
    reachable = collect_reachable_files()

    candidates = []
    for path in APP_ROOT.rglob("*.ts"):
        rel = path.relative_to(APP_ROOT).as_posix()
        if path.name.endswith(".spec.ts") or path.name.endswith(".test.ts"):
            continue
        if (
            rel.startswith("components/")
            or rel.startswith("services/")
            or rel.startswith("interfaces/")
            or rel.startswith("models/")
        ):
            if rel not in reachable:
                candidates.append(rel)

    if candidates:
        print("Potential dead-code files:")
        for item in sorted(candidates):
            print(f"  - {item}")
    else:
        print(
            "No obvious dead-code files found in components/services/interfaces/models."
        )


if __name__ == "__main__":
    main()

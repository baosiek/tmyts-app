// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      // The codebase consistently uses `type` for data shapes and explicit
      // annotations on literal-initialized fields - both purely stylistic,
      // not worth a mass rewrite to adopt a linter's opposite preference.
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/consistent-generic-constructors": "off",
      "@typescript-eslint/consistent-indexed-object-style": "off",
      // Constructor-based DI is idiomatic Angular boilerplate here, not dead
      // code, and `subscribe({ error: () => {} })` is a deliberate no-op
      // (explicitly ignoring an error rather than a forgotten handler).
      "@typescript-eslint/no-empty-function": ["error", { allow: ["constructors", "arrowFunctions"] }],
      // Real signal worth tracking, but fixing means touching working code
      // (real types instead of `any`, constructor DI -> inject()) file by
      // file - flagged as a warning so it's visible without blocking CI.
      "@typescript-eslint/no-explicit-any": "warn",
      "@angular-eslint/prefer-inject": "warn",
      // Interface-required parameters (e.g. ngOnChanges(changes)) that the
      // implementation doesn't need can be named `_foo` instead of deleted.
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {},
  }
]);

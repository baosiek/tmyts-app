#!/bin/sh
# Runs automatically at container start (via nginx's own
# /docker-entrypoint.d/ mechanism, before nginx starts) and renders
# config.json from environment variables injected by Kubernetes. This is
# what lets one built image be promoted across environments instead of
# baking API URLs into the JS bundle at build time.
set -eu

CONFIG_FILE="/usr/share/nginx/html/config.json"

API_BASE_URL="${API_BASE_URL:-http://localhost:8000}"
WS_BASE_URL="${WS_BASE_URL:-ws://localhost:8001}"

cat > "$CONFIG_FILE" <<EOF
{
  "apiBaseUrl": "${API_BASE_URL}",
  "wsBaseUrl": "${WS_BASE_URL}"
}
EOF

echo "render-config.sh: wrote ${CONFIG_FILE} (apiBaseUrl=${API_BASE_URL}, wsBaseUrl=${WS_BASE_URL})"

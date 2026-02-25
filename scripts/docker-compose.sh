#!/usr/bin/env bash
# Run docker compose from project root, even when docker isn't on PATH.
# Usage: ./scripts/docker-compose.sh up -d surrealdb
# Or from repo root: scripts/docker-compose.sh up -d surrealdb

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

DOCKER=""
for candidate in docker \
  /usr/local/bin/docker \
  /Applications/Docker.app/Contents/Resources/bin/docker \
  "$HOME/.docker/bin/docker"; do
  if [ "$candidate" = "docker" ]; then
    command -v docker &>/dev/null && DOCKER="$(command -v docker)" && break
  elif [ -x "$candidate" ]; then
    DOCKER="$candidate"
    break
  fi
done

if [ -z "$DOCKER" ]; then
  echo "Docker not found. Install Docker Desktop or add docker to PATH." >&2
  echo "Try: export PATH=\"/usr/local/bin:\$PATH\"" >&2
  exit 1
fi

exec "$DOCKER" compose "$@"

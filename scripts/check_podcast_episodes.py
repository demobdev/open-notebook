#!/usr/bin/env python3
"""
Local smoke check: list podcast episodes and show whether each has outline/transcript.

Usage (API must be running, e.g. docker compose up open_notebook):
  uv run python scripts/check_podcast_episodes.py

Or with explicit base URL:
  API_BASE_URL=http://localhost:5055 uv run python scripts/check_podcast_episodes.py

No auth in this script; for local dev the API may allow unauthenticated list.
"""

import os
import sys

try:
    import requests
except ImportError:
    print("Install requests: uv add requests", file=sys.stderr)
    sys.exit(1)

API_BASE = os.environ.get("API_BASE_URL", "http://localhost:5055")


def main():
    url = f"{API_BASE}/podcasts/episodes"
    try:
        r = requests.get(url, timeout=10)
        r.raise_for_status()
    except requests.RequestException as e:
        print(f"Failed to fetch {url}: {e}", file=sys.stderr)
        sys.exit(1)

    data = r.json()
    if not data:
        print("No episodes found.")
        return

    print(f"Found {len(data)} episode(s)\n")
    for ep in data:
        name = ep.get("name", "—")
        status = ep.get("job_status", "—")
        has_outline = bool(
            ep.get("outline")
            and isinstance(ep.get("outline"), dict)
            and ep.get("outline", {}).get("segments")
        )
        has_transcript = bool(
            ep.get("transcript")
            and isinstance(ep.get("transcript"), dict)
            and ep.get("transcript", {}).get("transcript")
        )
        print(f"  {name}")
        print(f"    status={status}  outline={'yes' if has_outline else 'no'}  transcript={'yes' if has_transcript else 'no'}")
        print()
    print("If outline/transcript are 'no' for a completed episode, that run likely failed before saving them (see quick-fix #0e).")


if __name__ == "__main__":
    main()

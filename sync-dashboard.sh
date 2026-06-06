#!/usr/bin/env bash
# Sync the Swalwell dashboard from the working folder into this published repo,
# then commit and push so GitHub Pages picks it up.
#
# Usage:  ./sync-dashboard.sh
set -euo pipefail

# --- locations ---
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$REPO_DIR/../Soverign AI/dashboards"

FILES=(
  "swalwell_v2.html"
  "swalwell_data.js"
  "chart.umd.min.js"
)

echo "Source : $SRC_DIR"
echo "Repo   : $REPO_DIR"
echo

# --- copy ---
for f in "${FILES[@]}"; do
  if [[ ! -f "$SRC_DIR/$f" ]]; then
    echo "  ! missing in source, skipping: $f"
    continue
  fi
  cp "$SRC_DIR/$f" "$REPO_DIR/$f"
  echo "  ✓ copied $f"
done
echo

# --- commit & push only if something changed ---
cd "$REPO_DIR"
if git diff --quiet -- "${FILES[@]}"; then
  echo "No changes — published copy already up to date."
  exit 0
fi

git add "${FILES[@]}"
git commit -m "Sync Swalwell dashboard from working folder ($(date +%Y-%m-%d))"
git push origin main
echo
echo "Done. GitHub Pages will rebuild in ~60s:"
echo "  https://riotwitch28.github.io/article-one/swalwell_v2.html"

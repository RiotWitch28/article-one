#!/usr/bin/env bash
# Sync the Article One dashboard from the working folder into this published repo,
# then commit and push so GitHub Pages picks it up.
#
# Source of truth : ../Sovereign AI/dashboards
# Published repo  : this folder (RiotWitch28/article-one → GitHub Pages)
#
# Only the files/dirs listed below are synced. Published-only assets
# (capitol-night.jpg, launch.command, sync-dashboard.sh) are never touched.
#
# Usage:  ./sync-dashboard.sh
set -euo pipefail

# --- locations ---
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$REPO_DIR/../Sovereign AI/dashboards"

# Top-level files that live in both source and published repo.
FILES=(
  "index.html"          # data-driven member dashboard (?member=BIOGUIDE)
  "article-one.html"    # roster / landing grid
  "home.html"
  "about-prudence.html"
  "roster_summary.js"
  "staff_summary.js"
  "changelog-data.js"
  "chart.umd.min.js"
  "swalwell_data.js"    # Swalwell's full dataset (S001193 loads this directly)
  "swalwell_data.json"
)

# Directories synced wholesale (data feeds, per-member data, sub-site).
DIRS=(
  "data"                # members.json, districts.json, states.json, elections_2024.json
  "members"             # per-member data.js / data.json
  "suffrage-and-sass"
)

echo "Source : $SRC_DIR"
echo "Repo   : $REPO_DIR"
echo

# --- copy files ---
for f in "${FILES[@]}"; do
  if [[ ! -f "$SRC_DIR/$f" ]]; then
    echo "  ! missing in source, skipping: $f"
    continue
  fi
  cp "$SRC_DIR/$f" "$REPO_DIR/$f"
  echo "  ✓ file  $f"
done

# --- sync directories (additive/update; no --delete so published-only files survive) ---
for d in "${DIRS[@]}"; do
  if [[ ! -d "$SRC_DIR/$d" ]]; then
    echo "  ! missing in source, skipping: $d/"
    continue
  fi
  rsync -a "$SRC_DIR/$d/" "$REPO_DIR/$d/"
  echo "  ✓ dir   $d/"
done
echo

# --- commit & push only if something changed ---
cd "$REPO_DIR"
git add -- "${FILES[@]}" "${DIRS[@]}"
if git diff --cached --quiet; then
  echo "No changes — published copy already up to date."
  exit 0
fi

git commit -m "Sync Article One dashboard from working folder ($(date +%Y-%m-%d))"
git push origin main
echo
echo "Done. GitHub Pages will rebuild in ~60s:"
echo "  Roster   : https://riotwitch28.github.io/article-one/article-one.html"
echo "  Dashboard: https://riotwitch28.github.io/article-one/index.html?member=S001193"

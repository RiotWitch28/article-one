#!/bin/bash
# Double-click this file to launch the Article One dashboard locally.
# Starts a tiny Python HTTP server in this folder and opens the dashboard
# in your default browser at http://localhost:8765/index.html
#
# This sidesteps every file:// loading restriction that browsers impose
# on multi-file dashboards. Close the Terminal window to stop the server.

# Move to the folder this script lives in (works no matter where you double-click from)
cd "$(dirname "$0")" || exit 1

PORT=8765

# Free the port if a previous launch is still running
if lsof -ti :$PORT >/dev/null 2>&1; then
  echo "Port $PORT already in use — killing previous server..."
  lsof -ti :$PORT | xargs kill -9 2>/dev/null
  sleep 1
fi

URL="http://localhost:$PORT/index.html"

echo ""
echo "  Article One dashboard"
echo "  ─────────────────────"
echo "  Serving: $(pwd)"
echo "  URL:     $URL"
echo ""
echo "  Opening in your browser..."
echo "  Close this Terminal window to stop the server."
echo ""

# Open the browser after a short delay so the server is up
( sleep 1 && open "$URL" ) &

# Run the server in the foreground so closing the Terminal window stops it
python3 -m http.server $PORT

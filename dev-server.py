#!/usr/bin/env python3
"""Static dev server that disables browser caching.

Plain `python3 -m http.server` lets the browser cache JS/HTML aggressively,
which during development means edits to support.js / *.html silently don't
show up until a hard refresh. This server sends no-cache headers on every
response so a normal reload always picks up the latest files.

Usage: python3 dev-server.py <port> <directory>
"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 7891
    directory = sys.argv[2] if len(sys.argv) > 2 else "."
    handler = partial(NoCacheHandler, directory=directory)
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    print(f"No-cache dev server on http://127.0.0.1:{port} serving {directory}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()


if __name__ == "__main__":
    main()

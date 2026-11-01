#!/usr/bin/env python3
"""Run the self-contained Panda AI Play demo on this computer."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description="Start the Panda AI Play local demo")
    parser.add_argument("--port", type=int, default=8765, help="Local port (default: 8765)")
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error("--port must be between 1 and 65535")

    site = Path(__file__).resolve().parent.parent / "dist"
    if not (site / "index.html").is_file():
        parser.exit(1, "Missing dist/index.html. Extract the entire source archive first.\n")

    handler = partial(SimpleHTTPRequestHandler, directory=str(site))
    try:
        server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    except OSError as error:
        parser.exit(1, "Could not start the local demo: %s\nTry another port with --port 8766.\n" % error)

    print("Panda AI Play | Team: Gong Xi Fa Cai", flush=True)
    print("Open http://127.0.0.1:%s/ in your browser." % args.port, flush=True)
    print("Synthetic demo data. No account or API key required.", flush=True)
    print("Keep this window open. Press Ctrl+C to stop.", flush=True)
    with server:
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nDemo stopped.")


if __name__ == "__main__":
    main()

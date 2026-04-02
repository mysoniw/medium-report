#!/usr/bin/env python3
"""Medium 블로그 분석 아카이브 — 로컬 서버

Usage:
    python3 serve.py              # http://localhost:12005
    python3 serve.py --no-open    # 브라우저 자동 열기 안 함
"""

import os
import sys
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

PORT = 12005
ROOT = Path(__file__).parent


class Handler(SimpleHTTPRequestHandler):
    # .md 파일을 다운로드가 아닌 텍스트로 서빙 (fetch에서 읽을 수 있도록)
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        '.md': 'text/plain; charset=utf-8',
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt, *args):
        print(f"  {args[0]}" if args else "")


if __name__ == "__main__":
    no_open = "--no-open" in sys.argv
    server = HTTPServer(("0.0.0.0", PORT), Handler)
    print(f"\n  Medium Archive")
    print(f"  http://localhost:{PORT}\n")

    if not no_open:
        webbrowser.open(f"http://localhost:{PORT}")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Goodbye.\n")
        server.server_close()

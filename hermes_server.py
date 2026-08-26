import os
import sys

# Bridge root hermes_server.py to unified runtimes/jinwoo_worker_server.py
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(current_dir, "runtimes"))

from jinwoo_worker_server import app, uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("JINWOO_WORKER_PORT", "20129"))
    print(f"[JINWOO] Starting Jinwoo Worker Daemon on port {port}...")
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="warning")

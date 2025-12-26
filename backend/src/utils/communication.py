import asyncio
from typing import Any

try:
    from ws_manager import ws_manager
except Exception:
    ws_manager = None


class Communication:
    def __init__(self):
        pass

    def send_message(self, message: Any):
        payload = {"event": "message", "payload": message}
        if ws_manager:
            try:
                asyncio.create_task(ws_manager.broadcast(payload))
                return
            except Exception:
                pass

        # Fallback
        print("Communication fallback - message:", message)

    def close(self):
        return

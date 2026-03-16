# ============================================================
# STC Shield SSE Broadcaster
# Production-safe async implementation
# ============================================================

import asyncio
from typing import Set

class ShieldEventBroadcaster:
    def __init__(self):
        self._subscribers: Set[asyncio.Queue] = set()

    async def subscribe(self) -> asyncio.Queue:
        queue = asyncio.Queue()
        self._subscribers.add(queue)
        return queue

    def unsubscribe(self, queue: asyncio.Queue):
        self._subscribers.discard(queue)

    async def broadcast(self, event: dict):
        dead = []

        for queue in self._subscribers:
            try:
                queue.put_nowait(event)
            except Exception:
                dead.append(queue)

        for queue in dead:
            self._subscribers.discard(queue)


# Global singleton
shield_broadcaster = ShieldEventBroadcaster()

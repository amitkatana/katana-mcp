from __future__ import annotations

from typing import Protocol

from .models import Product


class ProductStore(Protocol):
    async def list(self, *, search: str | None = None, limit: int = 50) -> list[Product]: ...
    async def get(self, product_id: int) -> Product | None: ...

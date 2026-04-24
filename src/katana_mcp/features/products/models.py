from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any, Iterable


@dataclass
class Product:
    id: int
    product_type_id: int | None
    name: str
    external_key: str | None = None
    gtin: str | None = None
    sku: str | None = None
    created_on_utc: str | None = None
    is_published: bool = False


def payload(products: Iterable[Product], **extra: Any) -> dict[str, Any]:
    out: dict[str, Any] = {"products": [asdict(p) for p in products]}
    out.update(extra)
    return out

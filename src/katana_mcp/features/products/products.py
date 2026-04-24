from __future__ import annotations

from dataclasses import asdict
from typing import Any

from mcp.server.fastmcp import FastMCP

from ...widgets.registry import WidgetSpec
from .models import payload
from .storage import ProductStore


def register_product_tools(
    mcp: FastMCP, store: ProductStore, widget: WidgetSpec
) -> None:
    meta = widget.tool_meta(
        invoking="Loading products…",
        invoked="Products loaded.",
    )

    @mcp.tool(
        name="list_products",
        title="List products",
        description=(
            "List products from the Katana database. "
            "Optional `search` filters by name/SKU/GTIN; `limit` caps rows (default 50)."
        ),
        meta=meta,
    )
    async def list_products(
        search: str | None = None, limit: int = 50
    ) -> dict[str, Any]:
        products = await store.list(search=search, limit=limit)
        return payload(products, search=search or "", limit=limit)

    @mcp.tool(
        name="get_product",
        title="Get product",
        description="Fetch a single product by id.",
        meta=meta,
    )
    async def get_product(id: int) -> dict[str, Any]:
        p = await store.get(id)
        if p is None:
            return {"products": [], "error": f"No product with id {id}"}
        return {"products": [asdict(p)], "selected_id": p.id}

from __future__ import annotations

import logging

from mcp.server.fastmcp import FastMCP
from mcp.server.transport_security import TransportSecuritySettings

from .features.products import (
    MSSQLProductStore,
    ProductStore,
    register_product_tools,
)
from .settings import Settings
from .widgets import register_widgets, product_list_widget

logger = logging.getLogger("product-mcp")


def build_store(settings: Settings) -> ProductStore:
    logger.info(
        "Using MSSQLProductStore (host=%s db=%s)",
        settings.mssql.host,
        settings.mssql.database,
    )
    store = MSSQLProductStore(settings.mssql)
    return store


def _default_local_hosts(settings: Settings) -> list[str]:
    hosts = {f"127.0.0.1:{settings.port}", f"localhost:{settings.port}"}
    if settings.host not in {"127.0.0.1", "localhost"}:
        hosts.add(f"{settings.host}:{settings.port}")
    return sorted(hosts)


def build_mcp(settings: Settings) -> FastMCP:
    allowed_hosts = list(
        dict.fromkeys([*_default_local_hosts(settings), *settings.allowed_hosts])
    )
    if settings.dev_mode:
        logger.warning("DEV mode: DNS-rebinding protection disabled")
        security = TransportSecuritySettings(enable_dns_rebinding_protection=False)
    else:
        security = TransportSecuritySettings(
            enable_dns_rebinding_protection=True,
            allowed_hosts=allowed_hosts,
            allowed_origins=settings.allowed_origins,
        )
        logger.info("Allowed hosts: %s", allowed_hosts)
    mcp = FastMCP(
        "katana-mcp",
        host=settings.host,
        port=settings.port,
        streamable_http_path="/mcp",
        transport_security=security,
    )

    product_widget = product_list_widget(settings.web_dist)
    register_widgets(mcp, [product_widget])

    product_store = build_store(settings)
    register_product_tools(mcp, product_store, product_widget)

    return mcp

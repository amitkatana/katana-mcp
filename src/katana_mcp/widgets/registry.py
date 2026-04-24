from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable

from mcp.server.fastmcp import FastMCP


@dataclass
class WidgetSpec:
    """Definition of a ChatGPT Apps SDK widget exposed as an MCP resource."""

    uri: str
    name: str
    description: str
    html_path: Path
    fallback_html: str = (
        "<!doctype html><meta charset='utf-8'><div style='font-family:sans-serif;padding:1rem'>"
        "Widget bundle missing. Build it first.</div>"
    )
    mime_type: str = "text/html+skybridge"
    meta: dict[str, Any] = field(default_factory=dict)
    tool_meta_extra: dict[str, Any] = field(default_factory=dict)

    def html(self) -> str:
        return (
            self.html_path.read_text()
            if self.html_path.exists()
            else self.fallback_html
        )

    def tool_meta(
        self, *, invoking: str = "Working…", invoked: str = "Done."
    ) -> dict[str, Any]:
        meta: dict[str, Any] = {
            "openai/outputTemplate": self.uri,
            "openai/toolInvocation/invoking": invoking,
            "openai/toolInvocation/invoked": invoked,
            "openai/widgetAccessible": True,
        }
        meta.update(self.tool_meta_extra)
        return meta


def register_widgets(mcp: FastMCP, widgets: list[WidgetSpec]) -> None:
    for spec in widgets:
        _register_one(mcp, spec)


def _register_one(mcp: FastMCP, spec: WidgetSpec) -> None:
    reader: Callable[[], str] = spec.html
    mcp.resource(
        spec.uri,
        name=spec.name,
        mime_type=spec.mime_type,
        description=spec.description,
        meta=spec.meta or None,
    )(reader)

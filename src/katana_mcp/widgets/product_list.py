from __future__ import annotations

from pathlib import Path

from .registry import WidgetSpec

WIDGET_VERSION = "v3"
PRODUCT_LIST_URI = f"ui://widget/product-list-{WIDGET_VERSION}.html"


def product_list_widget(web_dist: Path) -> WidgetSpec:
    return WidgetSpec(
        uri=PRODUCT_LIST_URI,
        name="PRoduct List Widget",
        description="React widget rendering the interactive product list.",
        html_path=web_dist / "index.html",
        meta={
            "openai/widgetDescription": "Interactive product board.",
            "openai/widgetPrefersBorder": True,
        },
    )

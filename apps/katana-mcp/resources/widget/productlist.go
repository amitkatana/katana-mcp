package widget

import (
	"context"

	"github.com/mark3labs/mcp-go/mcp"
)

func ProductListWidget(productListHTML string) (mcp.Resource, MCPResourceHandler) {

	if productListHTML == "" {
		productListHTML = `<!doctype html><meta charset='utf-8'><div style='font-family:sans-serif;padding:1rem'>Widget bundle missing. Build it first.</div>`
	}

	productListMeta := map[string]any{
		"openai/widgetDescription":   "Interactive Katana product list.",
		"openai/widgetPrefersBorder": true,
		"openai/widgetAccessible":    true,
	}

	productListResource := mcp.NewResource(
		PRODUCT_LIST_URI,
		"Product List Widget",
		mcp.WithResourceDescription("Displays a searchable product list of Katana products"),
		mcp.WithMIMEType("text/html+skybridge"),
	)
	productListResource.Meta = mcp.NewMetaFromMap(productListMeta)

	productListResourceHandler := func(ctx context.Context, request mcp.ReadResourceRequest) ([]mcp.ResourceContents, error) {
		return []mcp.ResourceContents{
			mcp.TextResourceContents{
				URI:      PRODUCT_LIST_URI,
				MIMEType: "text/html",
				Text:     productListHTML,
				Meta:     productListMeta,
			},
		}, nil
	}

	return productListResource, productListResourceHandler

}

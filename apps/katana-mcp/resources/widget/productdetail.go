package widget

import (
	"context"

	"github.com/mark3labs/mcp-go/mcp"
)

func ProductDetailWidget(productDetailHTML string) (mcp.Resource, MCPResourceHandler) {

	if productDetailHTML == "" {
		productDetailHTML = `<!doctype html><meta charset='utf-8'><div style='font-family:sans-serif;padding:1rem'>Widget bundle missing. Build it first.</div>`
	}

	productDetailMeta := map[string]any{
		"openai/widgetDescription":   "Interactive Katana product details.",
		"openai/widgetPrefersBorder": true,
		"openai/widgetAccessible":    true,
	}

	productDetailResource := mcp.NewResource(
		PRODUCT_DETAIL_URI,
		"Product Detail Widget",
		mcp.WithResourceDescription("Displays a detail view of Katana products"),
		mcp.WithMIMEType("text/html+skybridge"),
	)
	productDetailResource.Meta = mcp.NewMetaFromMap(productDetailMeta)

	productDetailResourceHandler := func(ctx context.Context, request mcp.ReadResourceRequest) ([]mcp.ResourceContents, error) {
		return []mcp.ResourceContents{
			mcp.TextResourceContents{
				URI:      PRODUCT_DETAIL_URI,
				MIMEType: "text/html",
				Text:     productDetailHTML,
				Meta:     productDetailMeta,
			},
		}, nil
	}

	return productDetailResource, productDetailResourceHandler

}

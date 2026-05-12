package productgrp

import (
	"context"

	"github.com/mark3labs/mcp-go/mcp"
	"github.com/tritac/katana-mcp-goo/apps/katana-mcp/resources/widget"
	"github.com/tritac/katana-mcp-goo/internal/core/product"
)

type ProductTool struct {
	Product product.Core
}

type ToolHandler = func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error)

type MCPDef struct {
	Tool        mcp.Tool
	ToolHandler ToolHandler
}

func (pt *ProductTool) ProductListTool() *MCPDef {

	widgetMeta := map[string]any{
		"openai/outputTemplate":          widget.PRODUCT_LIST_URI,
		"openai/toolInvocation/invoking": "Loading products…",
		"openai/toolInvocation/invoked":  "Products loaded.",
		"openai/widgetAccessible":        true,
	}

	productListTool := mcp.NewTool("product_list",
		mcp.WithDescription("Katana Product List"),
		mcp.WithString(
			"query",
			mcp.Description("Search query for filtering products"),
			mcp.DefaultString(""),
		),
		mcp.WithInteger(
			"limit",
			mcp.Description("Maximum number of products to return"),
			mcp.DefaultNumber(10),
		),
	)
	productListTool.Meta = mcp.NewMetaFromMap(widgetMeta)

	productListToolHandler := func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {

		query, _ := request.RequireString("query")

		limit, err := request.RequireInt("limit")
		if err != nil {
			return nil, err
		}

		products, err := pt.Product.Query(ctx, query, limit)
		if err != nil {
			return nil, err
		}

		result, err := mcp.NewToolResultJSON(map[string]any{
			"products": products,
			"query":    query,
			"limit":    limit,
		})
		if err != nil {
			return nil, err
		}

		result.Meta = mcp.NewMetaFromMap(widgetMeta)
		return result, nil
	}

	return &MCPDef{Tool: productListTool, ToolHandler: productListToolHandler}
}

func (pt *ProductTool) ProductDetailTool() *MCPDef {

	widgetMeta := map[string]any{
		"openai/outputTemplate":          widget.PRODUCT_DETAIL_URI,
		"openai/toolInvocation/invoking": "Loading Product Detail",
		"openai/toolInvocation/invoked":  "Product loaded.",
		"openai/widgetAccessible":        true,
	}

	productDetailTool := mcp.NewTool("product_detail",
		mcp.WithDescription("Katana Product Detail"),
		mcp.WithInteger(
			"product_id",
			mcp.Description("katana Product id"),
		),
	)
	productDetailTool.Meta = mcp.NewMetaFromMap(widgetMeta)

	productDetailToolHandler := func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {

		product_id, _ := request.RequireInt("product_id")

		products, err := pt.Product.Find(ctx, product_id)
		if err != nil {
			return nil, err
		}

		result, err := mcp.NewToolResultJSON(map[string]any{
			"product":    products,
			"product_id": product_id,
		})
		if err != nil {
			return nil, err
		}

		result.Meta = mcp.NewMetaFromMap(widgetMeta)
		return result, nil
	}

	return &MCPDef{Tool: productDetailTool, ToolHandler: productDetailToolHandler}
}

func (pt *ProductTool) ProductTranslationUpdateTool() *MCPDef {

	productTranslationTool := mcp.NewTool("update_translation",
		mcp.WithDescription("KatanaPIM Product translations Update based on product id and language code"),
		mcp.WithInteger(
			"product_id",
			mcp.Description("KatanaPIM Product id"),
		),
		mcp.WithInteger("language_id", mcp.Description("the language id which to be update")),
		mcp.WithString("key", mcp.Description("Key for the locales which to be updated")),
		mcp.WithString("translation", mcp.Description("new translation which would be updated")),
	)

	productTranslationUpdateToolHandler := func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {

		product_id, _ := request.RequireInt("product_id")
		language_id, _ := request.RequireInt("language_id")
		key, _ := request.RequireString("key")
		translation, _ := request.RequireString("translation")

		products, err := pt.Product.UpdateFieldTranslation(ctx, product_id, language_id, key, translation)
		if err != nil {
			return nil, err
		}

		result, err := mcp.NewToolResultJSON(map[string]any{
			"product":    products,
			"product_id": product_id,
		})
		if err != nil {
			return nil, err
		}

		return result, nil
	}

	return &MCPDef{Tool: productTranslationTool, ToolHandler: productTranslationUpdateToolHandler}
}

package tools

import (
	"context"

	"github.com/jmoiron/sqlx"
	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
	"github.com/tritac/katana-mcp-goo/apps/katana-mcp/mcp/productgrp"
	"github.com/tritac/katana-mcp-goo/internal/core/product"
)

type ToolHandler = func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error)

type KatanaTool struct {
	Name        string
	Description string
	Meta        *mcp.Meta
}

func NewKatanaTool(name, descriptions string, meta *mcp.Meta) *KatanaTool {
	return &KatanaTool{Name: name, Description: descriptions, Meta: meta}
}

func RegisterTool(katanaMCP *server.MCPServer, db *sqlx.DB) {

	// productListWidget := widget.ProductListWidget()

	productToolgrp := productgrp.ProductTool{
		Product: product.NewCore(db),
	}

	productListTool := productToolgrp.ProductListTool()
	productDetailTool := productToolgrp.ProductDetailTool()
	productTranslationUpdateTool := productToolgrp.ProductTranslationUpdateTool()

	katanaMCP.AddTool(productListTool.Tool, productListTool.ToolHandler)
	katanaMCP.AddTool(productDetailTool.Tool, productDetailTool.ToolHandler)
	katanaMCP.AddTool(productTranslationUpdateTool.Tool, productTranslationUpdateTool.ToolHandler)

}

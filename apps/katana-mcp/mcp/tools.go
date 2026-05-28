package tools

import (
	"context"

	"github.com/jmoiron/sqlx"
	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
	"github.com/tritac/katana-mcp-goo/apps/katana-mcp/mcp/productgrp"
	katanahttp "github.com/tritac/katana-mcp-goo/internal/client/katanaclient"
	"github.com/tritac/katana-mcp-goo/internal/core/language"
	"github.com/tritac/katana-mcp-goo/internal/core/product"
)

type ToolHandler = func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error)

type KatanaTool struct {
	Name        string
	Description string
	Meta        *mcp.Meta
	Kc          katanahttp.KatanaClient
}

func NewKatanaTool(name, descriptions string, meta *mcp.Meta, kc katanahttp.KatanaClient) *KatanaTool {
	return &KatanaTool{Name: name, Description: descriptions, Meta: meta, Kc: kc}
}

func RegisterTool(katanaMCP *server.MCPServer, db *sqlx.DB, kc *katanahttp.KatanaClient, langCore *language.Core) {

	productToolGrp := productgrp.ProductTool{
		Product: product.NewCore(db, kc, langCore),
	}

	productListTool := productToolGrp.ProductListTool()
	productDetailTool := productToolGrp.ProductDetailTool()
	productTranslationUpdateTool := productToolGrp.ProductTranslationUpdateTool()

	katanaMCP.AddTool(productListTool.Tool, productListTool.ToolHandler)
	katanaMCP.AddTool(productDetailTool.Tool, productDetailTool.ToolHandler)
	katanaMCP.AddTool(productTranslationUpdateTool.Tool, productTranslationUpdateTool.ToolHandler)
}

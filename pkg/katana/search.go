package katana

import (
	"context"
	"errors"
	"fmt"

	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
)

func SearchProduct() (tool mcp.Tool, handler server.ToolHandlerFunc) {
	return mcp.NewTool("search_product",
			mcp.WithDescription("search product from catlog "),
			mcp.WithToolAnnotation(mcp.ToolAnnotation{
				Title:        "search Products",
				ReadOnlyHint: toBoolPtr(true),
			}),
			mcp.WithString("query",
				mcp.Required(),
				mcp.Description("Search query"),
			),
		),
		func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
			err := errors.New("error")
			if err != nil {
				return nil, fmt.Errorf("failed to get GitHub client: %w", err)
			}

			if err != nil {
				return nil, fmt.Errorf("failed to marshal response: %w", err)
			}

			return mcp.NewToolResultText(string(err.Error())), nil
		}
}

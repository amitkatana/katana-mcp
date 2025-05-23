package katana

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"katanampc/internals/data"
	"katanampc/internals/kclient"

	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
)

type ProductMpc struct {
	api *kclient.Client
}

func NewProductMcp(host, key string) *ProductMpc {

	kclient := kclient.NewClient(host, key)

	return &ProductMpc{api: kclient}

}

func (p *ProductMpc) SearchProduct() (tool mcp.Tool, handler server.ToolHandlerFunc) {
	return mcp.NewTool("search_product",
			mcp.WithDescription("search product from catlog "),
			mcp.WithToolAnnotation(mcp.ToolAnnotation{
				Title:        "search Products",
				ReadOnlyHint: toBoolPtr(true),
			}),
			mcp.WithString("name",
				mcp.Required(),
				mcp.Description("product name of parts of the name "),
			),
			mcp.WithString("keyword", mcp.Description("Filters by Name, Descriptions, Sku, Tag, Language")),
		),
		func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {

			name, err := OptionalParam[string](request, "name")
			if err != nil {
				return mcp.NewToolResultError(err.Error()), nil
			}
			keyword, err := OptionalParam[string](request, "keyword")
			if err != nil {
				return mcp.NewToolResultError(err.Error()), nil
			}

			if err != nil {
				return mcp.NewToolResultError(err.Error()), nil
			}

			opts := &data.ProductOptions{
				Name:     name,
				Keywords: keyword,
				Paging: data.Paging{
					PageIndex: 0, PageSize: 50, DefaultPageSize: 50,
				},
			}

			result, resp, err := p.api.Product.GetProducts(ctx, opts)

			if err != nil {
				return nil, fmt.Errorf("failed to get products: %w", err)
			}
			defer func() { _ = resp.Body.Close() }()

			if resp.StatusCode != 200 {
				body, err := io.ReadAll(resp.Body)
				if err != nil {
					return nil, fmt.Errorf("failed to read response body: %w", err)

				}
				return mcp.NewToolResultError(fmt.Sprintf("failed to get commit: %s", string(body))), nil

			}

			if err != nil {
				return nil, fmt.Errorf("failed to marshal response: %w", err)
			}
			r, err := json.Marshal(result)

			return mcp.NewToolResultText(string(r)), nil
		}
}

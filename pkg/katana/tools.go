package katana

import (
	"katanampc/pkg/toolsets"
)

func InitToolsets(host, apiKey string) (*toolsets.ToolsetGroup, error) {
	tsg := toolsets.NewToolsetGroup(true)

	productMcp := NewProductMcp(host, apiKey)

	products := toolsets.NewToolset("product", "katana product related tools").AddReadTools(toolsets.NewServerTool(productMcp.SearchProduct()))

	tsg.AddToolset(products)

	return tsg, nil

}

func toBoolPtr(b bool) *bool {
	return &b
}

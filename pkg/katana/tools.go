package katana

import (
	"katanampc/pkg/toolsets"
)

func InitToolsets() (*toolsets.ToolsetGroup, error) {
	tsg := toolsets.NewToolsetGroup(true)

	products := toolsets.NewToolset("product", "katana product related tools").AddReadTools(toolsets.NewServerTool(SearchProduct()))

	tsg.AddToolset(products)

	return tsg, nil

}

func toBoolPtr(b bool) *bool {
	return &b
}

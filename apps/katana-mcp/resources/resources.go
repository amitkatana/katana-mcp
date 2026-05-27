package resources

import (
	_ "embed"

	"github.com/mark3labs/mcp-go/server"
	"github.com/tritac/katana-mcp-goo/apps/katana-mcp/resources/widget"
)

type ResourceRegister struct {
	ProductListHTML   string
	ProductDetailHTML string
}

func NewResourceRegister(productList, productDetail string) *ResourceRegister {
	return &ResourceRegister{
		ProductListHTML:   productList,
		ProductDetailHTML: productDetail,
	}
}

func (rr *ResourceRegister) RegisterResources(katanaMCP *server.MCPServer) {

	lr, lhr := widget.ProductListWidget(rr.ProductListHTML)
	pdr, pdrh := widget.ProductDetailWidget(rr.ProductDetailHTML)

	katanaMCP.AddResource(
		lr,
		lhr,
	)
	katanaMCP.AddResource(pdr, pdrh)
}

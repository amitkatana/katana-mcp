package resources

import (
	_ "embed"

	"github.com/mark3labs/mcp-go/server"
	"github.com/tritac/katana-mcp-goo/apps/katana-mcp/resources/widget"
	"github.com/tritac/katana-mcp-goo/internal/core/language"
)

type ResourceRegister struct {
	ProductListHTML        string
	ProductDetailHTML      string
	productTranslationHTML string
}

func NewResourceRegister(productList, productDetail, productTranslation string) *ResourceRegister {
	return &ResourceRegister{
		ProductListHTML:        productList,
		ProductDetailHTML:      productDetail,
		productTranslationHTML: productTranslation,
	}
}

func (rr *ResourceRegister) RegisterResources(katanaMCP *server.MCPServer, langCore *language.Core) {

	lr, lhr := widget.ProductListWidget(rr.ProductListHTML)
	pdr, pdrh := widget.ProductDetailWidget(rr.ProductDetailHTML)

	katanaMCP.AddResource(lr, lhr)
	katanaMCP.AddResource(pdr, pdrh)

	langRes, langHandler := LanguagesResource(langCore)
	katanaMCP.AddResource(langRes, langHandler)
}

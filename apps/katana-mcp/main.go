package main

import (
	_ "embed"
	"fmt"

	"github.com/mark3labs/mcp-go/server"
	tools "github.com/tritac/katana-mcp-goo/apps/katana-mcp/mcp"
	"github.com/tritac/katana-mcp-goo/apps/katana-mcp/resources"
	"github.com/tritac/katana-mcp-goo/internal/database"
)

//go:embed dist/product-detail.html
var productDetailHTML string

//go:embed dist/product-list.html
var productListHTML string

func main() {

	db, err := database.Open()
	fmt.Println(db.Stats())
	katanaMCP := server.NewMCPServer("katana-mcp", "1.0.0", server.WithResourceCapabilities(true, true))

	katanaMCPServer := server.NewStreamableHTTPServer(katanaMCP)

	tools.RegisterTool(katanaMCP, db)
	rr := resources.NewResourceRegister(productListHTML, productDetailHTML)
	rr.RegisterResources(katanaMCP)

	err = katanaMCPServer.Start(":8000")
	if err != nil {
		fmt.Println("Error starting server", err)
	}
}

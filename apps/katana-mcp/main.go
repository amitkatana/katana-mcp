package main

import (
	_ "embed"
	"errors"
	"fmt"

	"github.com/ardanlabs/conf/v3"
	"github.com/mark3labs/mcp-go/server"
	tools "github.com/tritac/katana-mcp-goo/apps/katana-mcp/mcp"
	"github.com/tritac/katana-mcp-goo/apps/katana-mcp/resources"
	"github.com/tritac/katana-mcp-goo/internal/client/katanaclient"
	"github.com/tritac/katana-mcp-goo/internal/core/language"
	"github.com/tritac/katana-mcp-goo/internal/database"
)

//go:embed dist/product-detail.html
var productDetailHTML string

//go:embed dist/product-list.html
var productListHTML string

//go:embed dist/translation-review.html
var productTranslationHTML string

const prefix = "KATANA"

func main() {
	err := run()
	if err != nil {
		fmt.Println(err)
	}
}

func run() error {

	type Conf struct {
		Host   string `conf:"default:localhost"`
		ApiKey string `conf:"default:test_ket"`
	}
	var cfg Conf
	help, err := conf.Parse(prefix, &cfg)
	fmt.Println(cfg)
	if err != nil {
		if errors.Is(err, conf.ErrHelpWanted) {
			fmt.Println(help)
			return nil
		}
		return fmt.Errorf("parsing config %w", &err)

	}

	db, err := database.Open()
	// fmt.Println(db.Stats())

	kc := katanaclient.NewKatanaClient(cfg.Host, cfg.ApiKey)

	katanaMCP := server.NewMCPServer("katana-mcp", "1.0.0", server.WithResourceCapabilities(true, true))

	katanaMCPServer := server.NewStreamableHTTPServer(katanaMCP)

	langCore := language.NewCore(kc)

	tools.RegisterTool(katanaMCP, db, kc, langCore)
	rr := resources.NewResourceRegister(productListHTML, productDetailHTML, productTranslationHTML)
	rr.RegisterResources(katanaMCP, langCore)

	err = katanaMCPServer.Start(":8000")
	if err != nil {
		fmt.Println("Error starting server", err)
	}
	return nil

}

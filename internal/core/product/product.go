package product

import (
	"context"
	"fmt"

	"github.com/jmoiron/sqlx"
	katanahttp "github.com/tritac/katana-mcp-goo/internal/client/katanaclient"
	"github.com/tritac/katana-mcp-goo/internal/data/product"
	"github.com/tritac/katana-mcp-goo/internal/data/translation"
)

type Core struct {
	product     product.Store
	translation translation.Store
	kc          *katanahttp.KatanaClient
}

func NewCore(db *sqlx.DB, kc *katanahttp.KatanaClient) Core {
	return Core{product: product.NewStore(db), translation: translation.NewStore(db), kc: kc}
}

func (c Core) Query(ctx context.Context, query string, limit int) (product.ResponseEnvelop, error) {
	var products product.ResponseEnvelop
	res, err := c.kc.KClient.R().SetQueryParam("PageSize", "10").SetQueryParam("includes", "translations").SetResult(&products).Get("/products")

	fmt.Println(string(res.Bytes()))

	if err != nil {
		return product.ResponseEnvelop{}, err
	}
	return products, err
}

func (c Core) Find(ctx context.Context, productId int) (product.ProductDetail, error) {

	res, err := c.kc.KClient.R().Get("/products")

	if err != nil {
		return product.ProductDetail{}, fmt.Errorf("failed to get products ")
	}
	fmt.Println(string(res.Bytes()))

	return product.ProductDetail{}, err
}

func (c Core) UpdateFieldTranslation(ctx context.Context, product_id, language_id int, key, translation string) (bool, error) {
	update, err := c.translation.UpdateProductTranslation(ctx, product_id, language_id, key, translation)
	if err != nil {
		return false, err
	}

	return update, err
}

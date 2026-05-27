package product

import (
	"context"
	"fmt"
	"strconv"

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
	res, err := c.kc.KClient.R().SetQueryParam("Paging.PageSize", "10").SetQueryParam("Keywords", query).SetResult(&products).Get("/v1/Product")

	fmt.Println(string(res.Bytes()))

	if err != nil {
		return product.ResponseEnvelop{}, err
	}
	return products, err
}

func (c Core) Find(ctx context.Context, productId int) (product.ProductResponse, error) {

	idstring := strconv.Itoa(productId)

	var prod product.ProductResponse
	res, err := c.kc.KClient.R().SetPathParam("productId", idstring).Get("/v2/products/{productId}")
	fmt.Println(string(res.Bytes()), err)
	if err != nil {
		return product.ProductResponse{}, fmt.Errorf("failed to get products %w", err)
	}

	return prod, err
}

func (c Core) UpdateFieldTranslation(ctx context.Context, product_id, language_id int, key, translation string) (bool, error) {
	update, err := c.translation.UpdateProductTranslation(ctx, product_id, language_id, key, translation)
	if err != nil {
		return false, err
	}

	return update, err
}

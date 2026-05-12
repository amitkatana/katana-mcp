package product

import (
	"context"
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/tritac/katana-mcp-goo/internal/data/product"
	"github.com/tritac/katana-mcp-goo/internal/data/translation"
)

type Core struct {
	product     product.Store
	translation translation.Store
}

func NewCore(db *sqlx.DB) Core {
	return Core{product: product.NewStore(db), translation: translation.NewStore(db)}
}

func (c Core) Query(ctx context.Context, query string, limit int) ([]product.Product, error) {
	products, err := c.product.Query(ctx, limit, query)
	if err != nil {
		return nil, fmt.Errorf("query: %w", err)
	}
	return products, nil
}

func (c Core) Find(ctx context.Context, productId int) (product.ProductDetail, error) {

	productDetail, err := c.product.Find(ctx, productId)
	productDetail.ShortDescription = []translation.TranslationValue{}
	productDetail.FullDescription = []translation.TranslationValue{}

	productTranslations, err := c.translation.ProductGeneralFieldTranslations(ctx, productId)

	for _, t := range productTranslations {
		item := translation.TranslationValue{
			LanguageId:      t.LanguageId,
			Value:           t.LocaleValue,
			LanguageCulture: t.LanguageCulture,
			Key:             t.LocaleKey,
		}

		switch t.LocaleKey {

		case "ShortDescription":
			productDetail.ShortDescription = append(
				productDetail.ShortDescription,
				item,
			)

		case "FullDescription":
			productDetail.FullDescription = append(
				productDetail.FullDescription,
				item,
			)
		}

	}

	if err != nil {
		return productDetail, fmt.Errorf("query: %w", err)
	}

	return productDetail, nil

}

func (c Core) UpdateFieldTranslation(ctx context.Context, product_id, language_id int, key, translation string) (bool, error) {
	update, err := c.translation.UpdateProductTranslation(ctx, product_id, language_id, key, translation)
	if err != nil {
		return false, err
	}

	return update, err
}

package product

import (
	"context"

	"github.com/jmoiron/sqlx"
)

type Store struct {
	db *sqlx.DB
}

func NewStore(db *sqlx.DB) Store {
	return Store{
		db: db,
	}

}

func (s Store) Query(ctx context.Context, limit int, search string) ([]Product, error) {
	query := `
		SELECT TOP (@p1) Id, Name, Sku, Gtin, ExternalKey, Published
		FROM Product
	`

	args := []any{limit}

	if search != "" {
		query += `
			WHERE
				Name LIKE '%' + @p2 + '%' OR
				Sku LIKE '%' + @p2 + '%' OR
				Gtin LIKE '%' + @p2 + '%' OR
				ExternalKey LIKE '%' + @p2 + '%'
			ORDER BY Name
		`

		args = append(args, search)

	} else {
		query += `
			ORDER BY UpdatedOnUtc DESC
		`
	}

	var products []Product

	err := s.db.SelectContext(
		ctx,
		&products,
		query,
		limit,
		search,
	)
	if err != nil {
		return nil, err
	}

	return products, nil
}

func (s Store) Find(ctx context.Context, productId int) (ProductDetail, error) {
	query := `
		SELECT Id,ProductTypeId, Name, Sku, Gtin, ExternalKey, Price, OldPrice,
			StockQuantity,
			Published,
			CreatedOnUtc,
			UpdatedOnUtc
		FROM Product
		WHERE Id = @p1
		  AND Deleted = 0
	`

	var product ProductDetail

	err := s.db.GetContext(
		ctx,
		&product,
		query,
		productId,
	)
	if err != nil {
		return product, err
	}

	return product, nil

}

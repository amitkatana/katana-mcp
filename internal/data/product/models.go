package product

import (
	"time"

	"github.com/tritac/katana-mcp-goo/internal/data/translation"
)

// Product represents an individual product.
type Product struct {
	ID          int     `db:"Id" json:"id"`
	Name        string  `db:"Name" json:"name"`
	SKU         *string `db:"Sku" json:"sku"`
	GTIN        *string `db:"Gtin" json:"gtin"`
	ExternalKey *string `db:"ExternalKey" json:"externalKey"`
	Published   bool    `db:"Published" json:"published"`
}

type ProductDetail struct {
	Id               int                            `db:"Id"`
	ProductTypeId    int                            `db:"ProductTypeId"`
	Name             string                         `db:"Name"`
	ShortDescription []translation.TranslationValue `json:"shortDescription"`
	FullDescription  []translation.TranslationValue `json:"FullDescription"`

	Sku           string    `db:"Sku"`
	Gtin          string    `db:"Gtin"`
	ExternalKey   string    `db:"ExternalKey"`
	Price         float64   `db:"Price"`
	OldPrice      float64   `db:"OldPrice"`
	StockQuantity int       `db:"StockQuantity"`
	Published     bool      `db:"Published"`
	CreatedOnUtc  time.Time `db:"CreatedOnUtc"`
	UpdatedOnUtc  time.Time `db:"UpdatedOnUtc"`
}

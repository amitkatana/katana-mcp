package product

import "time"

type Product struct {
	ID          int     `db:"Id" json:"id"`
	Name        string  `db:"Name" json:"name"`
	SKU         *string `db:"Sku" json:"sku"`
	GTIN        *string `db:"Gtin" json:"gtin"`
	ExternalKey *string `db:"ExternalKey" json:"externalKey"`
	Published   bool    `db:"Published" json:"published"`
}

type ProductDetail struct {
	Id            int       `db:"Id" json:"id"`
	ProductTypeId int       `db:"ProductTypeId" json:"productTypeId"`
	Name          string    `db:"Name" json:"name"`
	Sku           string    `db:"Sku" json:"sku"`
	Gtin          string    `db:"Gtin" json:"gtin"`
	ExternalKey   string    `db:"ExternalKey" json:"externalKey"`
	Price         float64   `db:"Price" json:"price"`
	OldPrice      float64   `db:"OldPrice" json:"oldPrice"`
	StockQuantity int       `db:"StockQuantity" json:"stockQuantity"`
	Published     bool      `db:"Published" json:"published"`
	CreatedOnUtc  time.Time `db:"CreatedOnUtc" json:"createdOnUtc"`
	UpdatedOnUtc  time.Time `db:"UpdatedOnUtc" json:"updatedOnUtc"`
}

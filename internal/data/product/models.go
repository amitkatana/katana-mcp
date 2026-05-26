package product

import (
	"strings"
	"time"

	"github.com/tritac/katana-mcp-goo/internal/data/translation"
)

type Translations struct {
	Language Language `json:"language,omitempty"`
	Value    Value    `json:"value,omitempty"`
}
type Language struct {
	ID               int    `json:"id,omitempty"`
	TwoLetterIsoCode string `json:"twoLetterIsoCode,omitempty"`
}
type Value struct {
	Name             any `json:"name,omitempty"`
	Shortdescription any `json:"shortdescription,omitempty"`
	FullDescription  any `json:"fullDescription,omitempty"`
	MetaTitle        any `json:"metaTitle,omitempty"`
	MetaDescription  any `json:"metaDescription,omitempty"`
}

type ResponseEnvelop struct {
	PageIndex  int               `json:"pageIndex"`
	PageSize   int               `json:"pageSize"`
	TotalCount int               `json:"totalCount"`
	TotalPages int               `json:"totalPages"`
	Items      []ProductResponse `json:"items"`
}

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

type RFC3339ts struct {
	time.Time
}

func (ct *RFC3339ts) UnmarshalJSON(b []byte) error {
	s := strings.Trim(string(b), `"`)
	if s == "null" || s == "" {
		return nil
	}
	layout := "2006-01-02T15:04:05.9999999"

	t, err := time.Parse(layout, s)
	if err != nil {
		return err
	}

	ct.Time = t.UTC()
	return nil
}

type ProductResponse struct {
	ID                     int64          `json:"id"`
	Name                   string         `json:"name"`
	Shortdescription       string         `json:"shortdescription"`
	FullDescription        string         `json:"fullDescription"`
	Sku                    string         `json:"sku"`
	Gtin                   string         `json:"gtin"`
	ExternalKey            string         `json:"externalKey"`
	ProductType            ProductType    `json:"productType"`
	MetaTitle              string         `json:"metaTitle"`
	MetaDescription        string         `json:"metaDescription"`
	StockQuantity          int64          `json:"stockQuantity"`
	ProductCost            float32        `json:"productCost"`
	Price                  float32        `json:"price"`
	OldPrice               float32        `json:"oldPrice"`
	SpecialPrice           float32        `json:"specialPrice"`
	Published              bool           `json:"published"`
	Translations           []Translations `json:"translations"`
	ManufacturerPartNumber string         `json:"manufacturerPartNumber"`
	CreatedOnUTC           RFC3339ts      `json:"createdOnUtc"`
	UpdatedOnUTC           RFC3339ts      `json:"updatedOnUtc"`
}

type ProductType struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

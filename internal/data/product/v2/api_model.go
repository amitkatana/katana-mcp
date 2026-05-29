package product_v2

type ProductDetail struct {
	ID                     int            `json:"id"`
	Name                   string         `json:"name"`
	Shortdescription       string         `json:"shortdescription"`
	FullDescription        string         `json:"fullDescription"`
	Sku                    string         `json:"sku"`
	Gtin                   string         `json:"gtin"`
	ExternalKey            string         `json:"externalKey"`
	ProductType            ProductType    `json:"productType"`
	MetaTitle              string         `json:"metaTitle"`
	MetaDescription        string         `json:"metaDescription"`
	StockQuantity          int            `json:"stockQuantity"`
	ProductCost            float64        `json:"productCost"`
	Price                  float64        `json:"price"`
	OldPrice               float64        `json:"oldPrice"`
	SpecialPrice           any            `json:"specialPrice"`
	Published              bool           `json:"published"`
	ManufacturerPartNumber string         `json:"manufacturerPartNumber"`
	Translations           []Translations `json:"translations"`
	CreatedOnUtc           string         `json:"createdOnUtc"`
	UpdatedOnUtc           string         `json:"updatedOnUtc"`
}
type ProductType struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}
type Language struct {
	ID               int    `json:"id"`
	TwoLetterIsoCode string `json:"twoLetterIsoCode"`
}
type Value struct {
	Name             string `json:"name"`
	Shortdescription string `json:"shortdescription"`
	FullDescription  any    `json:"fullDescription"`
	MetaTitle        any    `json:"metaTitle"`
	MetaDescription  any    `json:"metaDescription"`
}
type Translations struct {
	Language Language `json:"language"`
	Value    Value    `json:"value"`
}

// PATCH VALUEW

type PatchValue struct {
	Name             *string `json:"name,omitempty"`
	Shortdescription *string `json:"shortdescription,omitempty"`
	FullDescription  *string `json:"fullDescription,omitempty"`
	MetaTitle        *string `json:"metaTitle,omitempty"`
	MetaDescription  *string `json:"metaDescription,omitempty"`
}

type PatchTranslation struct {
	Language Language   `json:"language"`
	Value    PatchValue `json:"value"`
}

type PatchProductType struct {
	ID int `json:"id"`
}

type ProductPatchRequest struct {
	Name         string             `json:"name"`
	ProductType  PatchProductType   `json:"productType"`
	Translations []PatchTranslation `json:"translations,omitempty"`
}

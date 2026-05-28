package product

import (
	"encoding/json"
	"fmt"
)

type ProductType int64

const (
	SimpleProduct      ProductType = 5
	ChildProduct       ProductType = 15
	ParentProduct      ProductType = 30
	GrandParentProduct ProductType = 40
)

type ResponseEnvelop struct {
	PageIndex  int               `json:"pageIndex"`
	PageSize   int               `json:"pageSize"`
	TotalCount int               `json:"totalCount"`
	TotalPages int               `json:"totalPages"`
	Items      []ProductResponse `json:"items"`
}

type ProductResponse struct {
	ID int `json:"Id"`

	CreatedOnUtc           string          `json:"CreatedOnUtc"`
	UpdatedOnUtc           string          `json:"UpdatedOnUtc"`
	ProductType            ProductType     `json:"ProductType"`
	ProductTypeDescription string          `json:"ProductTypeDescription"`
	Collections            Collections     `json:"Collections"`
	TextFieldsModel        TextFieldsModel `json:"TextFieldsModel"`
}

type TextFieldsModel struct {
	Sku                    string `json:"Sku"`
	Gtin                   any    `json:"Gtin"`
	Name                   string `json:"Name"`
	ShortDescription       any    `json:"ShortDescription"`
	FullDescription        any    `json:"FullDescription"`
	ManufacturerPartNumber any    `json:"ManufacturerPartNumber"`
	EmbeddedVideo          any    `json:"EmbeddedVideo"`
	Slug                   string `json:"Slug"`
	MetaKeywords           string `json:"MetaKeywords"`
	MetaDescription        any    `json:"MetaDescription"`
}

type Collections struct {
	Images []Images `json:"Images"`
}

type Images struct {
	ID           int    `json:"Id"`
	URL          string `json:"Url"`
	AltTag       any    `json:"AltTag"`
	DisplayOrder int    `json:"DisplayOrder"`
}

func (p *ProductType) UnmarshalJSON(data []byte) error {
	// Case 1: integer enum
	var id int64
	if err := json.Unmarshal(data, &id); err == nil {
		*p = ProductType(id)
		return nil
	}

	// Case 2: object
	var obj struct {
		ID int64 `json:"id"`
	}

	if err := json.Unmarshal(data, &obj); err == nil {
		*p = ProductType(obj.ID)
		return nil
	}

	return fmt.Errorf("invalid ProductType")
}

func (p ProductType) String() string {
	switch p {
	case SimpleProduct:
		return "SimpleProduct"
	case ChildProduct:
		return "ChildProduct"
	case ParentProduct:
		return "ParentProduct"
	case GrandParentProduct:
		return "GrandParentProduct"
	default:
		return "Unknown"
	}
}

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

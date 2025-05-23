package data

type Attribute struct {
	ID          int    `json:"Id"`
	Name        string `json:"Name"`
	Description string `json:"Description"`
	Values      []struct {
		ID              int    `json:"Id"`
		Name            string `json:"Name"`
		PriceAdjustment int    `json:"PriceAdjustment"`
	} `json:"Values"`
}

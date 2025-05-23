package data

type Categories struct {
	ID             int         `json:"Id"`
	Name           string      `json:"Name"`
	Code           string      `json:"Code"`
	Description    string      `json:"Description"`
	DisplayOrder   int         `json:"DisplayOrder"`
	ParentCategory interface{} `json:"ParentCategory,omitempty"`
}

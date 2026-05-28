package language

type Language struct {
	ID              int    `json:"id"`
	Name            string `json:"name"`
	LanguageCulture string `json:"languageCulture"`
	LanguageCode    string `json:"languageCode"`
	Published       bool   `json:"published"`
	IsDefault       bool   `json:"isDefault"`
	CreatedOnUtc    string `json:"createdOnUtc"`
	UpdatedOnUtc    string `json:"updatedOnUtc"`
}

type ResponseEnvelope struct {
	PageIndex  int        `json:"pageIndex"`
	PageSize   int        `json:"pageSize"`
	TotalCount int        `json:"totalCount"`
	TotalPages int        `json:"totalPages"`
	Items      []Language `json:"items"`
}

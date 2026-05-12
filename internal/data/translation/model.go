package translation

type LocaleRow struct {
	LanguageId      int    `db:"LanguageId"`
	LocaleKey       string `db:"LocaleKey"`
	LocaleValue     string `db:"LocaleValue"`
	LanguageCulture string `db:"LanguageCulture"`
}

type TranslationValue struct {
	LanguageId      int    `json:"languageId"`
	Value           string `json:"value"`
	LanguageCulture string `json:"languageCulture"`
	Key             string `json:"LocaleKey"`
}

type LocalizedProperty struct {
	LocaleKey string             `json:"localeKey"`
	Values    []TranslationValue `json:"values"`
}

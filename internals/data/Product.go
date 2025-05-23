package data

type Paging struct {
	PageIndex       int `url:PageIndex,omitempty`
	PageSize        int `url:PageSize,omitempty`
	DefaultPageSize int `url:DefaultPageSize,omitempty`
}

type ProductOptions struct {
	id       int    `url:"Id,omitempty"`
	Name     string `url:"Name,omitempty"`
	Keywords string `url:"Keywords,omitempty"`
	Paging   Paging `url:"Paging"`
}

type PagedProducts struct {
	PageIndex  int       `json:"PageIndex"`
	PageSize   int       `json:"PageSize"`
	TotalCount int       `json:"TotalCount"`
	TotalPages int       `json:"TotalPages"`
	Items      []Product `json:"Items"`
}

type Product struct {
	ID                     int                   `json:"Id"`
	CreatedOnUtc           string                `json:"CreatedOnUtc"`
	UpdatedOnUtc           string                `json:"UpdatedOnUtc"`
	ProductType            int                   `json:"ProductType"`
	ProductTypeDescription string                `json:"ProductTypeDescription"`
	PimSeverity            string                `json:"PimSeverity"`
	PimStatus              string                `json:"PimStatus"`
	SortOrder              int                   `json:"SortOrder"`
	ExternalKey            string                `json:"ExternalKey"`
	GrandParentExternalKey string                `json:"GrandParentExternalKey"`
	ParentExternalKey      string                `json:"ParentExternalKey"`
	ParentID               int                   `json:"ParentId"`
	GrandParentID          int                   `json:"GrandParentId"`
	Collections            Collections           `json:"Collections"`
	Dimensions             Dimensions            `json:"Dimensions"`
	Package                Package               `json:"Package"`
	FirstOnStockDate       string                `json:"FirstOnStockDate"`
	Settings               Settings              `json:"Settings"`
	EcommerceSettings      EcommerceSettings     `json:"EcommerceSettings"`
	OrderSettings          OrderSettings         `json:"OrderSettings"`
	Prices                 Prices                `json:"Prices"`
	Stock                  Stock                 `json:"Stock"`
	TextFieldsModel        TextFieldsModel       `json:"TextFieldsModel"`
	Vendor                 Vendor                `json:"Vendor"`
	Reviews                Reviews               `json:"Reviews"`
	AdditionProducts       AdditionProducts      `json:"AdditionProducts"`
	Download               Download              `json:"Download"`
	Recurring              Recurring             `json:"Recurring"`
	Rental                 Rental                `json:"Rental"`
	LocalizedProperties    []LocalizedProperties `json:"LocalizedProperties"`
}

type Values struct {
	ID              int    `json:"Id"`
	Name            string `json:"Name"`
	PriceAdjustment int    `json:"PriceAdjustment"`
}
type Attributes struct {
	ID          int      `json:"Id"`
	Name        string   `json:"Name"`
	Description string   `json:"Description"`
	Values      []Values `json:"Values"`
}
type Specs struct {
	ID                             int    `json:"Id"`
	SpecificationAttributeID       int    `json:"SpecificationAttributeId"`
	SpecificationAttributeOptionID int    `json:"SpecificationAttributeOptionId"`
	Name                           string `json:"Name"`
	Code                           string `json:"Code"`
	Description                    string `json:"Description"`
	DisplayOrder                   int    `json:"DisplayOrder"`
	AttributeTypeID                int    `json:"AttributeTypeId"`
	OptionName                     string `json:"OptionName"`
	OptionCode                     string `json:"OptionCode"`
	OptionSubtitle                 string `json:"OptionSubtitle"`
}
type SpecificationGroups struct {
	ID   int    `json:"Id"`
	Name string `json:"Name"`
	Code string `json:"Code"`
}
type Attachments struct {
	ID  int    `json:"Id"`
	URL string `json:"Url"`
}
type Images struct {
	ID           int    `json:"Id"`
	URL          string `json:"Url"`
	AltTag       string `json:"AltTag"`
	DisplayOrder int    `json:"DisplayOrder"`
}
type Tags struct {
	ID   int    `json:"Id"`
	Name string `json:"Name"`
}
type Labels struct {
	ID        int    `json:"Id"`
	Name      string `json:"Name"`
	SortOrder int    `json:"SortOrder"`
}
type LimitedToStores struct {
	ID         int    `json:"Id"`
	SystemName string `json:"SystemName"`
	Name       string `json:"Name"`
}
type LocalizedProperties struct {
	LanguageID      int    `json:"LanguageId"`
	LanguageCulture string `json:"LanguageCulture"`
	LocaleKey       string `json:"LocaleKey"`
	LocaleValue     string `json:"LocaleValue"`
}
type Limitations struct {
	ID         int    `json:"Id"`
	SystemName string `json:"SystemName"`
	Name       string `json:"Name"`
}
type Manufacturers struct {
	ID                  int                   `json:"Id"`
	Name                string                `json:"Name"`
	Description         string                `json:"Description"`
	Slug                string                `json:"Slug"`
	Code                string                `json:"Code"`
	Published           bool                  `json:"Published"`
	StoreID             int                   `json:"StoreId"`
	LocalizedProperties []LocalizedProperties `json:"LocalizedProperties"`
	Limitations         []Limitations         `json:"Limitations"`
}
type ImageTypes struct {
	Name         string   `json:"Name"`
	URL          string   `json:"Url"`
	AltTag       string   `json:"AltTag"`
	DisplayOrder int      `json:"DisplayOrder"`
	Attributes   []string `json:"Attributes"`
}
type ImageGroups struct {
	Name       string       `json:"Name"`
	ImageTypes []ImageTypes `json:"ImageTypes"`
}
type AssociatedProducts struct {
	ID          int    `json:"Id"`
	Sku         string `json:"SKU"`
	ExternalKey string `json:"ExternalKey"`
}
type RelatedProducts struct {
	ID int `json:"Id"`
}
type CrossSellProducts struct {
	ID int `json:"Id"`
}
type Collections struct {
	Categories          []Categories          `json:"Categories"`
	Attributes          []Attributes          `json:"Attributes"`
	Specs               []Specs               `json:"Specs"`
	SpecificationGroups []SpecificationGroups `json:"SpecificationGroups"`
	ChildProducts       []string              `json:"ChildProducts"`
	Attachments         []Attachments         `json:"Attachments"`
	Images              []Images              `json:"Images"`
	Tags                []Tags                `json:"Tags"`
	Labels              []Labels              `json:"Labels"`
	LimitedToStores     []LimitedToStores     `json:"LimitedToStores"`
	Manufacturers       []Manufacturers       `json:"Manufacturers"`
	ImageGroups         []ImageGroups         `json:"ImageGroups"`
	AssociatedProducts  []AssociatedProducts  `json:"AssociatedProducts"`
	RelatedProducts     []RelatedProducts     `json:"RelatedProducts"`
	CrossSellProducts   []CrossSellProducts   `json:"CrossSellProducts"`
}
type Dimensions struct {
	Weight float32 `json:"Weight"`
	Length float32 `json:"Length"`
	Width  float32 `json:"Width"`
	Height float32 `json:"Height"`
}
type Package struct {
	Size     int    `json:"Size"`
	Unit     string `json:"Unit"`
	UnitItem string `json:"UnitItem"`
}
type Settings struct {
	LimitedToStores                                        bool   `json:"LimitedToStores"`
	DeliveryDate                                           string `json:"DeliveryDate"`
	IsTelecommunicationsOrBroadcastingOrElectronicServices bool   `json:"IsTelecommunicationsOrBroadcastingOrElectronicServices"`
	ManageInventoryMethod                                  string `json:"ManageInventoryMethod"`
	UseMultipleWarehouses                                  bool   `json:"UseMultipleWarehouses"`
	AllowBackInStockSubscriptions                          bool   `json:"AllowBackInStockSubscriptions"`
	HasPriceBookItems                                      bool   `json:"HasPriceBookItems"`
	HasDiscountsApplied                                    bool   `json:"HasDiscountsApplied"`
	AvailableStartDateTimeUtc                              string `json:"AvailableStartDateTimeUtc"`
	AvailableEndDateTimeUtc                                string `json:"AvailableEndDateTimeUtc"`
	Published                                              bool   `json:"Published"`
	ShowOnHomePage                                         bool   `json:"ShowOnHomePage"`
	IsGiftcard                                             bool   `json:"IsGiftcard"`
}
type EcommerceSettings struct {
	DisableBuyButton                     bool   `json:"DisableBuyButton"`
	DisableWishlistButton                bool   `json:"DisableWishlistButton"`
	AvailableForPreOrder                 bool   `json:"AvailableForPreOrder"`
	PreOrderAvailabilityStartDateTimeUtc string `json:"PreOrderAvailabilityStartDateTimeUtc"`
}
type OrderSettings struct {
	OrderMinimumQuantity int    `json:"OrderMinimumQuantity"`
	OrderMaximumQuantity int    `json:"OrderMaximumQuantity"`
	IsShipEnabled        bool   `json:"IsShipEnabled"`
	AllowCancelling      bool   `json:"AllowCancelling"`
	AllowReturns         bool   `json:"AllowReturns"`
	IsFreeShipping       bool   `json:"IsFreeShipping"`
	ShipSeparately       bool   `json:"ShipSeparately"`
	AllowedQuantities    string `json:"AllowedQuantities"`
}
type CurrentPriceBookItem struct {
	CostPrice int `json:"CostPrice"`
	Price     int `json:"Price"`
}
type PriceBookItems struct {
	CostPrice  int    `json:"CostPrice"`
	Price      int    `json:"Price"`
	OldPrice   int    `json:"OldPrice"`
	NewPrice   int    `json:"NewPrice"`
	StartDate  string `json:"StartDate"`
	EndDate    string `json:"EndDate"`
	Quantity   int    `json:"Quantity"`
	BatchName  string `json:"BatchName"`
	StoreID    int    `json:"StoreId"`
	SystemName string `json:"SystemName"`
}
type Prices struct {
	AdditionalShippingCharge     float32              `json:"AdditionalShippingCharge"`
	IsTaxExempt                  bool                 `json:"IsTaxExempt"`
	TaxCategoryID                float32              `json:"TaxCategoryId"`
	TaxCategoryDescription       string               `json:"TaxCategoryDescription"`
	OldPrice                     float32              `json:"OldPrice"`
	CustomerEntersPrice          bool                 `json:"CustomerEntersPrice"`
	MinimumCustomerEnteredPrice  float32              `json:"MinimumCustomerEnteredPrice"`
	MaximumCustomerEnteredPrice  float32              `json:"MaximumCustomerEnteredPrice"`
	CurrentPriceBookItem         CurrentPriceBookItem `json:"CurrentPriceBookItem"`
	PriceBookItems               []PriceBookItems     `json:"PriceBookItems"`
	Currency                     string               `json:"Currency"`
	SpecialPrice                 float32              `json:"SpecialPrice"`
	SpecialPriceStartDateTimeUtc string               `json:"SpecialPriceStartDateTimeUtc"`
	SpecialPriceEndDateTimeUtc   string               `json:"SpecialPriceEndDateTimeUtc"`
}
type Stock struct {
	TotalStock                  int    `json:"TotalStock"`
	MinStockQuantity            int    `json:"MinStockQuantity"`
	LowStockActivity            string `json:"LowStockActivity"`
	NotifyAdminForQuantityBelow int    `json:"NotifyAdminForQuantityBelow"`
	BackorderMode               string `json:"BackorderMode"`
	BackorderDeliveryDate       string `json:"BackorderDeliveryDate"`
}
type TextFieldsModel struct {
	Sku                    string `json:"Sku"`
	Gtin                   string `json:"Gtin"`
	Name                   string `json:"Name"`
	ShortDescription       string `json:"ShortDescription"`
	FullDescription        string `json:"FullDescription"`
	ManufacturerPartNumber string `json:"ManufacturerPartNumber"`
	EmbeddedVideo          string `json:"EmbeddedVideo"`
	Slug                   string `json:"Slug"`
	MetaKeywords           string `json:"MetaKeywords"`
	MetaDescription        string `json:"MetaDescription"`
	MetaTitle              string `json:"MetaTitle"`
}
type Vendor struct {
	ID   int    `json:"Id"`
	Name string `json:"Name"`
}
type Reviews struct {
	AllowCustomerReviews bool `json:"AllowCustomerReviews"`
	ApprovedRatingSum    int  `json:"ApprovedRatingSum"`
	ApprovedTotalReviews int  `json:"ApprovedTotalReviews"`
}
type AdditionProducts struct {
	RequireOtherProducts             bool   `json:"RequireOtherProducts"`
	RequiredProductIds               string `json:"RequiredProductIds"`
	AutomaticallyAddRequiredProducts bool   `json:"AutomaticallyAddRequiredProducts"`
}
type Download struct {
	IsDownload             bool   `json:"IsDownload"`
	MaxNumberOfDownloads   int    `json:"MaxNumberOfDownloads"`
	UnlimitedDownloads     bool   `json:"UnlimitedDownloads"`
	DownloadExpirationDays int    `json:"DownloadExpirationDays"`
	HasSampleDownload      bool   `json:"HasSampleDownload"`
	HasUserAgreement       bool   `json:"HasUserAgreement"`
	UserAgreementText      string `json:"UserAgreementText"`
}
type Recurring struct {
	IsRecurring          bool   `json:"IsRecurring"`
	RecurringCycleLength int    `json:"RecurringCycleLength"`
	RecurringCyclePeriod string `json:"RecurringCyclePeriod"`
	RecurringTotalCycles int    `json:"RecurringTotalCycles"`
}
type Rental struct {
	IsRental          bool   `json:"IsRental"`
	RentalPriceLength int    `json:"RentalPriceLength"`
	RentalPricePeriod string `json:"RentalPricePeriod"`
}

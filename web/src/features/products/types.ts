export type Localization = {
  LanguageId: number;
  LanguageCulture: string;
  IsDefault: boolean | number;
  LocaleValue: string;
};

export type ProductImage = {
  Id: number;
  Url: string;
  AltTag: string | null;
  DisplayOrder: number;
};

export type ProductCollections = {
  Images?: ProductImage[];
};

export type ProductTextFields = {
  Sku: string;
  Gtin?: string | null;
  Name: string;
  ShortDescription?: string | null;
  FullDescription?: string | null;
  ManufacturerPartNumber?: string | null;
  EmbeddedVideo?: string | null;
  Slug?: string;
  MetaKeywords?: string;
  MetaDescription?: string | null;
};

export type Product = {
  Id: number;
  CreatedOnUtc?: string;
  UpdatedOnUtc?: string;
  ProductType: number;
  ProductTypeDescription: string;
  Collections?: ProductCollections;
  TextFieldsModel: ProductTextFields;
};

export type ResponseEnvelope = {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  items: Product[];
};

export type ProductsOutput = {
  products: ResponseEnvelope;
  query?: string;
  limit?: number;
  error?: string;
};

export type LocalizedString = {
  languageId: number;
  languageCulture: string;
  value: string;
  LocaleKey?: string;
};

export type ProductDetail = {
  Id: number;
  ProductTypeId: number | null;
  Name: string;
  Sku: string;
  Gtin: string;
  ExternalKey: string;
  Price: number;
  OldPrice: number;
  StockQuantity: number;
  Published: boolean;
  CreatedOnUtc: string | null;
  UpdatedOnUtc: string | null;
  shortDescription: LocalizedString[] | null;
  FullDescription: LocalizedString[] | null;
};

export type ProductDetailOutput = {
  product: ProductDetail;
  product_id: number;
  error?: string;
};

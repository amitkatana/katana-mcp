export type Localization = {
  LanguageId: number;
  LanguageCulture: string;
  IsDefault: boolean | number;
  LocaleValue: string;
};

export type Product = {
  id: number;
  product_type_id: number | null;
  name: string;
  external_key: string | null;
  gtin: string | null;
  sku: string | null;
  created_on_utc: string | null;
  updated_on_utc: string | null;
  is_published: boolean;
  price: number | null;
  short_description: string | null;
  full_description: string | null;
  localizations: Localization[];
};

export type ProductsOutput = {
  products: Product[];
  search?: string;
  limit?: number;
  selected_id?: number;
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
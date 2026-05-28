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

export type ProductType = {
  id: number;
  name: string;
};

export type TranslationLanguage = {
  id: number;
  twoLetterIsoCode: string;
};

export type TranslationValue = {
  name: string | null;
  shortdescription: string | null;
  fullDescription: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
};

export type ProductTranslation = {
  language: TranslationLanguage;
  value: TranslationValue;
};

export type ProductDetail = {
  id: number;
  name: string;
  shortdescription: string | null;
  fullDescription: string | null;
  sku: string;
  gtin: string;
  externalKey: string;
  productType: ProductType;
  metaTitle: string | null;
  metaDescription: string | null;
  stockQuantity: number;
  productCost: number;
  price: number;
  oldPrice: number;
  specialPrice: number | null;
  published: boolean;
  manufacturerPartNumber: string | null;
  translations: ProductTranslation[];
  createdOnUtc: string | null;
  updatedOnUtc: string | null;
};

export type Language = {
  id: number;
  name: string;
  languageCulture: string;
  languageCode: string;
  published: boolean;
  isDefault: boolean;
  createdOnUtc?: string;
  updatedOnUtc?: string;
};

export type ProductDetailOutput = {
  product: ProductDetail;
  product_id: number;
  languages?: Language[];
  error?: string;
};

export type TranslationFieldKey =
  | "name"
  | "shortdescription"
  | "fullDescription"
  | "metaTitle"
  | "metaDescription";

export const TRANSLATION_FIELDS: {
  key: TranslationFieldKey;
  label: string;
  localeKey: string;
}[] = [
  { key: "name", label: "Name", localeKey: "Name" },
  {
    key: "shortdescription",
    label: "Short description",
    localeKey: "ShortDescription",
  },
  {
    key: "fullDescription",
    label: "Full description",
    localeKey: "FullDescription",
  },
  { key: "metaTitle", label: "Meta title", localeKey: "MetaTitle" },
  {
    key: "metaDescription",
    label: "Meta description",
    localeKey: "MetaDescription",
  },
];

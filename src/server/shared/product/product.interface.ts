export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  isAvailable: boolean;
};

export type ProductVariant = {
  id: string;
  productId: string;
  sku: string;
  name: string;
  price: number;
  isAvailable: boolean;
  displayOrder: number;
};

export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  displayOrder: number;
};

export type ProductDetail = Product & {
  variants: ProductVariant[];
  images: ProductImage[];
};

export type ProductListItem = Product & {
  primaryVariant: ProductVariant | null;
};

export type ListProductsFilter = {
  search?: string;
  category?: string;
  isAvailable?: boolean;
  includeInactive?: boolean;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  limit: number;
  offset: number;
};

export interface IProductRepository {
  findAllProducts(filter: ListProductsFilter): Promise<{ data: ProductListItem[]; stats: { total: number } }>;
  findProductById(id: string): Promise<ProductDetail | undefined>;
  createProduct(data: {
    name: string;
    slug: string;
    description?: string | null;
    category: string;
    isAvailable?: boolean;
    primaryVariant: {
      sku: string;
      name: string;
      price: number;
      isAvailable?: boolean;
    };
    images?: { url: string; displayOrder?: number }[];
  }): Promise<ProductDetail>;
  updateProduct(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string | null;
      category?: string;
      isAvailable?: boolean;
      variants: {
        id?: string | null;
        sku: string;
        name: string;
        price: number;
        isAvailable?: boolean;
        displayOrder?: number;
      }[];
      images?: { id?: string | null; url: string; displayOrder?: number }[];
    },
  ): Promise<ProductDetail>;
  setProductAvailable(id: string, isAvailable: boolean): Promise<boolean>;
}

export type CreateProductRequest = {
  name: string;
  slug: string;
  description?: string | null;
  category: string;
  isAvailable?: boolean;
  primaryVariant: {
    sku: string;
    name: string;
    price: number;
    isAvailable?: boolean;
  };
  images?: { url: string; displayOrder?: number }[];
};

export type UpdateProductRequest = {
  name?: string;
  slug?: string;
  description?: string | null;
  category?: string;
  isAvailable?: boolean;
  variants: {
    id?: string | null;
    sku: string;
    name: string;
    price: number;
    isAvailable?: boolean;
    displayOrder?: number;
  }[];
  images?: { id?: string | null; url: string; displayOrder?: number }[];
};

export type ProductVariantForm = {
  id?: string | null;
  sku: string;
  name: string;
  price: number;
  isAvailable?: boolean;
  displayOrder?: number;
};

export type ProductImageForm = {
  id?: string | null;
  url: string;
  displayOrder?: number;
};

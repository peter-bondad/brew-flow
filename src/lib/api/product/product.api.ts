import {
  CreateProductRequest,
  UpdateProductRequest,
  ListProductsQueryRequest,
  ProductIdParamRequest,
} from "@/server/shared/product/product.dto";
import type {
  Product,
  ProductDetail,
  ProductListItem,
  ProductVariant,
  ProductImage,
} from "@/server/shared/product/product.interface";

export type { Product, ProductDetail, ProductListItem, ProductVariant, ProductImage };

export interface ListProductsResponse {
  data: ProductListItem[];
  stats: { total: number };
}

export type ProductRow = ProductListItem;
export type ProductDetailRow = ProductDetail;

const BASE_URL = "/api/admin/products";

async function parseResponse<T>(response: Response): Promise<T> {
  const result = (await response.json().catch(() => null)) as
    | (T & { message?: string })
    | null;

  if (!response.ok) {
    const message =
      (result && typeof result === "object" && "message" in result
        ? (result as { message?: string }).message
        : undefined) ?? "Something went wrong.";

    throw new Error(message);
  }

  return result as T;
}

export async function listProducts(
  params: ListProductsQueryRequest = { limit: 20, offset: 0 },
): Promise<{ data: ProductRow[]; stats: { total: number } }> {
  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
  if (params.category) query.set("category", params.category);
  if (params.isAvailable !== undefined) query.set("isAvailable", String(params.isAvailable));
  if (params.includeInactive) query.set("includeInactive", "true");
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);
  query.set("limit", String(params.limit ?? 20));
  query.set("offset", String(params.offset ?? 0));

  const response = await fetch(`${BASE_URL}?${query.toString()}`);
  const { data, stats } = await parseResponse<ListProductsResponse>(response);

  return { data, stats };
}

export async function getProduct(
  params: ProductIdParamRequest,
): Promise<ProductDetailRow> {
  const response = await fetch(`${BASE_URL}/${params.id}`);
  const { data } = await parseResponse<{ data: ProductDetailRow }>(response);

  return data;
}

export async function createProduct(
  input: CreateProductRequest,
): Promise<ProductDetailRow> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const { data } = await parseResponse<{ data: ProductDetailRow }>(response);
  return data;
}

export async function updateProduct(
  id: string,
  input: UpdateProductRequest,
): Promise<ProductDetailRow> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const { data } = await parseResponse<{ data: ProductDetailRow }>(response);
  return data;
}

export async function archiveProduct(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  await parseResponse<{ message: string }>(response);
}

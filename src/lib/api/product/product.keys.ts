import type { ListProductsQueryRequest } from "@/server/shared/product/product.dto";

export const productKeys = {
  all: ["products"] as const,

  list: (params?: ListProductsQueryRequest) =>
    [...productKeys.all, "list", params] as const,

  detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

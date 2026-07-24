import { useQuery } from "@tanstack/react-query";

import { listProducts, getProduct } from "./product.api";
import { productKeys } from "./product.keys";
import type { ListProductsQueryRequest } from "@/server/shared/product/product.dto";

export function useProducts(
  params: ListProductsQueryRequest = { limit: 20, offset: 0 },
) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => listProducts(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id ?? ""),
    queryFn: () => getProduct({ id: id ?? "" }),
    enabled: !!id,
  });
}

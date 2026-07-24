import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listAdminOrders,
  getAdminOrder,
  updateAdminOrderStatus,
  refundAdminOrder,
} from "./order.api";
import type { ListOrdersQueryRequest, UpdateOrderStatusRequest } from "@/server/shared/order/order.dto";

const ordersKeys = {
  all: ["orders"] as const,
  list: (params?: ListOrdersQueryRequest) =>
    [...ordersKeys.all, "list", params] as const,
  detail: (id: string) => [...ordersKeys.all, "detail", id] as const,
};

export function useAdminOrders(params: {
  status?: string;
  limit?: number;
  offset?: number;
} = {}) {
  return useQuery({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryKey: ordersKeys.list(params as any),
    queryFn: () =>
      listAdminOrders({
        limit: params.limit ?? 20,
        offset: params.offset ?? 0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        status: params.status as any,
      }),
  });
}

export function useAdminOrder(id: string | undefined) {
  return useQuery({
    queryKey: ordersKeys.detail(id ?? ""),
    queryFn: () => getAdminOrder(id ?? ""),
    enabled: !!id,
  });
}

export function useUpdateAdminOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateOrderStatusRequest }) =>
      updateAdminOrderStatus(id, input),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}

export function useRefundAdminOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => refundAdminOrder(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}

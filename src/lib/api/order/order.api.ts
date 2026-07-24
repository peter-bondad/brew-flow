import type { ListOrdersQueryRequest } from "@/server/shared/order/order.dto";
import type { OrderListItem, OrderDetail } from "@/server/shared/order/order.interface";

export type ListAdminOrdersResponse = {
  data: OrderListItem[];
  stats: { total: number };
};

const BASE_URL = "/api/admin/orders";

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

export async function listAdminOrders(
  params: ListOrdersQueryRequest = { limit: 20, offset: 0 },
): Promise<ListAdminOrdersResponse> {
  const query = new URLSearchParams();

  if (params.status) query.set("status", params.status);
  if (params.dateFrom) query.set("dateFrom", params.dateFrom);
  if (params.dateTo) query.set("dateTo", params.dateTo);
  if (params.userId) query.set("userId", params.userId);
  query.set("limit", String(params.limit ?? 20));
  query.set("offset", String(params.offset ?? 0));

  const response = await fetch(`${BASE_URL}?${query.toString()}`);
  const { data, stats } = await parseResponse<ListAdminOrdersResponse>(response);

  return { data, stats };
}

export async function getAdminOrder(id: string): Promise<OrderDetail> {
  const response = await fetch(`${BASE_URL}/${id}`);
  const { data } = await parseResponse<{ data: OrderDetail }>(response);

  return data;
}

export async function updateAdminOrderStatus(
  id: string,
  input: { status: string; note?: string },
) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const { data } = await parseResponse<{ data: OrderDetail }>(response);
  return data;
}

export async function refundAdminOrder(id: string) {
  const response = await fetch(`${BASE_URL}/${id}/refund`, {
    method: "POST",
  });

  const { data } = await parseResponse<{ data: OrderDetail }>(response);
  return data;
}

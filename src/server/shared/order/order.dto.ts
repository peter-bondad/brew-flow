import { z } from "zod";

export const orderIdParamRequest = z
  .object({
    id: z.string().trim().min(1),
  })
  .strict();

export type OrderIdParamRequest = z.infer<typeof orderIdParamRequest>;

export const createOrderItemRequest = z
  .object({
    productId: z.string().trim().min(1),
    variantId: z.string().trim().min(1),
    quantity: z.number().int().min(1),
  })
  .strict();

export type CreateOrderItemRequest = z.infer<typeof createOrderItemRequest>;

export const createOrderRequest = z
  .object({
    items: z.array(createOrderItemRequest).min(1),
    paymentMethod: z.string().trim().min(1).max(50),
    note: z.string().trim().max(500).optional(),
  })
  .strict();

export type CreateOrderRequest = z.infer<typeof createOrderRequest>;

export const updateOrderStatusRequest = z
  .object({
    status: z.enum(["pending", "paid", "preparing", "ready", "completed", "cancelled"]),
    note: z.string().trim().max(500).optional(),
  })
  .strict();

export type UpdateOrderStatusRequest = z.infer<typeof updateOrderStatusRequest>;

export const listOrdersQueryRequest = z
  .object({
    status: z
      .enum(["pending", "paid", "preparing", "ready", "completed", "cancelled"])
      .optional(),
    dateFrom: z.string().trim().optional(),
    dateTo: z.string().trim().optional(),
    userId: z.string().trim().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .strict();

export type ListOrdersQueryRequest = z.infer<typeof listOrdersQueryRequest>;

export const listMyOrdersQueryRequest = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .strict();

export type ListMyOrdersQueryRequest = z.infer<typeof listMyOrdersQueryRequest>;

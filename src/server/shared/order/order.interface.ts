export type OrderStatus = "pending" | "paid" | "preparing" | "ready" | "completed" | "cancelled";

export type Order = {
  id: string;
  userId: string;
  status: OrderStatus;
  paymentMethod: string;
  subtotal: number;
  total: number;
  stripeSessionId: string | null;
  createdAt: Date;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type OrderDetail = Order & {
  items: OrderItem[];
};

export type OrderListItem = Order & {
  itemCount: number;
};

export type ListOrdersFilter = {
  status?: OrderStatus;
  dateFrom?: Date;
  dateTo?: Date;
  userId?: string;
  limit: number;
  offset: number;
};

export interface IOrderRepository {
  createOrder(data: {
    userId: string;
    status: OrderStatus;
    paymentMethod: string;
    subtotal: number;
    total: number;
    items: {
      productId: string;
      variantId: string;
      productName: string;
      variantName: string;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
    }[];
  }): Promise<OrderDetail>;
  findOrderById(id: string): Promise<OrderDetail | undefined>;
  findProductIngredients(variantId: string): Promise<
    { id: string; quantityUsed: number; ingredient: { id: string } }[]
  >;
  findOrdersByUserId(
    userId: string,
    filter: Omit<ListOrdersFilter, "userId">,
  ): Promise<{ data: OrderListItem[]; stats: { total: number } }>;
  findOrders(filter: ListOrdersFilter): Promise<{ data: OrderListItem[]; stats: { total: number } }>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order | undefined>;
}

export type CreateOrderItemRequest = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type CreateOrderRequest = {
  items: CreateOrderItemRequest[];
  paymentMethod: string;
  note?: string;
};

export type UpdateOrderStatusRequest = {
  status: OrderStatus;
  note?: string;
};

export type OrderItemResponse = {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type OrderResponse = {
  id: string;
  userId: string;
  status: OrderStatus;
  paymentMethod: string;
  subtotal: number;
  total: number;
  stripeSessionId: string | null;
  items: OrderItemResponse[];
  createdAt: Date;
};

export type OrderListItemResponse = {
  id: string;
  status: OrderStatus;
  paymentMethod: string;
  total: number;
  itemCount: number;
  createdAt: Date;
};

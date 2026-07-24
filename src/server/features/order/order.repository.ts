import { randomUUID } from "node:crypto";
import { and, desc, eq, gt, lte } from "drizzle-orm";

import db from "@/server/infra/database/client";
import {
  orderItems,
  orders,
  productIngredients,
} from "@/server/infra/database/schemas";

import type {
  IOrderRepository,
  ListOrdersFilter,
  Order,
  OrderDetail,
  OrderListItem,
  OrderStatus,
} from "../../shared/order/order.interface";

export class OrderRepository implements IOrderRepository {
  constructor(private readonly database = db) {}

  async createOrder(data: {
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
  }): Promise<OrderDetail> {
    const orderId = randomUUID();

    const [order] = await this.database
      .insert(orders)
      .values({
        id: orderId,
        userId: data.userId,
        status: data.status,
        paymentMethod: data.paymentMethod,
        subtotal: data.subtotal,
        total: data.total,
      })
      .returning();

    const itemRows = data.items.map((item) => ({
      id: randomUUID(),
      orderId,
      productId: item.productId,
      variantId: item.variantId,
      productName: item.productName,
      variantName: item.variantName,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
    }));

    await this.database.insert(orderItems).values(itemRows);

    const full = await this.findOrderById(order.id);

    if (!full) {
      throw new Error("Failed to fetch created order.");
    }

    return full;
  }

  async findOrderById(id: string): Promise<OrderDetail | undefined> {
    const order = await this.database.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: {
          with: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!order) {
      return undefined;
    }

    return order as unknown as OrderDetail;
  }

  async findOrdersByUserId(
    userId: string,
    filter: Omit<ListOrdersFilter, "userId">,
  ): Promise<{ data: OrderListItem[]; stats: { total: number } }> {
    const conditions: unknown[] = [eq(orders.userId, userId)];

    if (filter.status) {
      conditions.push(eq(orders.status, filter.status));
    }

    if (filter.dateFrom) {
      conditions.push(gt(orders.createdAt, filter.dateFrom));
    }

    if (filter.dateTo) {
      conditions.push(lte(orders.createdAt, filter.dateTo));
    }

    const orderBy = [desc(orders.createdAt)];

    const [paginated, all] = (await Promise.all([
      this.database.query.orders.findMany({
        // drizzle-orm `and()` requires explicit argument types; dynamic spread
        // from a conditions array needs a cast here.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        where: conditions.length ? and(...(conditions as any)) : undefined,
        orderBy,
        limit: filter.limit,
        offset: filter.offset,
        with: {
          items: true,
        },
      }),
      this.database.query.orders.findMany({
        // drizzle-orm `and()` requires explicit argument types; dynamic spread
        // from a conditions array needs a cast here.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        where: conditions.length ? and(...(conditions as any)) : undefined,
        with: {
          items: true,
        },
      }),
    ]));

    // drizzle-orm `and()` requires explicit argument types; dynamic spread
    // from a conditions array needs a cast here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: OrderListItem[] = paginated.map((order: any) => ({
      ...order,
      itemCount: order.items?.length ?? 0,
    }));

    return { data, stats: { total: all.length } };
  }

  async findOrders(filter: ListOrdersFilter): Promise<{ data: OrderListItem[]; stats: { total: number } }> {
    const conditions: unknown[] = [];

    if (filter.status) {
      conditions.push(eq(orders.status, filter.status));
    }

    if (filter.userId) {
      conditions.push(eq(orders.userId, filter.userId));
    }

    if (filter.dateFrom) {
      conditions.push(gt(orders.createdAt, filter.dateFrom));
    }

    if (filter.dateTo) {
      conditions.push(lte(orders.createdAt, filter.dateTo));
    }

    const orderBy = [desc(orders.createdAt)];

    const [paginated, all] = (await Promise.all([
      this.database.query.orders.findMany({
        // drizzle-orm `and()` requires explicit argument types; dynamic spread
        // from a conditions array needs a cast here.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        where: conditions.length ? and(...(conditions as any)) : undefined,
        orderBy,
        limit: filter.limit,
        offset: filter.offset,
        with: {
          items: true,
        },
      }),
      this.database.query.orders.findMany({
        // drizzle-orm `and()` requires explicit argument types; dynamic spread
        // from a conditions array needs a cast here.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        where: conditions.length ? and(...(conditions as any)) : undefined,
        with: {
          items: true,
        },
      }),
    ]));

    // drizzle-orm `and()` requires explicit argument types; dynamic spread
    // from a conditions array needs a cast here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: OrderListItem[] = paginated.map((order: any) => ({
      ...order,
      itemCount: order.items?.length ?? 0,
    }));

    return { data, stats: { total: all.length } };
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | undefined> {
    const [updated] = await this.database
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();

    return updated as Order | undefined;
  }

  async findProductIngredients(variantId: string) {
    return this.database.query.productIngredients.findMany({
      where: eq(productIngredients.variantId, variantId),
      with: {
        ingredient: true,
      },
    });
  }
}

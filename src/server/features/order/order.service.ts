import {
  InvalidOrderStatusError,
  OrderNotFoundError,
} from "./order.error";
import type {
  CreateOrderItemRequest,
  CreateOrderRequest,
  IOrderRepository,
  OrderDetail,
  OrderListItem,
  OrderStatus,
  UpdateOrderStatusRequest,
} from "../../shared/order/order.interface";
import { InventoryService } from "../inventory/inventory.service";
import { ProductService } from "../product/product.service";

export class OrderService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly inventoryService: InventoryService,
    private readonly productService: ProductService,
  ) {}

  async createOrder(userId: string, input: CreateOrderRequest): Promise<OrderDetail> {
    const validatedItems = await this.validateOrderItems(input.items);

    const subtotal = validatedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const total = subtotal;

    const order = await this.orderRepository.createOrder({
      userId,
      status: "pending",
      paymentMethod: input.paymentMethod,
      subtotal,
      total,
      items: validatedItems,
    });

    await this.deductInventory(order.id, validatedItems);

    return order;
  }

  async getOrder(id: string): Promise<OrderDetail> {
    const order = await this.orderRepository.findOrderById(id);

    if (!order) {
      throw new OrderNotFoundError();
    }

    return order;
  }

  async listMyOrders(
    userId: string,
    limit = 20,
    offset = 0,
  ): Promise<{ data: OrderListItem[]; stats: { total: number } }> {
    return this.orderRepository.findOrdersByUserId(userId, {
      limit,
      offset,
    });
  }

  async listOrders(filter: {
    status?: OrderStatus;
    limit?: number;
    offset?: number;
  }): Promise<{ data: OrderListItem[]; stats: { total: number } }> {
    return this.orderRepository.findOrders({
      status: filter.status,
      limit: filter.limit ?? 20,
      offset: filter.offset ?? 0,
    });
  }

  async updateOrderStatus(id: string, input: UpdateOrderStatusRequest): Promise<OrderDetail> {
    const order = await this.getOrder(id);

    if (!isValidTransition(order.status, input.status)) {
      throw new InvalidOrderStatusError(
        `Cannot transition from ${order.status} to ${input.status}`,
      );
    }

    const updated = await this.orderRepository.updateOrderStatus(id, input.status);

    if (!updated) {
      throw new OrderNotFoundError();
    }

    return this.getOrder(id);
  }

  async refundOrder(id: string, userId: string): Promise<OrderDetail> {
    const order = await this.getOrder(id);

    if (order.status !== "completed" && order.status !== "ready") {
      throw new InvalidOrderStatusError("Only completed or ready orders can be refunded.");
    }

    for (const item of order.items) {
      const ingredients = await this.orderRepository.findProductIngredients(item.variantId);

      for (const pi of ingredients) {
        await this.inventoryService.adjustStock(
          pi.ingredient.id,
          {
            type: "return",
            quantityChange: pi.quantityUsed * item.quantity,
            note: `Refund for order ${id}`,
          },
          userId,
        );
      }
    }

    const updated = await this.orderRepository.updateOrderStatus(id, "cancelled");

    if (!updated) {
      throw new OrderNotFoundError();
    }

    return this.getOrder(id);
  }

  private async validateOrderItems(
    items: CreateOrderItemRequest[],
  ): Promise<
    {
      productId: string;
      variantId: string;
      productName: string;
      variantName: string;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
    }[]
  > {
    const validated = [];

    for (const item of items) {
      const product = await this.productService.getProductById(item.productId);

      const variant = product.variants.find((v) => v.id === item.variantId);

      if (!variant) {
        throw new OrderNotFoundError(`Variant not found: ${item.variantId}`);
      }

      if (!variant.isAvailable || !product.isAvailable) {
        throw new InvalidOrderStatusError(
          `Product is not available: ${product.name}`,
        );
      }

      const lineTotal = variant.price * item.quantity;

      validated.push({
        productId: item.productId,
        variantId: item.variantId,
        productName: product.name,
        variantName: variant.name,
        unitPrice: variant.price,
        quantity: item.quantity,
        lineTotal,
      });
    }

    return validated;
  }

  private async deductInventory(
    orderId: string,
    items: {
      productId: string;
      variantId: string;
      productName: string;
      variantName: string;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
    }[],
  ): Promise<void> {
    for (const item of items) {
      const ingredients = await this.orderRepository.findProductIngredients(item.variantId);

      for (const pi of ingredients) {
        await this.inventoryService.applySaleDeduction(
          pi.ingredient.id,
          pi.quantityUsed * item.quantity,
          `Order ${orderId}`,
          "system",
        );
      }
    }
  }
}

function isValidTransition(current: string, next: string): boolean {
  const allowed: Record<string, string[]> = {
    pending: ["paid", "cancelled"],
    paid: ["preparing", "cancelled"],
    preparing: ["ready", "cancelled"],
    ready: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
  };

  return allowed[current]?.includes(next) ?? false;
}

import { factory } from "@/server/hono/hono-factory";
import { container } from "@/server/container";
import { logger } from "@/server/logger";
import { validator } from "@/server/shared/validator";
import {
  createOrderRequest,
  listOrdersQueryRequest,
  listMyOrdersQueryRequest,
  orderIdParamRequest,
  updateOrderStatusRequest,
} from "../../shared/order/order.dto";

export const listMyOrdersController = factory.createHandlers(
  validator("query", listMyOrdersQueryRequest),
  async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const query = c.req.valid("query");
    logger.info({ userId: user.id }, "Fetching my orders");

    const result = await container.orderService.listMyOrders(
      user.id,
      query.limit,
      query.offset,
    );

    logger.info({ count: result.data.length }, "My orders fetched");
    return c.json({
      data: result.data,
      stats: result.stats,
      pagination: { limit: query.limit, offset: query.offset },
    });
  },
);

export const getMyOrderController = factory.createHandlers(
  validator("param", orderIdParamRequest),
  async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const { id } = c.req.valid("param");
    logger.info({ userId: user.id, orderId: id }, "Fetching my order detail");

    const order = await container.orderService.getOrder(id);

    if (order.userId !== user.id) {
      return c.json({ message: "Forbidden" }, 403);
    }

    logger.info({ orderId: id }, "My order detail fetched");
    return c.json({ data: order });
  },
);

export const createOrderController = factory.createHandlers(
  validator("json", createOrderRequest),
  async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const input = c.req.valid("json");
    logger.info({ userId: user.id, itemCount: input.items.length }, "Creating order");

    const order = await container.orderService.createOrder(user.id, input);

    logger.info({ orderId: order.id }, "Order created");
    return c.json({ data: order }, 201);
  },
);

export const listAdminOrdersController = factory.createHandlers(
  validator("query", listOrdersQueryRequest),
  async (c) => {
    const query = c.req.valid("query");
    logger.info({ query }, "Fetching all orders");

    const result = await container.orderService.listOrders({
      status: query.status,
      limit: query.limit,
      offset: query.offset,
    });

    logger.info({ count: result.data.length, total: result.stats.total }, "Orders fetched");
    return c.json({
      data: result.data,
      stats: result.stats,
      pagination: { limit: query.limit, offset: query.offset },
    });
  },
);

export const getAdminOrderController = factory.createHandlers(
  validator("param", orderIdParamRequest),
  async (c) => {
    const { id } = c.req.valid("param");
    logger.info({ orderId: id }, "Fetching order detail");

    const order = await container.orderService.getOrder(id);

    logger.info({ orderId: id }, "Order detail fetched");
    return c.json({ data: order });
  },
);

export const updateOrderStatusController = factory.createHandlers(
  validator("param", orderIdParamRequest),
  validator("json", updateOrderStatusRequest),
  async (c) => {
    const { id } = c.req.valid("param");
    const input = c.req.valid("json");
    logger.info({ orderId: id, status: input.status }, "Updating order status");

    const order = await container.orderService.updateOrderStatus(id, input);

    logger.info({ orderId: id }, "Order status updated");
    return c.json({ data: order });
  },
);

import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";

import { pgEnum } from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "preparing",
  "ready",
  "completed",
  "cancelled",
]);

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => users.id),

  status: orderStatusEnum("status").notNull(),

  subtotal: integer("subtotal").notNull(),

  total: integer("total").notNull(),

  stripeSessionId: text("stripe_session_id").unique(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),

  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, {
      onDelete: "cascade",
    }),

  productId: text("product_id").notNull(),

  productName: text("product_name").notNull(),

  unitPrice: integer("unit_price").notNull(),

  quantity: integer("quantity").notNull(),

  lineTotal: integer("line_total").notNull(),
});

import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./auth-schema";
import { orderStatusEnum } from "./schema-pg.enum";
import { products, productVariants } from "./product-schema";

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => users.id),

  status: orderStatusEnum("status").default("pending").notNull(),

  paymentMethod: text("payment_method").notNull(),

  subtotal: integer("subtotal").notNull(),

  total: integer("total").notNull(),

  stripeSessionId: text("stripe_session_id").unique(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),

  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),

  productId: text("product_id")
    .notNull()
    .references(() => products.id),

  variantId: text("variant_id")
    .notNull()
    .references(() => productVariants.id),

  // snapshot fields — preserved even if product/variant is later renamed or deleted
  productName: text("product_name").notNull(),
  variantName: text("variant_name").notNull(), // "Small", "Regular", etc.

  unitPrice: integer("unit_price").notNull(),

  quantity: integer("quantity").notNull(),

  lineTotal: integer("line_total").notNull(),
});

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

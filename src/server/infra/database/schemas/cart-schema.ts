import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";
import { productVariants } from "./product-schema";

export const carts = pgTable("carts", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: text("id").primaryKey(),

  cartId: text("cart_id")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),

  variantId: text("variant_id")
    .notNull()
    .references(() => productVariants.id),

  quantity: integer("quantity").notNull(),
});

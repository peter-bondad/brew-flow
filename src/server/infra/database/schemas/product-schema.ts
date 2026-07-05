import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),

  category: text("category").notNull(),

  price: integer("price").notNull(), // store in cents

  isAvailable: boolean("is_available").notNull().default(true),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const productImages = pgTable("product_images", {
  id: text("id").primaryKey(),

  productId: text("product_id")
    .notNull()
    .references(() => products.id, {
      onDelete: "cascade",
    }),

  url: text("url").notNull(),

  displayOrder: integer("display_order").notNull().default(0),
});

import { relations } from "drizzle-orm";
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

  isAvailable: boolean("is_available").notNull().default(true),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const productImages = pgTable("product_images", {
  id: text("id").primaryKey(),

  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  url: text("url").notNull(),

  displayOrder: integer("display_order").notNull().default(0),
});

// Every product has at least one variant, even single-SKU items ("Regular").
// This is where price, SKU, and stock/recipe attach — never on products directly.
export const productVariants = pgTable("product_variants", {
  id: text("id").primaryKey(),

  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  sku: text("sku").notNull().unique(),

  name: text("name").notNull(), // "Regular", "Small", "16oz", etc.

  price: integer("price").notNull(), // cents

  isAvailable: boolean("is_available").notNull().default(true),

  displayOrder: integer("display_order").notNull().default(0),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const productsRelations = relations(products, ({ many }) => ({
  images: many(productImages),
  variants: many(productVariants),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  }),
);

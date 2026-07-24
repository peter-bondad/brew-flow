import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import {
  inventoryReferenceTypeEnum,
  inventoryTransactionTypeEnum,
  inventoryUnitEnum,
} from "./schema-pg.enum";
import { orders, productVariants, suppliers, users } from ".";

// --- Ingredients (raw materials — beans, milk, syrup, cups, lids) ---

export const ingredients = pgTable(
  "ingredients",
  {
    id: text("id").primaryKey(),

    name: text("name").notNull(),

    sku: text("sku").unique(),

    unit: inventoryUnitEnum("unit").notNull(),

    currentStock: integer("current_stock").notNull().default(0),

    minimumStockLevel: integer("minimum_stock_level").notNull().default(0),

    restockQuantity: integer("restock_quantity").notNull().default(0),

    averageUnitCost: integer("average_unit_cost").notNull().default(0),

    supplierId: text("supplier_id").references(() => suppliers.id, {
      onDelete: "set null",
    }),

    isActive: boolean("is_active").notNull().default(true),

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
  },
  (table) => ({
    supplierIdx: index("idx_ingredients_supplier").on(table.supplierId),

    activeIdx: index("idx_ingredients_active").on(table.isActive),

    nameIdx: index("idx_ingredients_name").on(table.name),
  }),
);

// --- Recipe: how much of each ingredient a product consumes ---

export const productIngredients = pgTable("product_ingredients", {
  id: text("id").primaryKey(),

  variantId: text("variant_id")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),

  ingredientId: text("ingredient_id")
    .notNull()
    .references(() => ingredients.id, { onDelete: "restrict" }),

  // amount consumed per one unit of this variant sold, in ingredient's unit
  quantityUsed: integer("quantity_used").notNull(),
});

// --- Inventory ledger: every stock change, auditable ---

export const inventoryTransactions = pgTable(
  "inventory_transactions",
  {
    id: text("id").primaryKey(),

    ingredientId: text("ingredient_id")
      .notNull()
      .references(() => ingredients.id, {
        onDelete: "cascade",
      }),

    type: inventoryTransactionTypeEnum("type").notNull(),

    // Positive = stock added
    // Negative = stock deducted
    quantityChange: integer("quantity_change").notNull(),

    previousStock: integer("previous_stock").notNull(),

    newStock: integer("new_stock").notNull(),

    /**
     * Generic reference to the source that created this transaction.
     *
     * Examples:
     *
     * referenceType = "ORDER"
     * referenceId   = order.id
     *
     * referenceType = "PURCHASE_ORDER"
     * referenceId   = purchaseOrder.id
     *
     * referenceType = "STOCK_COUNT"
     * referenceId   = stockCount.id
     *
     * referenceType = "MANUAL"
     * referenceId   = null
     */
    referenceType: inventoryReferenceTypeEnum("reference_type"),

    referenceId: text("reference_id"),

    // Keep this because sales are very common and you'll likely join orders often.
    orderId: text("order_id").references(() => orders.id, {
      onDelete: "set null",
    }),

    note: text("note"),

    createdBy: text("created_by")
      .notNull()
      .references(() => users.id),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    ingredientCreatedIdx: index(
      "idx_inventory_transactions_ingredient_created",
    ).on(table.ingredientId, table.createdAt),

    createdByIdx: index("idx_inventory_transactions_created_by").on(
      table.createdBy,
    ),

    orderIdx: index("idx_inventory_transactions_order").on(table.orderId),

    referenceIdx: index("idx_inventory_transactions_reference").on(
      table.referenceType,
      table.referenceId,
    ),
  }),
);

// --- Relations ---

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  ingredients: many(ingredients),
}));

export const ingredientsRelations = relations(ingredients, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [ingredients.supplierId],
    references: [suppliers.id],
  }),
  productIngredients: many(productIngredients),
  transactions: many(inventoryTransactions),
}));

export const productIngredientsRelations = relations(
  productIngredients,
  ({ one }) => ({
    variant: one(productVariants, {
      fields: [productIngredients.variantId],
      references: [productVariants.id],
    }),
    ingredient: one(ingredients, {
      fields: [productIngredients.ingredientId],
      references: [ingredients.id],
    }),
  }),
);

export const inventoryTransactionsRelations = relations(
  inventoryTransactions,
  ({ one }) => ({
    ingredient: one(ingredients, {
      fields: [inventoryTransactions.ingredientId],
      references: [ingredients.id],
    }),
    order: one(orders, {
      fields: [inventoryTransactions.orderId],
      references: [orders.id],
    }),
    createdByUser: one(users, {
      fields: [inventoryTransactions.createdBy],
      references: [users.id],
    }),
  }),
);

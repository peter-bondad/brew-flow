import { randomUUID } from "node:crypto";
import { and, eq, ilike, or, sql } from "drizzle-orm";

import db from "@/server/infra/database/client";
import {
  ingredients,
  inventoryTransactions,
} from "@/server/infra/database/schemas";

import type {
  ApplyStockChangeInput,
  CreateIngredientData,
  IInventoryRepository,
  Ingredient,
  InventoryTransaction,
  ListIngredientsFilter,
  ListTransactionsFilter,
  UpdateIngredientData,
} from "../../shared/inventory/inventory.interface";

export class InventoryRepository implements IInventoryRepository {
  constructor(private readonly database = db) {}

  async findAllIngredients(
    filter: ListIngredientsFilter,
  ): Promise<Ingredient[]> {
    const conditions = [];

    if (!filter.includeInactive) {
      conditions.push(eq(ingredients.isActive, true));
    }

    if (filter.search) {
      conditions.push(
        or(
          ilike(ingredients.name, `%${filter.search}%`),
          ilike(ingredients.sku, `%${filter.search}%`),
        ),
      );
    }

    if (filter.lowStockOnly) {
      // "low stock" = current stock has dropped to or below the reorder point
      conditions.push(
        sql`${ingredients.currentStock} <= ${ingredients.restockQuantity}`,
      );
    }

    return this.database.query.ingredients.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      orderBy: (table, { asc }) => [asc(table.name)],
      limit: filter.limit,
      offset: filter.offset,
    }) as Promise<Ingredient[]>;
  }

  async findIngredientById(id: string): Promise<Ingredient | undefined> {
    return this.database.query.ingredients.findFirst({
      where: eq(ingredients.id, id),
    }) as Promise<Ingredient | undefined>;
  }

  async findIngredientBySku(sku: string): Promise<Ingredient | undefined> {
    return this.database.query.ingredients.findFirst({
      where: eq(ingredients.sku, sku),
    }) as Promise<Ingredient | undefined>;
  }

  async createIngredient(data: CreateIngredientData): Promise<Ingredient> {
    const [created] = await this.database
      .insert(ingredients)
      .values({
        id: randomUUID(),
        name: data.name,
        sku: data.sku,
        unit: data.unit,
        minimumStockLevel: data.minimumStockLevel,
        restockQuantity: data.restockQuantity,
        averageUnitCost: data.averageUnitCost,
        supplierId: data.supplierId,
      })
      .returning();

    return created as Ingredient;
  }

  async updateIngredient(
    id: string,
    data: UpdateIngredientData,
  ): Promise<Ingredient | undefined> {
    const [updated] = await this.database
      .update(ingredients)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(ingredients.id, id))
      .returning();

    return updated as Ingredient | undefined;
  }

  async setIngredientActive(id: string, isActive: boolean): Promise<boolean> {
    const result = await this.database
      .update(ingredients)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(ingredients.id, id))
      .returning({ id: ingredients.id });

    return result.length > 0;
  }

  async applyStockChange(
    input: ApplyStockChangeInput,
  ): Promise<InventoryTransaction | undefined> {
    return this.database.transaction(async (tx) => {
      // Atomic conditional UPDATE — guards against negative stock and races
      // in one statement, no read-then-write.
      const [updated] = await tx
        .update(ingredients)
        .set({
          currentStock: sql`${ingredients.currentStock} + ${input.quantityChange}`,
          ...(input.averageUnitCost !== undefined
            ? { averageUnitCost: input.averageUnitCost }
            : {}),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(ingredients.id, input.ingredientId),
            sql`${ingredients.currentStock} + ${input.quantityChange} >= 0`,
          ),
        )
        .returning({ currentStock: ingredients.currentStock });

      if (!updated) {
        return undefined;
      }

      const newStock = updated.currentStock;
      const previousStock = newStock - input.quantityChange;

      const [transaction] = await tx
        .insert(inventoryTransactions)
        .values({
          id: randomUUID(),
          ingredientId: input.ingredientId,
          type: input.type,
          quantityChange: input.quantityChange,
          previousStock,
          newStock,
          orderId: input.orderId,
          note: input.note,
          createdBy: input.createdBy,
        })
        .returning();

      return transaction as InventoryTransaction;
    });
  }

  async findTransactions(
    filter: ListTransactionsFilter,
  ): Promise<InventoryTransaction[]> {
    return this.database.query.inventoryTransactions.findMany({
      where: eq(inventoryTransactions.ingredientId, filter.ingredientId),
      orderBy: (table, { desc }) => [desc(table.createdAt)],
      limit: filter.limit,
      offset: filter.offset,
    }) as Promise<InventoryTransaction[]>;
  }
}

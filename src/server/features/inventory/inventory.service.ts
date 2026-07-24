import {
  IngredientNotFoundError,
  IngredientSkuAlreadyExistsError,
  InsufficientStockError,
} from "./inventory.error";
import type {
  IInventoryRepository,
  Ingredient,
  InventoryStats,
  InventoryTransaction,
} from "../../shared/inventory/inventory.interface";
import { inventoryTransactionType } from "../../shared/inventory/inventory.constant";
import {
  AdjustIngredientStockRequest,
  CreateIngredientRequest,
  ListIngredientsQueryRequest,
  ListTransactionsQueryRequest,
  RestockIngredientRequest,
  UpdateIngredientRequest,
} from "../../shared/inventory/inventory.dto";

export class InventoryService {
  constructor(private readonly inventoryRepository: IInventoryRepository) {}

  async listIngredients(
    query: ListIngredientsQueryRequest,
  ): Promise<{ data: Ingredient[]; stats: InventoryStats }> {
    return this.inventoryRepository.findAllIngredients(query);
  }

  async getIngredient(id: string): Promise<Ingredient> {
    const ingredient = await this.inventoryRepository.findIngredientById(id);

    if (!ingredient) {
      throw new IngredientNotFoundError();
    }

    return ingredient;
  }

  async createIngredient(input: CreateIngredientRequest): Promise<Ingredient> {
    if (input.sku) {
      const existing = await this.inventoryRepository.findIngredientBySku(
        input.sku,
      );

      if (existing) {
        throw new IngredientSkuAlreadyExistsError();
      }
    }

    try {
      return await this.inventoryRepository.createIngredient(input);
    } catch (err) {
      // Second line of defense against a SKU race between the check above
      // and this insert — the DB's unique index on sku is the real guard.
      if (isUniqueViolation(err)) {
        throw new IngredientSkuAlreadyExistsError();
      }

      console.error("[createIngredient] insert failed", err);
      throw err;
    }
  }

  async updateIngredient(
    id: string,
    input: UpdateIngredientRequest,
  ): Promise<Ingredient> {
    await this.getIngredient(id); // 404s if missing

    if (input.sku) {
      const existing = await this.inventoryRepository.findIngredientBySku(
        input.sku,
      );

      if (existing && existing.id !== id) {
        throw new IngredientSkuAlreadyExistsError();
      }
    }

    let updated: Ingredient | undefined;

    try {
      updated = await this.inventoryRepository.updateIngredient(id, input);
    } catch (err) {
      if (isUniqueViolation(err)) {
        throw new IngredientSkuAlreadyExistsError();
      }

      console.error("[updateIngredient] update failed", err);
      throw err;
    }

    if (!updated) {
      throw new IngredientNotFoundError();
    }

    return updated;
  }

  async deactivateIngredient(id: string): Promise<void> {
    await this.getIngredient(id); // 404s if missing

    const deactivated = await this.inventoryRepository.setIngredientActive(
      id,
      false,
    );

    if (!deactivated) {
      throw new IngredientNotFoundError();
    }
  }

  async restock(
    id: string,
    input: RestockIngredientRequest,
    userId: string,
  ): Promise<InventoryTransaction> {
    await this.getIngredient(id); // 404s before touching stock

    const transaction = await this.inventoryRepository.applyStockChange({
      ingredientId: id,
      type: inventoryTransactionType.Restock,
      quantityChange: input.quantity,
      note: input.note,
      averageUnitCost: input.averageUnitCost,
      createdBy: userId,
    });

    // Restock only ever increases stock, so the >= 0 guard can never fail
    // here — undefined would only mean the ingredient vanished between the
    // check above and this write.
    if (!transaction) {
      throw new IngredientNotFoundError();
    }

    return transaction;
  }

  async adjustStock(
    id: string,
    input: AdjustIngredientStockRequest,
    userId: string,
  ): Promise<InventoryTransaction> {
    await this.getIngredient(id); // 404s before touching stock

    const transaction = await this.inventoryRepository.applyStockChange({
      ingredientId: id,
      type: input.type,
      quantityChange: input.quantityChange,
      note: input.note,
      createdBy: userId,
    });

    if (!transaction) {
      throw new InsufficientStockError();
    }

    return transaction;
  }

  async applySaleDeduction(
    id: string,
    quantityChange: number,
    note: string,
    userId: string,
  ): Promise<InventoryTransaction> {
    await this.getIngredient(id);

    const transaction = await this.inventoryRepository.applyStockChange({
      ingredientId: id,
      type: inventoryTransactionType.SaleDeduction,
      quantityChange,
      note,
      createdBy: userId,
    });

    if (!transaction) {
      throw new InsufficientStockError();
    }

    return transaction;
  }

  async listTransactions(
    ingredientId: string,
    query: ListTransactionsQueryRequest,
  ): Promise<InventoryTransaction[]> {
    await this.getIngredient(ingredientId); // 404s if missing

    return this.inventoryRepository.findTransactions({
      ingredientId,
      ...query,
    });
  }
}

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "23505"
  );
}

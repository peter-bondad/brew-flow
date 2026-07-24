import { InventoryUnit, InventoryTransactionType } from "./inventory.constant";

export interface Ingredient {
  id: string;
  name: string;
  sku: string | null;
  unit: InventoryUnit;
  currentStock: number;
  minimumStockLevel: number;
  restockQuantity: number;
  averageUnitCost: number;
  supplierId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryTransaction {
  id: string;
  ingredientId: string;
  type: InventoryTransactionType;
  quantityChange: number;
  previousStock: number;
  newStock: number;
  orderId: string | null;
  note: string | null;
  createdBy: string;
  createdAt: Date;
}

export interface CreateIngredientData {
  name: string;
  sku?: string;
  unit: InventoryUnit;
  minimumStockLevel: number;
  restockQuantity: number;
  averageUnitCost: number;
  supplierId?: string;
}

export interface UpdateIngredientData {
  name?: string;
  sku?: string;
  unit?: InventoryUnit;
  reorderThreshold?: number;
  reorderQuantity?: number;
  averageUnitCost?: number;
  supplierId?: string | null;
}

export interface ListIngredientsFilter {
  search?: string;
  lowStockOnly: boolean;
  includeInactive: boolean;
  limit: number;
  offset: number;
}

export interface ApplyStockChangeInput {
  ingredientId: string;
  type: InventoryTransactionType;
  quantityChange: number;
  note?: string;
  createdBy: string;
  orderId?: string;

  // Optional: refresh inventory cost basis after a restock
  averageUnitCost?: number;
}

export interface ListTransactionsFilter {
  ingredientId: string;
  limit: number;
  offset: number;
}

export interface IInventoryRepository {
  findAllIngredients(filter: ListIngredientsFilter): Promise<Ingredient[]>;
  findIngredientById(id: string): Promise<Ingredient | undefined>;
  findIngredientBySku(sku: string): Promise<Ingredient | undefined>;
  createIngredient(data: CreateIngredientData): Promise<Ingredient>;
  updateIngredient(
    id: string,
    data: UpdateIngredientData,
  ): Promise<Ingredient | undefined>;
  setIngredientActive(id: string, isActive: boolean): Promise<boolean>;
  applyStockChange(
    input: ApplyStockChangeInput,
  ): Promise<InventoryTransaction | undefined>;
  findTransactions(
    filter: ListTransactionsFilter,
  ): Promise<InventoryTransaction[]>;
}

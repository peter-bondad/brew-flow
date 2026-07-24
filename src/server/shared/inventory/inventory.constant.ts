export const inventoryUnit = {
  Gram: "g",
  Kilogram: "kg",
  Milliliter: "ml",
  Liter: "l",
  Piece: "pcs",
  Ounce: "oz",
} as const;

export type InventoryUnit = (typeof inventoryUnit)[keyof typeof inventoryUnit];

export const inventoryTransactionType = {
  Restock: "restock",
  SaleDeduction: "sale_deduction",
  Adjustment: "adjustment",
  Waste: "waste",
  Return: "return",
} as const;

export type InventoryTransactionType =
  (typeof inventoryTransactionType)[keyof typeof inventoryTransactionType];

// "restock" has its own dedicated endpoint/flow, and "sale_deduction" is only
// ever written by the (future) order-completion flow — never by a manual
// API call. The manual adjust endpoint only ever accepts these three.
export const manualAdjustmentType = {
  Adjustment: inventoryTransactionType.Adjustment,
  Waste: inventoryTransactionType.Waste,
  Return: inventoryTransactionType.Return,
} as const;

export type ManualAdjustmentType =
  (typeof manualAdjustmentType)[keyof typeof manualAdjustmentType];

export const inventoryReferenceType = {
  Manual: "manual",
  Order: "order",
  PurchaseOrder: "purchase_order",
  StockCount: "stock_count",
} as const;

export type InvetoryRefereceType =
  (typeof inventoryReferenceType)[keyof typeof inventoryReferenceType];

import { pgEnum } from "drizzle-orm/pg-core";

// user role schema enum
export const userRoleEnum = pgEnum("user_role", ["owner", "manager", "staff"]);

// invitation schema enum
export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "processing",
  "accepted",
  "revoked",
  "expired",
]);

// order schema enum
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "preparing",
  "ready",
  "completed",
  "cancelled",
]);

// inventory schema enums

export const inventoryUnitEnum = pgEnum("inventory_unit", [
  "g",
  "kg",
  "ml",
  "l",
  "pcs",
  "oz",
]);

export const inventoryTransactionTypeEnum = pgEnum(
  "inventory_transaction_type",
  ["restock", "sale_deduction", "adjustment", "waste", "return"],
);

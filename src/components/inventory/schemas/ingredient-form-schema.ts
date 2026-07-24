import { inventoryUnit } from "@/server/shared/inventory/inventory.constant";
import z from "zod";

export const ingredientFormSchema = z.object({
  name: z.string().min(1),
  sku: z.string().optional(),
  unit: z.enum(inventoryUnit),
  minimumStockLevel: z.number(),
  restockQuantity: z.number(),
  averageUnitCost: z.number(),
  supplierId: z.string().optional(),
});

export type IngredientFormValues = z.infer<typeof ingredientFormSchema>;

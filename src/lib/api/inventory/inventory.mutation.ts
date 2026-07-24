import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adjustIngredientStock,
  createIngredient,
  restockIngredient,
  updateIngredient,
} from "./inventory.api";
import { inventoryKeys } from "./inventory.keys";
import type {
  AdjustIngredientStockRequest,
  RestockIngredientRequest,
  UpdateIngredientRequest,
} from "@/server/shared/inventory/inventory.dto";

export function useCreateIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIngredient,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.all,
      });
    },
  });
}

export function useUpdateIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; input: UpdateIngredientRequest }) =>
      updateIngredient(payload.id, payload.input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.all,
      });
    },
  });
}

export function useRestockIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; input: RestockIngredientRequest }) =>
      restockIngredient(payload.id, payload.input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.all,
      });
    },
  });
}

export function useAdjustIngredientStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; input: AdjustIngredientStockRequest }) =>
      adjustIngredientStock(payload.id, payload.input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.all,
      });
    },
  });
}

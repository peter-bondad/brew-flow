import { useState } from "react";
import { Ingredient } from "@/server/shared/inventory/inventory.interface";
import { IngredientFormValues } from "./schemas/ingredient-form-schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateIngredient, useUpdateIngredient } from "@/lib/api/inventory/inventory.mutation";
import { inventoryUnit } from "@/server/shared/inventory/inventory.constant";

export type IngredientFormDialogProps = {
  open: boolean;
  ingredient?: Ingredient;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: IngredientFormValues) => void;
};

export function IngredientFormDialog({
  open,
  ingredient,
  onOpenChange,
}: IngredientFormDialogProps) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [unit, setUnit] = useState<IngredientFormValues["unit"]>(inventoryUnit.Kilogram);
  const [minimumStockLevel, setMinimumStockLevel] = useState("");
  const [restockQuantity, setRestockQuantity] = useState("");
  const [averageUnitCost, setAverageUnitCost] = useState("");
  const [supplierId, setSupplierId] = useState("");

  const createMutation = useCreateIngredient();
  const updateMutation = useUpdateIngredient();
  const isEditing = !!ingredient;
  const mutation = isEditing ? updateMutation : createMutation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values: IngredientFormValues = {
      name,
      sku: sku || undefined,
      unit,
      minimumStockLevel: Number(minimumStockLevel),
      restockQuantity: Number(restockQuantity),
      averageUnitCost: Number(averageUnitCost),
      supplierId: supplierId || undefined,
    };

    if (isEditing) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mutation.mutate({ id: ingredient!.id, input: values } as any, {
        onSuccess: () => onOpenChange(false),
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mutation.mutate(values as any, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Ingredient" : "Add Ingredient"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update ingredient details below."
              : "Fill in the details for the new ingredient."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Select value={unit} onValueChange={(val) => setUnit(val as IngredientFormValues["unit"])}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={inventoryUnit.Kilogram}>Kilogram</SelectItem>
                <SelectItem value={inventoryUnit.Liter}>Liter</SelectItem>
                <SelectItem value={inventoryUnit.Milliliter}>Milliliter</SelectItem>
                <SelectItem value={inventoryUnit.Piece}>Piece</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumStockLevel">Minimum Stock Level</Label>
            <Input
              id="minimumStockLevel"
              type="number"
              min="0"
              value={minimumStockLevel}
              onChange={(e) => setMinimumStockLevel(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="restockQuantity">Restock Quantity</Label>
            <Input
              id="restockQuantity"
              type="number"
              min="0"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="averageUnitCost">Average Unit Cost (centavos)</Label>
            <Input
              id="averageUnitCost"
              type="number"
              min="0"
              value={averageUnitCost}
              onChange={(e) => setAverageUnitCost(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplierId">Supplier ID</Label>
            <Input
              id="supplierId"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save Changes"
                  : "Create Ingredient"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

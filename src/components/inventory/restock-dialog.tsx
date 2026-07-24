import { useState } from "react";
import { RestockIngredientRequest } from "@/server/shared/inventory/inventory.dto";
import { Ingredient } from "@/server/shared/inventory/inventory.interface";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRestockIngredient } from "@/lib/api/inventory/inventory.mutation";
import { formatCurrency } from "@/lib/format";

export type RestockDialogProps = {
  open: boolean;
  ingredient: Ingredient | null;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: RestockIngredientRequest) => void;
};

export function RestockDialog({
  open,
  ingredient,
  onOpenChange,
}: RestockDialogProps) {
  const [quantity, setQuantity] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [note, setNote] = useState("");

  const mutation = useRestockIngredient();

  if (!ingredient) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(
      {
        id: ingredient.id,
        input: {
          quantity: Number(quantity),
          averageUnitCost: unitCost ? Number(unitCost) : undefined,
          note: note || undefined,
        },
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  return (
    <Sheet key={open ? "open" : "closed"} open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Restock Ingredient</SheetTitle>
          <SheetDescription>
            Add stock for <strong>{ingredient.name}</strong>. Current stock:{" "}
            {ingredient.currentStock} {ingredient.unit}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity to Add</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={`Current: ${ingredient.currentStock} ${ingredient.unit}`}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitCost">
              New Unit Cost (centavos){" "}
              <span className="text-muted-foreground">— optional</span>
            </Label>
            <Input
              id="unitCost"
              type="number"
              min="0"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
              placeholder={`Current: ${formatCurrency(ingredient.averageUnitCost)}`}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to keep current cost of {formatCurrency(ingredient.averageUnitCost)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note..."
            />
          </div>

          <SheetFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Restocking..." : "Restock"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

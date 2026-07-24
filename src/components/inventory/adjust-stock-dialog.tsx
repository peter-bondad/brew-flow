import { useState } from "react";
import { AdjustIngredientStockRequest } from "@/server/shared/inventory/inventory.dto";
import { Ingredient } from "@/server/shared/inventory/inventory.interface";
import { manualAdjustmentType } from "@/server/shared/inventory/inventory.constant";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdjustIngredientStock } from "@/lib/api/inventory/inventory.mutation";

export type AdjustStockDialogProps = {
  open: boolean;
  ingredient: Ingredient | null;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: AdjustIngredientStockRequest) => void;
};

export function AdjustStockDialog({
  open,
  ingredient,
  onOpenChange,
}: AdjustStockDialogProps) {
  const [type, setType] = useState<AdjustIngredientStockRequest["type"]>(
    manualAdjustmentType.Adjustment,
  );
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

  const mutation = useAdjustIngredientStock();

  if (!ingredient) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(
      {
        id: ingredient.id,
        input: {
          type,
          quantityChange: Number(quantity),
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
          <SheetTitle>Adjust Stock</SheetTitle>
          <SheetDescription>
            Manually adjust stock for <strong>{ingredient.name}</strong>.
            Current stock: {ingredient.currentStock} {ingredient.unit}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Adjustment Type</Label>
            <Select
              value={type}
              onValueChange={(val) =>
                setType(val as AdjustIngredientStockRequest["type"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={manualAdjustmentType.Adjustment}>
                  Adjustment
                </SelectItem>
                <SelectItem value={manualAdjustmentType.Waste}>
                  Waste / Spoilage
                </SelectItem>
                <SelectItem value={manualAdjustmentType.Return}>
                  Return
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity Change</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              required
            />
            <p className="text-xs text-muted-foreground">
              This will be{" "}
              {type === manualAdjustmentType.Waste ? "subtracted" : "added"} from
              current stock.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Reason for adjustment..."
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
              {mutation.isPending ? "Saving..." : "Save Adjustment"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

import { Badge } from "../ui/badge";

type StockBadgeProps = {
  currentStock: number;
  minimumStockLevel: number;
};

export function StockBadge({
  currentStock,
  minimumStockLevel,
}: StockBadgeProps) {
  if (currentStock <= 0) {
    return (
      <Badge variant="destructive" className="font-semibold">
        Out of Stock
      </Badge>
    );
  }

  if (currentStock <= minimumStockLevel) {
    return (
      <Badge className="border-yellow-300 bg-yellow-100 text-yellow-800 hover:bg-yellow-100 font-semibold">
        Low Stock
      </Badge>
    );
  }

  return (
    <Badge className="border-green-300 bg-green-100 text-green-800 hover:bg-green-100 font-semibold">
      In Stock
    </Badge>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const inventory = [
  {
    name: "Coffee Beans",
    stock: "Low",
  },
  {
    name: "Fresh Milk",
    stock: "Low",
  },
  {
    name: "Chocolate Syrup",
    stock: "Good",
  },
  {
    name: "Brown Sugar",
    stock: "Good",
  },
];

export function InventoryAlerts() {
  return (
    <Card className="border-[#ead8c3]">
      <CardHeader>
        <CardTitle>Inventory Alerts</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {inventory.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-4"
          >
            <span className="text-sm text-[#3d2413]">{item.name}</span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                item.stock === "Low"
                  ? "bg-[#fce8e4] text-[#8a2be2]"
                  : "bg-[#e8f5e2] text-[#2d6a32]"
              }`}
            >
              {item.stock}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

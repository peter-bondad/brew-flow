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

      <CardContent className="space-y-4">
        {inventory.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <span>{item.name}</span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                item.stock === "Low"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
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

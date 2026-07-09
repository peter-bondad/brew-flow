import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const items = [
  {
    name: "Cappuccino",
    sold: 212,
    revenue: "₱53,000",
  },
  {
    name: "Spanish Latte",
    sold: 180,
    revenue: "₱44,500",
  },
  {
    name: "Caramel Macchiato",
    sold: 162,
    revenue: "₱39,700",
  },
  {
    name: "Americano",
    sold: 150,
    revenue: "₱33,200",
  },
];

export function TopSellingItems() {
  return (
    <Card className="border-[#ead8c3]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top Selling Items</CardTitle>

        <Button variant="outline">View all</Button>
      </CardHeader>

      <CardContent className="space-y-5">
        {items.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {index + 1}. {item.name}
              </p>

              <p className="text-sm text-[#7b5f46]">{item.sold} sold</p>
            </div>

            <p className="font-semibold">{item.revenue}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

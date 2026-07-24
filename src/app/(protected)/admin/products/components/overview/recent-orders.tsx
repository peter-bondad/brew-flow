import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const orders = [
  {
    id: "#1001",
    customer: "John Cruz",
    total: "₱450",
    status: "Completed",
  },
  {
    id: "#1002",
    customer: "Maria Santos",
    total: "₱320",
    status: "Preparing",
  },
  {
    id: "#1003",
    customer: "Paul Reyes",
    total: "₱610",
    status: "Completed",
  },
  {
    id: "#1004",
    customer: "Anna Dela Cruz",
    total: "₱290",
    status: "Pending",
  },
];

export function RecentOrders() {
  return (
    <Card className="border-[#ead8c3]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Orders</CardTitle>

        <Button variant="outline" className="cursor-pointer">
          View all
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between gap-4"
          >
            <div>
              <p className="font-medium text-[#3d2413]">{order.id}</p>

              <p className="text-sm text-[#7b5f46]">{order.customer}</p>
            </div>

            <div className="text-right">
              <p className="font-semibold text-[#3d2413]">{order.total}</p>

              <span
                className={`text-xs font-medium ${
                  order.status === "Completed"
                    ? "text-[#2d6a32]"
                    : order.status === "Preparing"
                      ? "text-[#8d5a2b]"
                      : "text-[#b45309]"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

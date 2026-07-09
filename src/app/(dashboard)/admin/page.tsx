import { DashboardStats } from "./components/overview/dashboard-stats";
import { RecentOrders } from "./components/overview/recent-orders";
import { TopSellingItems } from "./components/overview/top-selling-items";
import { InventoryAlerts } from "./components/overview/inventory-alerts";

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-4xl font-bold text-[#3d2413]">Overview</h1>

        <p className="mt-2 text-[#7b5f46]">
          Welcome back! Here's what's happening with your coffee shop.
        </p>
      </section>

      <DashboardStats />

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentOrders />

        <TopSellingItems />
      </div>

      <InventoryAlerts />
    </div>
  );
}

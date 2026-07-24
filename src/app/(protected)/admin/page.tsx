import { DashboardStats } from "./menu/components/overview/dashboard-stats";
import { InventoryAlerts } from "./menu/components/overview/inventory-alerts";
import { RecentOrders } from "./menu/components/overview/recent-orders";
import { TopSellingItems } from "./menu/components/overview/top-selling-items";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-[linear-gradient(135deg,#4a2b1c_0%,#6e3d1f_45%,#c67e3f_100%)] p-6 text-[#fff9f2] shadow-lg">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">Overview</h1>
          <p className="max-w-2xl text-sm text-[#f6e7d4]">
            Monitor today&apos;s sales, inventory, and operational insights
            across your coffee shop.
          </p>
        </div>
      </div>

      <DashboardStats />

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentOrders />

        <TopSellingItems />
      </div>

      <InventoryAlerts />
    </div>
  );
}

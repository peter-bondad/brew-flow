import { ShoppingCart, PhilippinePeso, Coffee, Users } from "lucide-react";

import { DashboardStatCard } from "./dashboard-statcard";

export function DashboardStats() {
  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <DashboardStatCard
        title="Orders Today"
        value="1,248"
        description="+12.5% from yesterday"
        icon={ShoppingCart}
      />

      <DashboardStatCard
        title="Revenue Today"
        value="₱128,430"
        description="+8.2% from yesterday"
        icon={PhilippinePeso}
      />

      <DashboardStatCard
        title="Menu Items"
        value="56"
        description="Currently available"
        icon={Coffee}
      />

      <DashboardStatCard
        title="Staff Members"
        value="34"
        description="Active accounts"
        icon={Users}
      />
    </section>
  );
}

import { StatusCard } from "@/components/dashboard/status-card";
import { ShoppingCart, PhilippinePeso, Coffee, Users } from "lucide-react";

export function DashboardStats() {
  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatusCard
        title="Orders Today"
        value="1,248"
        description="+12.5% from yesterday"
        icon={ShoppingCart}
      />

      <StatusCard
        title="Revenue Today"
        value="₱128,430"
        description="+8.2% from yesterday"
        icon={PhilippinePeso}
      />

      <StatusCard
        title="Products"
        value="56"
        description="Currently available"
        icon={Coffee}
      />

      <StatusCard
        title="Staff Members"
        value="34"
        description="Active accounts"
        icon={Users}
      />
    </section>
  );
}

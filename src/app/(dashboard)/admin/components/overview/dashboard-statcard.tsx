import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type DashboardStatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

export function DashboardStatCard({
  title,
  value,
  description,
  icon: Icon,
}: DashboardStatCardProps) {
  return (
    <Card className="border-[#ead8c3] shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="rounded-xl bg-[#fbf3eb] p-3">
            <Icon className="size-5 text-[#8d5a2b]" />
          </div>
        </div>

        <p className="mt-5 text-sm text-[#7b5f46]">{title}</p>

        <h2 className="mt-2 text-4xl font-bold text-[#3d2413]">{value}</h2>

        <p className="mt-3 text-sm text-[#7b5f46]">{description}</p>
      </CardContent>
    </Card>
  );
}

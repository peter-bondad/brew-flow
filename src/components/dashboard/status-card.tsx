import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type StatusCardProps = {
  title: string;
  value: React.ReactNode;
  description?: React.ReactNode;
  icon: LucideIcon;
};

export function StatusCard({
  title,
  value,
  description,
  icon: Icon,
}: StatusCardProps) {
  return (
    <Card className="group relative overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#c67e3f] to-[#8d5a2b]" />

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8d5a2b]">
              {title}
            </p>

            <h3 title={typeof value === "string" || typeof value === "number" ? String(value) : undefined} className="mt-2 text-2xl md:text-3xl font-bold text-[#3d2413] tracking-normal tabular-nums truncate">
              {value}
            </h3>

            {description && (
              <p className="mt-1.5 text-sm text-[#7b5f46]">{description}</p>
            )}
          </div>

          <div className="rounded-xl bg-gradient-to-br from-[#fbf3eb] to-[#f5e6d3] p-3 shadow-sm ring-1 ring-[#ead8c3]">
            <Icon className="size-6 text-[#8d5a2b]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

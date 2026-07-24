import {
  MoreHorizontal,
  Pencil,
  Eye,
  RotateCcw,
} from "lucide-react";

import type { OrderListItem } from "@/server/shared/order/order.interface";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type OrderRowActionsProps = {
  order: OrderListItem;

  onViewDetail: (order: OrderListItem) => void;
  onUpdateStatus: (order: OrderListItem) => void;
  onRefund: (order: OrderListItem) => void;
};

export function OrderRowActions({
  order,
  onViewDetail,
  onUpdateStatus,
  onRefund,
}: OrderRowActionsProps) {
  const canRefund = order.status === "completed" || order.status === "ready";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewDetail(order)}>
          <Eye className="size-4" />
          View Detail
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onUpdateStatus(order)}>
          <Pencil className="size-4" />
          Update Status
        </DropdownMenuItem>

        {canRefund && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => onRefund(order)}>
              <RotateCcw className="size-4" />
              Refund
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

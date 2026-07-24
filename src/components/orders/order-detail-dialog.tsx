"use client";

import { useAdminOrder } from "@/lib/api/order/order.query";
import { formatCurrency } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type OrderDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
};

export function OrderDetailDialog({
  open,
  onOpenChange,
  orderId,
}: OrderDetailDialogProps) {
  const { data, isLoading, error } = useAdminOrder(open ? orderId : undefined);

  const createdAt = data?.createdAt
    ? new Date(data.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Order #{data?.id?.slice(0, 8)}</DialogTitle>
          <DialogDescription>{createdAt}</DialogDescription>
        </DialogHeader>

        {error ? (
          <p className="text-sm text-destructive">{error.message}</p>
        ) : isLoading || !data ? (
          <div className="space-y-3">
            <div className="h-6 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-24 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-6 w-full animate-pulse rounded-md bg-muted" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Status</p>
                <span className="font-medium capitalize">{data.status}</span>
              </div>

              <div>
                <p className="text-muted-foreground">Payment</p>
                <p className="font-medium">{data.paymentMethod}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Items</p>
                <p className="font-medium">{data.items.length}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Total</p>
                <p className="font-medium">{formatCurrency(data.total)}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="mb-2 text-sm font-medium">Items</p>

              <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border p-3">
                {data.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.variantName} × {item.quantity}
                      </p>
                    </div>

                    <span className="font-medium">
                      {formatCurrency(item.lineTotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

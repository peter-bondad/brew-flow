"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAdminOrder, useUpdateAdminOrderStatus } from "@/lib/api/order/order.query";
import type { OrderStatus } from "@/server/shared/order/order.interface";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OrderStatusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
};

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrderStatusDialog({
  open,
  onOpenChange,
  orderId,
}: OrderStatusDialogProps) {
  const [status, setStatus] = useState<OrderStatus | "">("");
  const updateMutation = useUpdateAdminOrderStatus();
  const { data, isLoading, error } = useAdminOrder(open ? orderId : undefined);

  const currentStatus = data?.status;

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setStatus("");
    }
    onOpenChange(next);
  };

  const handleSubmit = async () => {
    if (!status || !data) return;

    try {
      await updateMutation.mutateAsync({
        id: orderId,
        input: { status },
      });

      toast.success("Order status updated.");
      handleOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update status.";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Change the fulfillment status for order #{orderId.slice(0, 8)}.
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <p className="text-sm text-destructive">{error.message}</p>
        ) : isLoading || !currentStatus ? (
          <div className="space-y-3">
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current Status</Label>
              <p className="text-sm font-medium capitalize">{currentStatus}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select value={status} onValueChange={(val) => setStatus(val as OrderStatus)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!status || updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Update Status"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

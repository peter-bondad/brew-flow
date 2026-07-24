"use client";

import { useState, useMemo } from "react";
import { AlertTriangle, Archive, Boxes, Package } from "lucide-react";

import { StatusCard } from "@/components/dashboard/status-card";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { InventoryToolbar } from "@/components/inventory/inventory-toolbar";
import { IngredientFormDialog } from "@/components/inventory/ingredient-form-dialog";
import { RestockDialog } from "@/components/inventory/restock-dialog";
import { AdjustStockDialog } from "@/components/inventory/adjust-stock-dialog";
import { formatCurrency } from "@/lib/format";
import type { SortingState } from "@tanstack/react-table";
import type { Ingredient } from "@/server/shared/inventory/inventory.interface";

import { useIngredients } from "@/lib/api/inventory/inventory.query";

const LIMIT = 10;

export default function InventoryPage() {
  const [filters, setFilters] = useState({
    search: "",
    lowStockOnly: false,
    includeInactive: false,
  });
  const [page, setPage] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);

  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [restockingIngredient, setRestockingIngredient] = useState<Ingredient | null>(null);
  const [adjustingIngredient, setAdjustingIngredient] = useState<Ingredient | null>(null);

  const sortBy = sorting[0]?.id;
  const sortOrder = sorting[0]?.desc ? "desc" : "asc";

  const {
    data: response,
    isPending,
    error,
  } = useIngredients({
    ...filters,
    sortBy,
    sortOrder,
    limit: LIMIT,
    offset: page * LIMIT,
  });

  const ingredients = response?.data ?? [];
  const stats = useMemo(
    () =>
      response?.stats ?? {
        total: 0,
        lowStock: 0,
        outOfStock: 0,
        totalValue: 0,
      },
    [response],
  );

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-[linear-gradient(135deg,#4a2b1c_0%,#6e3d1f_45%,#c67e3f_100%)] p-8 text-[#fff9f2] shadow-lg">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Inventory</h1>
          <p className="max-w-2xl text-[#f6e7d4]">
            Manage ingredients, monitor stock levels, and track inventory
            movements.
          </p>
        </div>
      </div>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatusCard
          title="Total Ingredients"
          value={String(stats.total)}
          description="Active inventory items"
          icon={Package}
        />

        <StatusCard
          title="Low Stock"
          value={String(stats.lowStock)}
          description="Require attention"
          icon={AlertTriangle}
        />

        <StatusCard
          title="Out of Stock"
          value={String(stats.outOfStock)}
          description="Need immediate restocking"
          icon={Archive}
        />

        <StatusCard
          title="Inventory Value"
          value={formatCurrency(stats.totalValue)}
          description="Estimated stock value"
          icon={Boxes}
        />
      </section>

      <InventoryToolbar
        search={filters.search}
        lowStockOnly={filters.lowStockOnly}
        onSearchChange={(search) => {
          setFilters((prev) => ({ ...prev, search }));
          setPage(0);
        }}
        onLowStockOnlyChange={(lowStockOnly) => {
          setFilters((prev) => ({ ...prev, lowStockOnly }));
          setPage(0);
        }}
        onAddIngredient={() => setEditingIngredient({} as Ingredient)}
      />

      <InventoryTable
        data={ingredients}
        loading={isPending}
        error={error ? { message: error.message } : undefined}
        page={page}
        onPageChange={setPage}
        limit={LIMIT}
        sorting={sorting}
        onSortingChange={setSorting}
        onEdit={setEditingIngredient}
        onRestock={setRestockingIngredient}
        onAdjustStock={setAdjustingIngredient}
        onViewHistory={(ingredient) => {
          console.log("History", ingredient);
        }}
      />

      <IngredientFormDialog
        open={!!editingIngredient}
        ingredient={editingIngredient ?? undefined}
        onOpenChange={(open) => !open && setEditingIngredient(null)}
      />

      <RestockDialog
        open={!!restockingIngredient}
        ingredient={restockingIngredient}
        onOpenChange={(open) => !open && setRestockingIngredient(null)}
      />

      <AdjustStockDialog
        open={!!adjustingIngredient}
        ingredient={adjustingIngredient}
        onOpenChange={(open) => !open && setAdjustingIngredient(null)}
      />
    </div>
  );
}

import { eq } from "drizzle-orm";
import { inventoryUnit } from "@/server/shared/inventory/inventory.constant";
import db from "./client";
import { ingredients, suppliers } from "./schemas";

async function seedSuppliers() {
  const data = [
    {
      id: "supp-1",
      name: "Manila Coffee Traders",
      contactName: "Jose Cruz",
      phoneNumber: "+63-2-8123-4567",
      email: "jose@manilacoffee.ph",
    },
    {
      id: "supp-2",
      name: "Dairy Fresh Philippines",
      contactName: "Maria Santos",
      phoneNumber: "+63-2-8234-5678",
      email: "orders@dairyfresh.ph",
    },
    {
      id: "supp-3",
      name: "PackRight Supplies",
      contactName: "Pedro Reyes",
      phoneNumber: "+63-2-8345-6789",
      email: "pedro@packright.ph",
    },
    {
      id: "supp-4",
      name: "Sweeteners & Syrups Co.",
      contactName: "Ana Garcia",
      phoneNumber: "+63-2-8456-7890",
      email: "ana@sweeteners.ph",
    },
  ];

  for (const supplier of data) {
    const existing = await db.query.suppliers.findFirst({
      where: eq(suppliers.id, supplier.id),
    });

    if (!existing) {
      await db.insert(suppliers).values(supplier);
      console.log(`Created supplier: ${supplier.name}`);
    } else {
      console.log(`Supplier already exists: ${supplier.name}`);
    }
  }
}

async function seedIngredients() {
  const data = [
    {
      id: "ing-1",
      name: "Arabica Coffee Beans",
      sku: "COF-001",
      unit: inventoryUnit.Kilogram,
      currentStock: 25,
      minimumStockLevel: 10,
      restockQuantity: 20,
      averageUnitCost: 8500,
      supplierId: "supp-1",
      isActive: true,
    },
    {
      id: "ing-2",
      name: "Robusta Coffee Beans",
      sku: "COF-002",
      unit: inventoryUnit.Kilogram,
      currentStock: 15,
      minimumStockLevel: 8,
      restockQuantity: 15,
      averageUnitCost: 6200,
      supplierId: "supp-1",
      isActive: true,
    },
    {
      id: "ing-3",
      name: "Fresh Milk",
      sku: "DRY-001",
      unit: inventoryUnit.Liter,
      currentStock: 30,
      minimumStockLevel: 20,
      restockQuantity: 30,
      averageUnitCost: 1200,
      supplierId: "supp-2",
      isActive: true,
    },
    {
      id: "ing-4",
      name: "Evaporated Milk",
      sku: "DRY-002",
      unit: inventoryUnit.Piece,
      currentStock: 50,
      minimumStockLevel: 20,
      restockQuantity: 40,
      averageUnitCost: 1800,
      supplierId: "supp-2",
      isActive: true,
    },
    {
      id: "ing-5",
      name: "Vanilla Syrup",
      sku: "SYR-001",
      unit: inventoryUnit.Milliliter,
      currentStock: 3000,
      minimumStockLevel: 1000,
      restockQuantity: 2000,
      averageUnitCost: 85,
      supplierId: "supp-4",
      isActive: true,
    },
    {
      id: "ing-6",
      name: "Caramel Syrup",
      sku: "SYR-002",
      unit: inventoryUnit.Milliliter,
      currentStock: 800,
      minimumStockLevel: 1000,
      restockQuantity: 2000,
      averageUnitCost: 90,
      supplierId: "supp-4",
      isActive: true,
    },
    {
      id: "ing-7",
      name: "Hazelnut Syrup",
      sku: "SYR-003",
      unit: inventoryUnit.Milliliter,
      currentStock: 0,
      minimumStockLevel: 500,
      restockQuantity: 1500,
      averageUnitCost: 95,
      supplierId: "supp-4",
      isActive: true,
    },
    {
      id: "ing-8",
      name: "Brown Sugar",
      sku: "ING-001",
      unit: inventoryUnit.Kilogram,
      currentStock: 5,
      minimumStockLevel: 3,
      restockQuantity: 5,
      averageUnitCost: 6500,
      supplierId: "supp-4",
      isActive: true,
    },
    {
      id: "ing-9",
      name: "Coffee Cups 12oz",
      sku: "SUP-001",
      unit: inventoryUnit.Piece,
      currentStock: 200,
      minimumStockLevel: 100,
      restockQuantity: 200,
      averageUnitCost: 350,
      supplierId: "supp-3",
      isActive: true,
    },
    {
      id: "ing-10",
      name: "Coffee Cup Lids",
      sku: "SUP-002",
      unit: inventoryUnit.Piece,
      currentStock: 150,
      minimumStockLevel: 100,
      restockQuantity: 200,
      averageUnitCost: 120,
      supplierId: "supp-3",
      isActive: true,
    },
    {
      id: "ing-11",
      name: "Chocolate Syrup",
      sku: "SYR-004",
      unit: inventoryUnit.Milliliter,
      currentStock: 0,
      minimumStockLevel: 500,
      restockQuantity: 1500,
      averageUnitCost: 80,
      supplierId: "supp-4",
      isActive: true,
    },
    {
      id: "ing-12",
      name: "Non-Dairy Creamer",
      sku: "DRY-003",
      unit: inventoryUnit.Piece,
      currentStock: 80,
      minimumStockLevel: 30,
      restockQuantity: 50,
      averageUnitCost: 850,
      supplierId: "supp-2",
      isActive: true,
    },
    {
      id: "ing-13",
      name: "Napkins",
      sku: "SUP-003",
      unit: inventoryUnit.Piece,
      currentStock: 500,
      minimumStockLevel: 200,
      restockQuantity: 300,
      averageUnitCost: 150,
      supplierId: "supp-3",
      isActive: true,
    },
    {
      id: "ing-14",
      name: "Stirrers",
      sku: "SUP-004",
      unit: inventoryUnit.Piece,
      currentStock: 1000,
      minimumStockLevel: 500,
      restockQuantity: 500,
      averageUnitCost: 50,
      supplierId: "supp-3",
      isActive: false,
    },
  ];

  for (const ingredient of data) {
    const existing = await db.query.ingredients.findFirst({
      where: eq(ingredients.id, ingredient.id),
    });

    if (!existing) {
      await db.insert(ingredients).values(ingredient);
      console.log(`Created ingredient: ${ingredient.name}`);
    } else {
      console.log(`Ingredient already exists: ${ingredient.name}`);
    }
  }
}

async function main() {
  console.log("Seeding suppliers...");
  await seedSuppliers();

  console.log("Seeding ingredients...");
  await seedIngredients();

  console.log("Inventory seed completed.");
}

main().catch((error) => {
  console.error("Inventory seed failed.");
  console.error(error);
  process.exit(1);
});

import { eq } from "drizzle-orm";
import db from "./client";
import { products, productVariants, productIngredients } from "./schemas";

const PRODUCTS = [
  {
    id: "prod-1",
    name: "Espresso",
    slug: "espresso",
    description: "Rich, bold espresso shot.",
    category: "Hot Coffee",
    isAvailable: true,
    variants: [
      { id: "var-1a", name: "Single", sku: "ESP-S", price: 80, displayOrder: 0 },
      { id: "var-1b", name: "Double", sku: "ESP-D", price: 120, displayOrder: 1 },
    ],
    ingredients: {
      "var-1a": [
        { ingredientId: "ing-1", quantityUsed: 18 },
      ],
      "var-1b": [
        { ingredientId: "ing-1", quantityUsed: 36 },
      ],
    },
  },
  {
    id: "prod-2",
    name: "Americano",
    slug: "americano",
    description: "Espresso with hot water.",
    category: "Hot Coffee",
    isAvailable: true,
    variants: [
      { id: "var-2a", name: "Regular", sku: "AME-R", price: 90, displayOrder: 0 },
      { id: "var-2b", name: "Large", sku: "AME-L", price: 130, displayOrder: 1 },
    ],
    ingredients: {
      "var-2a": [
        { ingredientId: "ing-1", quantityUsed: 18 },
        { ingredientId: "ing-9", quantityUsed: 1 },
      ],
      "var-2b": [
        { ingredientId: "ing-1", quantityUsed: 36 },
        { ingredientId: "ing-9", quantityUsed: 1 },
      ],
    },
  },
  {
    id: "prod-3",
    name: "Caramel Macchiato",
    slug: "caramel-macchiato",
    description: "Espresso, milk, and caramel drizzle.",
    category: "Flavored Lattes",
    isAvailable: true,
    variants: [
      { id: "var-3a", name: "Regular", sku: "CRM-R", price: 140, displayOrder: 0 },
      { id: "var-3b", name: "Large", sku: "CRM-L", price: 170, displayOrder: 1 },
    ],
    ingredients: {
      "var-3a": [
        { ingredientId: "ing-1", quantityUsed: 18 },
        { ingredientId: "ing-3", quantityUsed: 200 },
        { ingredientId: "ing-5", quantityUsed: 15 },
        { ingredientId: "ing-9", quantityUsed: 1 },
      ],
      "var-3b": [
        { ingredientId: "ing-1", quantityUsed: 36 },
        { ingredientId: "ing-3", quantityUsed: 300 },
        { ingredientId: "ing-5", quantityUsed: 25 },
        { ingredientId: "ing-9", quantityUsed: 1 },
      ],
    },
  },
  {
    id: "prod-4",
    name: "Hazelnut Latte",
    slug: "hazelnut-latte",
    description: "Smooth latte with hazelnut syrup.",
    category: "Flavored Lattes",
    isAvailable: true,
    variants: [
      { id: "var-4a", name: "Regular", sku: "HAZ-R", price: 140, displayOrder: 0 },
      { id: "var-4b", name: "Large", sku: "HAZ-L", price: 170, displayOrder: 1 },
    ],
    ingredients: {
      "var-4a": [
        { ingredientId: "ing-1", quantityUsed: 18 },
        { ingredientId: "ing-3", quantityUsed: 200 },
        { ingredientId: "ing-7", quantityUsed: 15 },
        { ingredientId: "ing-9", quantityUsed: 1 },
      ],
      "var-4b": [
        { ingredientId: "ing-1", quantityUsed: 36 },
        { ingredientId: "ing-3", quantityUsed: 300 },
        { ingredientId: "ing-7", quantityUsed: 25 },
        { ingredientId: "ing-9", quantityUsed: 1 },
      ],
    },
  },
  {
    id: "prod-5",
    name: "Vanilla Latte",
    slug: "vanilla-latte",
    description: "Classic latte with vanilla syrup.",
    category: "Flavored Lattes",
    isAvailable: true,
    variants: [
      { id: "var-5a", name: "Regular", sku: "VAN-R", price: 140, displayOrder: 0 },
      { id: "var-5b", name: "Large", sku: "VAN-L", price: 170, displayOrder: 1 },
    ],
    ingredients: {
      "var-5a": [
        { ingredientId: "ing-1", quantityUsed: 18 },
        { ingredientId: "ing-3", quantityUsed: 200 },
        { ingredientId: "ing-5", quantityUsed: 15 },
        { ingredientId: "ing-9", quantityUsed: 1 },
      ],
      "var-5b": [
        { ingredientId: "ing-1", quantityUsed: 36 },
        { ingredientId: "ing-3", quantityUsed: 300 },
        { ingredientId: "ing-5", quantityUsed: 25 },
        { ingredientId: "ing-9", quantityUsed: 1 },
      ],
    },
  },
  {
    id: "prod-6",
    name: "Cappuccino",
    slug: "cappuccino",
    description: "Espresso with steamed milk and foam.",
    category: "Hot Coffee",
    isAvailable: true,
    variants: [
      { id: "var-6a", name: "Regular", sku: "CAP-R", price: 130, displayOrder: 0 },
      { id: "var-6b", name: "Large", sku: "CAP-L", price: 160, displayOrder: 1 },
    ],
    ingredients: {
      "var-6a": [
        { ingredientId: "ing-1", quantityUsed: 18 },
        { ingredientId: "ing-3", quantityUsed: 150 },
        { ingredientId: "ing-9", quantityUsed: 1 },
      ],
      "var-6b": [
        { ingredientId: "ing-1", quantityUsed: 36 },
        { ingredientId: "ing-3", quantityUsed: 250 },
        { ingredientId: "ing-9", quantityUsed: 1 },
      ],
    },
  },
  {
    id: "prod-7",
    name: "Mocha",
    slug: "mocha",
    description: "Chocolate and espresso.",
    category: "Hot Coffee",
    isAvailable: true,
    variants: [
      { id: "var-7a", name: "Regular", sku: "MOC-R", price: 150, displayOrder: 0 },
      { id: "var-7b", name: "Large", sku: "MOC-L", price: 180, displayOrder: 1 },
    ],
    ingredients: {
      "var-7a": [
        { ingredientId: "ing-1", quantityUsed: 18 },
        { ingredientId: "ing-3", quantityUsed: 150 },
        { ingredientId: "ing-11", quantityUsed: 15 },
        { ingredientId: "ing-9", quantityUsed: 1 },
      ],
      "var-7b": [
        { ingredientId: "ing-1", quantityUsed: 36 },
        { ingredientId: "ing-3", quantityUsed: 250 },
        { ingredientId: "ing-11", quantityUsed: 25 },
        { ingredientId: "ing-9", quantityUsed: 1 },
      ],
    },
  },
  {
    id: "prod-8",
    name: "Iced Coffee",
    slug: "iced-coffee",
    description: "Cold brewed coffee over ice.",
    category: "Iced Coffee",
    isAvailable: true,
    variants: [
      { id: "var-8a", name: "Regular", sku: "ICE-R", price: 110, displayOrder: 0 },
      { id: "var-8b", name: "Large", sku: "ICE-L", price: 140, displayOrder: 1 },
    ],
    ingredients: {
      "var-8a": [
        { ingredientId: "ing-1", quantityUsed: 20 },
        { ingredientId: "ing-3", quantityUsed: 50 },
        { ingredientId: "ing-9", quantityUsed: 1 },
      ],
      "var-8b": [
        { ingredientId: "ing-1", quantityUsed: 40 },
        { ingredientId: "ing-3", quantityUsed: 100 },
        { ingredientId: "ing-9", quantityUsed: 1 },
      ],
    },
  },
  {
    id: "prod-9",
    name: "Drip Coffee",
    slug: "drip-coffee",
    description: "Classic brewed drip coffee.",
    category: "Hot Coffee",
    isAvailable: true,
    variants: [
      { id: "var-9a", name: "Small", sku: "DRP-S", price: 60, displayOrder: 0 },
      { id: "var-9b", name: "Medium", sku: "DRP-M", price: 80, displayOrder: 1 },
      { id: "var-9c", name: "Large", sku: "DRP-L", price: 100, displayOrder: 2 },
    ],
    ingredients: {
      "var-9a": [
        { ingredientId: "ing-1", quantityUsed: 15 },
        { ingredientId: "ing-9", quantityUsed: 1 },
      ],
      "var-9b": [
        { ingredientId: "ing-1", quantityUsed: 22 },
        { ingredientId: "ing-9", quantityUsed: 1 },
      ],
      "var-9c": [
        { ingredientId: "ing-1", quantityUsed: 30 },
        { ingredientId: "ing-9", quantityUsed: 1 },
      ],
    },
  },
];

async function seedProducts() {
  for (const product of PRODUCTS) {
    const existingProduct = await db.query.products.findFirst({
      where: eq(products.id, product.id),
    });

    if (existingProduct) {
      console.log(`Product already exists: ${product.name}`);
      continue;
    }

    await db.insert(products).values({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      category: product.category,
      isAvailable: product.isAvailable,
    });

    for (const variant of product.variants) {
      await db.insert(productVariants).values({
        id: variant.id,
        productId: product.id,
        sku: variant.sku,
        name: variant.name,
        price: variant.price,
        isAvailable: true,
        displayOrder: variant.displayOrder,
      });

      const ingredientMappings = (product.ingredients as unknown as Record<string, { ingredientId: string; quantityUsed: number }[]>)[variant.id];
      if (ingredientMappings) {
        for (let i = 0; i < ingredientMappings.length; i++) {
          const mapping = ingredientMappings[i];
          await db.insert(productIngredients).values({
            id: `pi-${variant.id}-${i}`,
            variantId: variant.id,
            ingredientId: mapping.ingredientId,
            quantityUsed: mapping.quantityUsed,
          });
        }
      }
    }

    console.log(`Seeded product: ${product.name}`);
  }
}

async function main() {
  console.log("Seeding products...");
  await seedProducts();
  console.log("Product seed completed.");
}

main().catch((error) => {
  console.error("Product seed failed.");
  console.error(error);
  process.exit(1);
});

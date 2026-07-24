import { randomUUID } from "node:crypto";
import { and, asc, desc, eq, ilike, or } from "drizzle-orm";

import db from "@/server/infra/database/client";
import {
  productImages,
  productVariants,
  products,
} from "@/server/infra/database/schemas";
import { logger } from "@/server/logger";

import type {
  CreateProductRequest,
  IProductRepository,
  ListProductsFilter,
  ProductDetail,
  ProductListItem,
  UpdateProductRequest,
} from "../../shared/product/product.interface";

export class ProductRepository implements IProductRepository {
  constructor(private readonly database = db) {}

  async findAllProducts(
    filter: ListProductsFilter,
  ): Promise<{ data: ProductListItem[]; stats: { total: number } }> {
    logger.info({ filter }, "Querying products");

    const conditions: unknown[] = [];

    if (!filter.includeInactive) {
      conditions.push(eq(products.isAvailable, true));
    }

    if (filter.category) {
      conditions.push(eq(products.category, filter.category));
    }

    if (filter.isAvailable !== undefined) {
      conditions.push(eq(products.isAvailable, filter.isAvailable));
    }

    if (filter.search) {
      conditions.push(
        or(
          ilike(products.name, `%${filter.search}%`),
          ilike(products.slug, `%${filter.search}%`),
        ),
      );
    }

    const sortColumn =
      filter.sortBy === "updatedAt"
        ? products.updatedAt
        : filter.sortBy === "createdAt"
          ? products.createdAt
          : products.name;

    const orderBy =
      filter.sortOrder === "desc" ? [desc(sortColumn)] : [asc(sortColumn)];

    const [paginatedRows, allRows] = (await Promise.all([
      this.database.query.products.findMany({
        // drizzle-orm `and()` requires explicit argument types; dynamic spread
        // from a conditions array needs a cast here.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        where: conditions.length ? and(...(conditions as any)) : undefined,
        orderBy,
        limit: filter.limit,
        offset: filter.offset,
        with: {
          variants: {
            orderBy: (table, { asc }) => [asc(table.displayOrder), asc(table.name)],
            limit: 1,
          },
        },
      }),
      this.database.query.products.findMany({
        // drizzle-orm `and()` requires explicit argument types; dynamic spread
        // from a conditions array needs a cast here.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        where: conditions.length ? and(...(conditions as any)) : undefined,
      }),
    ])) as [
      (typeof products.$inferSelect & {
        variants: (typeof productVariants.$inferSelect)[];
      })[],
      (typeof products.$inferSelect)[],
    ];

    const data: ProductListItem[] = paginatedRows.map((row) => ({
      ...row,
      primaryVariant: row.variants[0] ?? null,
    }));

    logger.info(
      { count: data.length, total: allRows.length },
      "Products queried",
    );

    return { data, stats: { total: allRows.length } };
  }

  async findProductById(id: string): Promise<ProductDetail | undefined> {
    const product = await this.database.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        variants: {
          orderBy: (table, { asc }) => [asc(table.displayOrder), asc(table.name)],
        },
        images: {
          orderBy: (table, { asc }) => [asc(table.displayOrder)],
        },
      },
    });

    if (!product) {
      return undefined;
    }

    return product as unknown as ProductDetail;
  }

  async createProduct(data: CreateProductRequest): Promise<ProductDetail> {
    const productId = randomUUID();

    const [createdProduct] = await this.database
      .insert(products)
      .values({
        id: productId,
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        category: data.category,
        isAvailable: data.isAvailable ?? true,
      })
      .returning();

    const variantId = randomUUID();
    await this.database.insert(productVariants).values({
      id: variantId,
      productId: createdProduct.id,
      sku: data.primaryVariant.sku,
      name: data.primaryVariant.name,
      price: data.primaryVariant.price,
      isAvailable: data.primaryVariant.isAvailable ?? true,
      displayOrder: 0,
    });

    if (data.images && data.images.length > 0) {
      await this.database.insert(productImages).values(
        data.images.map((image, index) => ({
          id: randomUUID(),
          productId: createdProduct.id,
          url: image.url,
          displayOrder: image.displayOrder ?? index,
        })),
      );
    }

    const full = await this.findProductById(createdProduct.id);

    if (!full) {
      throw new Error("Failed to fetch created product.");
    }

    return full;
  }

  async updateProduct(
    id: string,
    data: UpdateProductRequest,
  ): Promise<ProductDetail> {
    await this.database.transaction(async (tx) => {
      await tx
        .update(products)
        .set({
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.slug !== undefined ? { slug: data.slug } : {}),
          ...(data.description !== undefined ? { description: data.description } : {}),
          ...(data.category !== undefined ? { category: data.category } : {}),
          ...(data.isAvailable !== undefined ? { isAvailable: data.isAvailable } : {}),
        })
        .where(eq(products.id, id));

      const existingVariants = await tx
        .select()
        .from(productVariants)
        .where(eq(productVariants.productId, id));

      const keepIds = new Set(
        data.variants
          .filter((v) => v.id)
          .map((v) => v.id as string),
      );

      const toDelete = existingVariants.filter((v) => !keepIds.has(v.id));
      for (const variant of toDelete) {
        await tx.delete(productVariants).where(eq(productVariants.id, variant.id));
      }

      for (const variant of data.variants) {
        if (variant.id) {
          await tx
            .update(productVariants)
            .set({
              sku: variant.sku,
              name: variant.name,
              price: variant.price,
              isAvailable: variant.isAvailable ?? true,
              displayOrder: variant.displayOrder ?? 0,
            })
            .where(eq(productVariants.id, variant.id));
        } else {
          await tx.insert(productVariants).values({
            id: randomUUID(),
            productId: id,
            sku: variant.sku,
            name: variant.name,
            price: variant.price,
            isAvailable: variant.isAvailable ?? true,
            displayOrder: variant.displayOrder ?? 0,
          });
        }
      }

      const existingImages = await tx
        .select()
        .from(productImages)
        .where(eq(productImages.productId, id));

      const keepImageIds = new Set(
        (data.images ?? [])
          .filter((img) => img.id)
          .map((img) => img.id as string),
      );

      const imagesToDelete = existingImages.filter((img) => !keepImageIds.has(img.id));
      for (const image of imagesToDelete) {
        await tx.delete(productImages).where(eq(productImages.id, image.id));
      }

      for (const image of data.images ?? []) {
        if (image.id) {
          await tx
            .update(productImages)
            .set({
              url: image.url,
              displayOrder: image.displayOrder ?? 0,
            })
            .where(eq(productImages.id, image.id));
        } else {
          await tx.insert(productImages).values({
            id: randomUUID(),
            productId: id,
            url: image.url,
            displayOrder: image.displayOrder ?? 0,
          });
        }
      }
    });

    const full = await this.findProductById(id);

    if (!full) {
      throw new Error("Failed to fetch updated product.");
    }

    return full;
  }

  async setProductAvailable(id: string, isAvailable: boolean): Promise<boolean> {
    const result = await this.database
      .update(products)
      .set({ isAvailable, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning({ id: products.id });

    const updatedVariants = await this.database
      .update(productVariants)
      .set({ isAvailable })
      .where(eq(productVariants.productId, id))
      .returning({ id: productVariants.id });

    return result.length > 0 || updatedVariants.length > 0;
  }
}

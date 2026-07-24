import { z } from "zod";

export const productIdParamRequest = z
  .object({
    id: z.string().trim().min(1),
  })
  .strict();

export type ProductIdParamRequest = z.infer<typeof productIdParamRequest>;

export const createProductRequest = z
  .object({
    name: z.string().trim().min(1).max(150),
    slug: z.string().trim().min(1).max(100),
    description: z.string().trim().max(2000).nullable().optional(),
    category: z.string().trim().min(1).max(100),
    isAvailable: z.boolean().optional(),
    primaryVariant: z.object({
      sku: z.string().trim().min(1).max(60),
      name: z.string().trim().min(1).max(80),
      price: z.number().int().min(0),
      isAvailable: z.boolean().optional(),
    }),
    images: z
      .array(
        z.object({
          url: z.string().trim().url().max(2048),
          displayOrder: z.number().int().min(0).optional(),
        }),
      )
      .optional(),
  })
  .strict();

export type CreateProductRequest = z.infer<typeof createProductRequest>;

export const updateProductRequest = z
  .object({
    name: z.string().trim().min(1).max(150).optional(),
    slug: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().max(2000).nullable().optional(),
    category: z.string().trim().min(1).max(100).optional(),
    isAvailable: z.boolean().optional(),
    variants: z
      .array(
        z.object({
          id: z.string().trim().min(1).nullable().optional(),
          sku: z.string().trim().min(1).max(60),
          name: z.string().trim().min(1).max(80),
          price: z.number().int().min(0),
          isAvailable: z.boolean().optional(),
          displayOrder: z.number().int().min(0).optional(),
        }),
      )
      .min(1),
    images: z
      .array(
        z.object({
          id: z.string().trim().min(1).nullable().optional(),
          url: z.string().trim().url().max(2048),
          displayOrder: z.number().int().min(0).optional(),
        }),
      )
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0 || data.variants.length > 0 || data.images, {
    message: "At least one field or variants/images must be provided.",
  });

export type UpdateProductRequest = z.infer<typeof updateProductRequest>;

export const listProductsQueryRequest = z
  .object({
    search: z.string().trim().max(150).optional(),
    category: z.string().trim().max(100).optional(),
    isAvailable: z
      .enum(["true", "false"])
      .optional()
      .transform((val) => val === "true")
      .optional(),
    includeInactive: z
      .enum(["true", "false"])
      .optional()
      .transform((val) => val === "true")
      .optional(),
    sortBy: z.enum(["name", "createdAt", "updatedAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).default("asc").optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .strict();

export type ListProductsQueryRequest = z.infer<typeof listProductsQueryRequest>;

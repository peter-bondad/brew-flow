import { factory } from "@/server/hono/hono-factory";
import { container } from "@/server/container";
import { logger } from "@/server/logger";
import { validator } from "@/server/shared/validator";
import {
  createProductRequest,
  listProductsQueryRequest,
  productIdParamRequest,
  updateProductRequest,
} from "../../shared/product/product.dto";

export const listProductsController = factory.createHandlers(
  validator("query", listProductsQueryRequest),
  async (c) => {
    const query = c.req.valid("query");
    logger.info({ query }, "Fetching products list");

    const result = await container.productService.listProducts(query);
    logger.info({ count: result.data.length, total: result.stats.total }, "Products list fetched");

    return c.json({
      data: result.data,
      stats: result.stats,
      pagination: { limit: query.limit, offset: query.offset },
    });
  },
);

export const getProductController = factory.createHandlers(
  validator("param", productIdParamRequest),
  async (c) => {
    const { id } = c.req.valid("param");
    logger.info({ id }, "Fetching product by id");

    const data = await container.productService.getProductById(id);

    logger.info({ id }, "Product fetched");
    return c.json({ data });
  },
);

export const createProductController = factory.createHandlers(
  validator("json", createProductRequest),
  async (c) => {
    const input = c.req.valid("json");
    logger.info({ name: input.name, category: input.category }, "Creating product");

    const data = await container.productService.createProduct(input);

    logger.info({ id: data.id }, "Product created");
    return c.json({ data }, 201);
  },
);

export const updateProductController = factory.createHandlers(
  validator("param", productIdParamRequest),
  validator("json", updateProductRequest),
  async (c) => {
    const { id } = c.req.valid("param");
    const input = c.req.valid("json");
    logger.info({ id, name: input.name, category: input.category }, "Updating product");

    const data = await container.productService.updateProduct(id, input);

    logger.info({ id }, "Product updated");
    return c.json({ data });
  },
);

export const archiveProductController = factory.createHandlers(
  validator("param", productIdParamRequest),
  async (c) => {
    const { id } = c.req.valid("param");
    logger.info({ id }, "Archiving product");

    await container.productService.archiveProduct(id);

    logger.info({ id }, "Product archived");
    return c.json({ message: "Product archived." });
  },
);

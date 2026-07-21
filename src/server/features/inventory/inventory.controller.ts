import { factory } from "@/server/hono/hono-factory";
import { container } from "@/server/container";
import { validator } from "@/server/shared/validator";
import {
  adjustIngredientStockRequest,
  createIngredientRequest,
  idParamRequest,
  listIngredientsQueryRequest,
  listTransactionsQueryRequest,
  restockIngredientRequest,
  updateIngredientRequest,
} from "./inventory.dto";

export const listIngredientsController = factory.createHandlers(
  validator("query", listIngredientsQueryRequest),
  async (c) => {
    const query = c.req.valid("query");
    const data = await container.inventoryService.listIngredients(query);

    return c.json({ data });
  },
);

export const getIngredientController = factory.createHandlers(
  validator("param", idParamRequest),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = await container.inventoryService.getIngredient(id);

    return c.json({ data });
  },
);

export const createIngredientController = factory.createHandlers(
  validator("json", createIngredientRequest),
  async (c) => {
    const input = c.req.valid("json");
    const data = await container.inventoryService.createIngredient(input);

    return c.json({ message: "Ingredient created successfully.", data }, 201);
  },
);

export const updateIngredientController = factory.createHandlers(
  validator("param", idParamRequest),
  validator("json", updateIngredientRequest),
  async (c) => {
    const { id } = c.req.valid("param");
    const input = c.req.valid("json");
    const data = await container.inventoryService.updateIngredient(id, input);

    return c.json({ message: "Ingredient updated successfully.", data });
  },
);

export const deactivateIngredientController = factory.createHandlers(
  validator("param", idParamRequest),
  async (c) => {
    const { id } = c.req.valid("param");
    await container.inventoryService.deactivateIngredient(id);

    return c.json({ message: "Ingredient deactivated successfully." });
  },
);

export const restockIngredientController = factory.createHandlers(
  validator("param", idParamRequest),
  validator("json", restockIngredientRequest),
  async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const { id } = c.req.valid("param");
    const input = c.req.valid("json");
    const data = await container.inventoryService.restock(id, input, user.id);

    return c.json({ message: "Ingredient restocked successfully.", data }, 201);
  },
);

export const adjustIngredientStockController = factory.createHandlers(
  validator("param", idParamRequest),
  validator("json", adjustIngredientStockRequest),
  async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const { id } = c.req.valid("param");
    const input = c.req.valid("json");
    const data = await container.inventoryService.adjustStock(
      id,
      input,
      user.id,
    );

    return c.json({ message: "Stock adjusted successfully.", data }, 201);
  },
);

export const listIngredientTransactionsController = factory.createHandlers(
  validator("param", idParamRequest),
  validator("query", listTransactionsQueryRequest),
  async (c) => {
    const { id } = c.req.valid("param");
    const query = c.req.valid("query");
    const data = await container.inventoryService.listTransactions(id, query);

    return c.json({ data });
  },
);

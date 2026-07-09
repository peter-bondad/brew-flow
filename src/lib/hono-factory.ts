import { Env } from "@/server/types/hono-types";
import { createFactory } from "hono/factory";

export const factory = createFactory<Env>();

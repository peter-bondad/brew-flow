import { env } from "@/lib/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/server/infra/database/schemas/index.ts",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  strict: true,
  schemaFilter: "public",
  tablesFilter: "*",

  introspect: {
    casing: "camel",
  },

  migrations: {
    table: "__drizzle_migrations__",
    schema: "drizzle",
  },

  breakpoints: true,
  verbose: true,
});

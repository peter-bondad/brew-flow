import { env } from "@/lib/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres"; // 1. Import the underlying driver

// 2. Prevent TypeScript errors by letting it know 'globalThis' can hold a client
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// 3. Reuse the existing pool in development, or spin up a new one
const connection = globalForDb.conn ?? postgres(env.DATABASE_URL);

// 4. Save the reference back to globalThis if we are in local development
if (env.NODE_ENV !== "production") {
  globalForDb.conn = connection;
}

// 5. Wrap the stable connection inside Drizzle
const db = drizzle({
  client: connection,
  logger: env.NODE_ENV === "development",
});

export default db;

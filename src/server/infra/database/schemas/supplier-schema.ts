// --- Suppliers (optional but useful for reorder tracking) ---

import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const suppliers = pgTable("suppliers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  contactName: text("contact_name"),
  phoneNumber: text("phone_number"),
  email: text("email"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

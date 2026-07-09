import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";
import { invitationStatusEnum, userRoleEnum } from "./schema-pg.enum";
import { relations } from "drizzle-orm";

export const invitations = pgTable(
  "invitations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    name: text("name"),
    role: userRoleEnum("role").default("user").notNull(),
    tokenHash: text("token_hash").notNull().unique(),
    usedBy: text("used_by").references(() => users.id),
    expiresAt: timestamp("expires_at").notNull(),
    acceptedAt: timestamp("accepted_at"),
    createdBy: text("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    status: invitationStatusEnum("status").default("pending").notNull(),
  },
  (table) => [
    index("invitations_email_idx").on(table.email),
    index("invitations_createdBy_idx").on(table.createdBy),
    index("invitations_tokenHash_idx").on(table.tokenHash),
    index("invitations_status_idx").on(table.status),
  ],
);

export const invitationsRelations = relations(invitations, ({ one }) => ({
  creator: one(users, {
    fields: [invitations.createdBy],
    references: [users.id],
  }),
  usedUser: one(users, {
    fields: [invitations.usedBy],
    references: [users.id],
  }),
}));

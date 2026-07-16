import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./auth-schema";
import { invitationStatusEnum, userRoleEnum } from "./schema-pg.enum";
import { relations, sql } from "drizzle-orm";

export const invitations = pgTable(
  "invitations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    name: text("name"),
    firstName: text("first_name").notNull(),
    middleName: text("middle_name"),
    lastName: text("last_name").notNull(),
    role: userRoleEnum("role").default("staff").notNull(),
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
    uniqueIndex("invitations_pending_email_unique_idx")
      .on(table.email)
      .where(sql`${table.status} = 'pending'`),
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

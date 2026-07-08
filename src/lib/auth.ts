import { betterAuth } from "better-auth";
import { env } from "./env";
import { hashPassword, verifyHashedPassword } from "@/utils/password-hashing";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import db from "@/server/infra/database/client";
import { ac, user, admin as adminPlugin } from "./permissions";
import { admin } from "better-auth/plugins";
import * as schema from "@/server/infra/database/schemas/index";

export const auth = betterAuth({
  secret: env.NEXTAUTH_SECRET,
  appName: env.NEXT_PUBLIC_APP_NAME,
  appUrl: env.NEXTAUTH_URL,

  database: drizzleAdapter(db, {
    provider: "pg", // Specify the database provider (e.g., "pg" for PostgreSQL)
    usePlural: true, // Use plural table names (e.g., "users" instead of "user")
    schema,
  }),
  emailAndPassword: {
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: true,
    enabled: true,
    password: {
      hash: hashPassword,
      verify: verifyHashedPassword,
    },
  },
  plugins: [
    admin({
      ac,
      roles: {
        user,
        admin: adminPlugin,
      },
    }),
  ],
});

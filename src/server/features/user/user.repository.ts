import db from "@/server/infra/database/client";
import { IUserRepository, User } from "./user.interface";
import { users } from "@/server/infra/database/schemas";
import { eq } from "drizzle-orm";

export class UserRepository implements IUserRepository {
  constructor(private readonly database = db) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.database.query.users.findFirst({
      where: eq(users.email, email),
    });

    return user ?? null;
  }

  // user.repository.ts

  async updateEmailVerified(userId: string): Promise<boolean> {
    // Marks the account's email as verified. Returns false instead of throwing
    // if no user matched, so the caller can decide whether that's worth logging.
    const result = await this.database
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.id, userId))
      .returning({ id: users.id });

    return result.length > 0;
  }
}

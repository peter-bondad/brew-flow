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
}

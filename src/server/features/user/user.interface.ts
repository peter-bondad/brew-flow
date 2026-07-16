import { UserRole } from "@/server/shared/user-role.types";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: UserRole;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  updateEmailVerified(userId: string): Promise<boolean>;
}

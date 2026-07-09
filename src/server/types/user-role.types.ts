export const userRole = {
  User: "user",
  Admin: "admin",
} as const;
export type UserRole = (typeof userRole)[keyof typeof userRole];

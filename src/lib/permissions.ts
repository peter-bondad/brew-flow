import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
  invitation: ["create", "read", "delete"],
  user: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  invitation: ["create", "read", "delete"],
  user: ["create", "read", "update", "delete"],
});

export const user = ac.newRole({
  user: ["read"],
});

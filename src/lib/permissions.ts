import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
  invitation: ["create", "read", "delete"],
  user: ["create", "read", "update", "delete"],
} as const;

export type Resource = keyof typeof statement;

export type PermissionAction<T extends Resource> =
  (typeof statement)[T][number];

export type Permission = {
  [K in Resource]?: PermissionAction<K>[]; // each route only cares about the permission it needs.
};

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  invitation: ["create", "read", "delete"],
  user: ["create", "read", "update", "delete"],
});

export const user = ac.newRole({
  user: ["read"],
});

import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
  user: ["create", "read", "update", "delete"],

  invitation: ["create", "read", "delete"],

  menu: ["create", "read", "update", "delete"],

  inventory: ["create", "read", "update", "delete"],

  order: ["create", "read", "update"],

  report: ["read"],
} as const;

export type Resource = keyof typeof statement;

export type PermissionAction<T extends Resource> =
  (typeof statement)[T][number];

export type Permission = {
  [K in Resource]?: PermissionAction<K>[]; // each route only cares about the permission it needs.
};

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
  user: ["create", "read", "update", "delete"],

  menu: ["create", "read", "update"],

  invitation: ["create", "read", "delete"],

  inventory: ["create", "read", "update", "delete"],

  order: ["create", "read", "update"],

  report: ["read"],
});

export const manager = ac.newRole({
  invitation: ["create", "read", "delete"],

  user: ["read", "update"],

  menu: ["create", "read", "update"],

  inventory: ["create", "read", "update"],

  order: ["create", "read", "update"],

  report: ["read"],
});

export const staff = ac.newRole({
  menu: ["read"],

  inventory: ["read"],

  order: ["create", "read", "update"],
});

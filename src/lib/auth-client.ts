import { createAuthClient } from "better-auth/client";
import { env } from "./env";
import { adminClient } from "better-auth/client/plugins";
import { ac, user, admin as adminPluginClient } from "./permissions";

const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac,
      roles: {
        user,
        adminPluginClient,
      },
    }),
  ],
});

export default authClient;

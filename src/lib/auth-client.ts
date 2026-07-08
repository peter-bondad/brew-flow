import { createAuthClient } from "better-auth/client";
import { env } from "./env";
import { adminClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [adminClient()],
});

export default authClient;

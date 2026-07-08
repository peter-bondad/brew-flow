import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { Env } from "./types/hono-types";
import { requireAuth } from "./middleware/require-auth";

const app = new Hono<Env>()

  .use(
    "/api/auth/*", // or replace with "*" to enable cors for all routes
    cors({
      origin: env.CORS_ORIGIN, // replace with your origin
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  )

  .on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })

  // admin routes
  .use("/api/admin/*", requireAuth)

  .get("/api/hello", (c) => {
    return c.json({
      message: "Hello, World!",
    });
  });

export default app;

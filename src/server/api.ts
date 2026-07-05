import { Hono } from "hono";

const app = new Hono()

.basePath("/api");

app.get("/hello", (c) => {
  return c.json({
    message: "Hello, World!",
  });
});

export default app;
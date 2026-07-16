import type { Context } from "hono";
import {
  ApplicationError,
  ValidationError,
} from "@/server/shared/application.error";

// app-error-handler.ts (Hono)

export function appErrorHandler(error: Error, c: Context) {
  // Check ValidationError first — it extends ApplicationError, so if we
  // checked ApplicationError first, this branch would never run and we'd
  // silently drop the `errors` field with the actual validation details.
  if (error instanceof ValidationError) {
    return c.json(
      {
        code: error.code,
        message: error.message,
        errors: error.errors,
      },
      error.status,
    );
  }

  // Any other known, intentional error (invite expired, user exists, etc.)
  if (error instanceof ApplicationError) {
    return c.json(
      {
        code: error.code,
        message: error.message,
      },
      error.status,
    );
  }

  // Anything else is unexpected — log it so it's noticed, but never leak
  // internal details to the client.
  console.error("[UNHANDLED_ERROR]", error);

  return c.json(
    {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong.",
    },
    500,
  );
}

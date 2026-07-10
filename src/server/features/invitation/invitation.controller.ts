import { zValidator } from "@hono/zod-validator";
import { factory } from "@/server/hono/hono-factory";

import { acceptInvitationDto, createInvitationDto } from "./invitation.dto";
import { container } from "@/server/container";

export const createInvitationController = factory.createHandlers(
  zValidator("json", createInvitationDto),
  async (c) => {
    const user = c.get("user");

    if (!user) {
      return c.json(
        {
          message: "Unauthorized",
        },
        401,
      );
    }
    const input = c.req.valid("json");
    const result = await container.invitationService.createInvitation(
      user.id,
      input,
    );

    return c.json(
      {
        message: "Invitation created successfully",
        data: result,
      },
      201,
    );
  },
);

export const acceptInvitationController = factory.createHandlers(
  zValidator("json", acceptInvitationDto),
  async (c) => {
    const { name, password, token } = c.req.valid("json");

    await container.invitationService.acceptInvitation({
      name,
      password,
      token,
    });

    return c.json(
      {
        message: "Account created successfully.",
      },
      201,
    );
  },
);

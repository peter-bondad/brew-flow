import { factory } from "@/server/hono/hono-factory";

import { acceptInvitationDto, createInvitationDto } from "./invitation.dto";
import { container } from "@/server/container";
import { validator } from "@/server/shared/validator";

export const createInvitationController = factory.createHandlers(
  validator("json", createInvitationDto),
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
  validator("json", acceptInvitationDto),
  async (c) => {
    const { firstName, middleName, lastName, phoneNumber, password, token } =
      c.req.valid("json");

    await container.invitationService.acceptInvitation({
      firstName,
      middleName,
      lastName,
      phoneNumber,
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

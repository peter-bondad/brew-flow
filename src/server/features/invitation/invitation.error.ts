import { ApplicationError } from "@/server/shared/application.error";
import { HttpStatus } from "@/server/shared/http-status-code";

export class InvitationAlreadyExistsError extends ApplicationError {
  constructor(message = "A pending invitation already exists.") {
    super(message, "INVITATION_ALREADY_EXISTS", HttpStatus.CONFLICT);
  }
}

export class InvitationAlreadyAcceptedError extends ApplicationError {
  constructor(message = "Invitation has already been accepted.") {
    super(message, "INVITATION_ALREADY_ACCEPTED", HttpStatus.CONFLICT);
  }
}

export class InvitationExpiredError extends ApplicationError {
  constructor(message = "Invitation has expired.") {
    super(message, "INVITATION_EXPIRED", HttpStatus.GONE);
  }
}

export class InvitationNotFoundError extends ApplicationError {
  constructor(message = "Invitation not found.") {
    super(message, "INVITATION_NOT_FOUND", HttpStatus.NOT_FOUND);
  }
}

import { ApplicationError } from "@/server/shared/application.error";
import { HttpStatus } from "@/server/shared/http-status-code";

export class UserEmailAlreadyExists extends ApplicationError {
  constructor(message = "Email already exists.") {
    super(message, "EMAIL_ALREADY_EXISTS", HttpStatus.CONFLICT);
  }
}

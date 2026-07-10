import { ApplicationError } from "@/server/shared/application.error";

export class UserEmailAlreadyExists extends ApplicationError {
  constructor(message = "Email already exists.") {
    super(message, "EMAIL_ALREADY_EXISTS");
  }
}

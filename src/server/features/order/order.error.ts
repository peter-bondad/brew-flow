import { ApplicationError } from "@/server/shared/application.error";
import { HttpStatus } from "@/server/shared/http-status-code";

export class OrderNotFoundError extends ApplicationError {
  constructor(message = "Order not found.") {
    super(message, "ORDER_NOT_FOUND", HttpStatus.NOT_FOUND);
  }
}

export class InvalidOrderStatusError extends ApplicationError {
  constructor(message = "Invalid order status transition.") {
    super(message, "INVALID_ORDER_STATUS", HttpStatus.BAD_REQUEST);
  }
}

export class InsufficientStockError extends ApplicationError {
  constructor(message = "This change would reduce stock below zero.") {
    super(message, "INSUFFICIENT_STOCK", HttpStatus.CONFLICT);
  }
}

import { ApplicationError } from "@/server/shared/application.error";
import { HttpStatus } from "@/server/shared/http-status-code";

export class ProductNotFoundError extends ApplicationError {
  constructor(message = "Product not found.") {
    super(message, "PRODUCT_NOT_FOUND", HttpStatus.NOT_FOUND);
  }
}

export class ProductSlugAlreadyExistsError extends ApplicationError {
  constructor(message = "A product with this slug already exists.") {
    super(message, "PRODUCT_SLUG_ALREADY_EXISTS", HttpStatus.CONFLICT);
  }
}

export class ProductSkuAlreadyExistsError extends ApplicationError {
  constructor(message = "A variant with this SKU already exists.") {
    super(message, "PRODUCT_SKU_ALREADY_EXISTS", HttpStatus.CONFLICT);
  }
}

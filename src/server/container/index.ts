import { env } from "@/lib/env";
import {
  DevelopmentEmailService,
  ResendEmailService,
} from "../email/email.service";
import { InvitationRepository } from "../features/invitation/invitation.repository";
import { InvitationService } from "../features/invitation/invitation.service";
import db from "../infra/database/client";
import { resend } from "../email/resend";
import { UserRepository } from "../features/user/user.repository";
import { InventoryService } from "../features/inventory/inventory.service";
import { InventoryRepository } from "../features/inventory/inventory.repository";
import { ProductService } from "../features/product/product.service";
import { ProductRepository } from "../features/product/product.repository";
import { OrderService } from "../features/order/order.service";
import { OrderRepository } from "../features/order/order.repository";

// email service
const emailService =
  env.NODE_ENV === "development"
    ? new DevelopmentEmailService()
    : new ResendEmailService(resend);

const userRepository = new UserRepository(db);
const invitationRepository = new InvitationRepository(db);
const inventoryRepository = new InventoryRepository(db);
const productRepository = new ProductRepository(db);

const invitationService = new InvitationService(
  userRepository,
  invitationRepository,
  emailService,
);

const inventoryService = new InventoryService(inventoryRepository);
const productService = new ProductService(productRepository);
const orderRepository = new OrderRepository(db);
const orderService = new OrderService(orderRepository, inventoryService, productService);

export const container = {
  invitationService,
  emailService,
  inventoryService,
  productService,
  orderService,
};

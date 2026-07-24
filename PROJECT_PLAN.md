# BrewFlow Roadmap

> Last Updated: 2026-07-24

## Vision

BrewFlow is a modern coffee shop management system focused on operational efficiency, inventory accuracy, and a seamless ordering experience.

The platform consists of:

- Admin Dashboard (Web)
- Staff Ordering App (React Native)
- REST APIs
- Inventory & Recipe Engine
- POS
- Reporting & Analytics

---

# Current Phase

## Phase 1 — Core Platform

**Status:** 🚧 In Progress

### Authentication

- [x] Better Auth
- [x] Session Management
- [x] Protected Admin Routes
- [x] Role Permissions (`owner`, `manager`, `staff`)

### Dashboard

- [x] Overview
- [x] Inventory Alerts
- [ ] Recent Orders (needs real backend feed)
- [ ] Top Selling Products (needs real backend feed)

### Categories

#### Admin API

- [ ] CRUD Categories
- [ ] Public Categories Endpoint

> Categories remain as free-text strings on products for now. Managed categories are deferred.

### Products

#### Admin API

- [x] CRUD Products
- [x] CRUD Variants (full-replacement arrays)
- [x] Product Images
- [x] Product Availability
- [x] Product Recipes (`product_ingredients`)

#### Mobile API

- [ ] Product Menu Endpoint (active products + primary variant)
- [ ] Product Details Endpoint (full variants + images)

> The Admin Product API and Mobile Product API are intentionally separate.

### Inventory

- [x] Ingredients
- [x] Restocking
- [x] Manual Adjustments
- [x] Inventory Transactions (append-only audit trail)
- [x] Product Recipes (`product_ingredients`)
- [x] Automatic Inventory Deduction on order creation

### Orders

#### Admin API

- [x] List all orders
- [x] Get order detail
- [x] Update order status (`pending` → `preparing` → `ready` → `completed` / `cancelled`)
- [x] Refund order (restores inventory)

#### Mobile API

- [x] Create order
- [x] List my orders
- [x] Get my order detail

### Suppliers

- [x] Backend schema
- [ ] Admin CRUD UI
- [ ] Mobile API (not needed — mobile never manages suppliers)

---

# Next Major Milestone

## React Native Staff Ordering App

Staff-facing POS application for taking orders at the counter.

### Scope

Token-based authentication. Staff/manager/owner roles.

Staff can:

- Browse active products
- Search products
- Create orders
- View order history
- Update order status

No customer accounts.

No loyalty system.

Orders capture:

- Staff member (from auth token)
- Payment method
- Notes

---

# Payments

## MVP

Supported:

- Cash on Pickup

Future:

- Card
- GCash
- Maya

A dedicated Payments module will be implemented to support online payment providers.

---

# Future Features

## POS

- Cashier Screen
- Receipt Printing
- Discounts
- Taxes
- Payment Recording

---

## Inventory Automation

- Stock Counts
- Purchase Orders
- Supplier Management UI
- Low-stock reorder automation
- Waste tracking

---

## Analytics

- Sales Reports
- Revenue
- Peak Hours
- Best Sellers
- Inventory Reports
- Waste Reports

---

## Customer Features

Future only.

- Accounts
- Loyalty
- Favorites
- Order History
- Rewards

---

## Employee Management

Future only.

- Employees
- Roles
- Permissions
- Attendance
- Audit Logs

---

## Administration

- Store Settings
- Taxes
- Receipt Configuration
- Discounts
- Business Hours

---

# Technical Roadmap

## Backend

- Next.js
- Hono
- PostgreSQL
- Drizzle ORM
- Better Auth
- Zod

Future

- Object Storage
- Background Jobs
- API Versioning
- OpenAPI Documentation

---

## Admin Dashboard

- React
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Base UI

---

## Mobile

- React Native
- Expo
- TypeScript
- NativeWind
- TanStack Query
- React Hook Form
- Zod

---

# Design Principles

Every new feature should prioritize:

- Simplicity over complexity
- Type safety
- SOLID principles
- Clean Architecture
- Feature-first organization
- Reusable components
- Consistent UI/UX
- Performance
- Scalability
- Auditability

---

# Long-Term Vision

The long-term development plan is:

1. Core Admin Dashboard
2. Inventory Management
3. Product & Category Management
4. React Native Staff Ordering
5. POS System
6. Automatic Inventory Deduction
7. Reporting & Analytics
8. Employee Management
9. Multi-Branch Support
10. SaaS Platform

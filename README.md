# ☕ BrewFlow

> A modern Coffee Shop Management Platform built with **Next.js**, **Hono**, **Better Auth**, **Drizzle ORM**, and **PostgreSQL**.

🚧 **Status:** Active Development

---

# About

BrewFlow is a full-stack web application designed to simplify the day-to-day operations of small and medium-sized coffee shops.

The platform aims to centralize inventory management, products, menu management, point-of-sale (POS), employee administration, and business analytics into a single system.

This project is intentionally built using modern software engineering practices to explore scalable architecture, maintainability, and end-to-end type safety. While it currently serves as a portfolio project, the long-term vision is to evolve it into a practical management platform that can eventually be adopted by local coffee shops and similar businesses.

---

# Inspiration

BrewFlow was inspired by the growing number of independent coffee shops in **San Pablo City, Laguna**.

Many small businesses still rely on spreadsheets, handwritten inventory logs, or multiple disconnected tools to manage inventory, products, and daily operations.

The objective of BrewFlow is to explore how a modern web platform can simplify these workflows while remaining affordable, maintainable, and easy to use for small businesses.

---

# Why BrewFlow?

Managing a coffee shop involves much more than processing customer orders.

Owners and employees also need to manage:

- Products
- Inventory
- Ingredients
- Employees
- Sales
- Reports
- Daily Operations

Many businesses still perform these tasks manually or across multiple systems.

Instead of treating each module as an isolated CRUD application, BrewFlow is designed around real business workflows where every module shares the same source of truth.

```text
Inventory
      │
      ▼
Products
      │
      ▼
Menu
      │
      ▼
Point of Sale
      │
      ▼
Orders
      │
      ▼
Dashboard & Reports
```

This architecture reduces duplicated business logic and keeps inventory, products, menus, sales, and reporting synchronized throughout the application.

---

# Current Features

## Authentication

- Better Auth
- Session-based Authentication
- Protected Routes
- Server-side Authentication Guards

---

## Authorization

- Role-Based Access Control (RBAC)
- Permission-based Authorization
- Server-side Permission Guards
- Protected Administration Routes

---

## Invitation System

Administrators can securely invite employees without manually creating accounts.

Current features include:

- Secure invitation tokens
- SHA-256 hashed invitation tokens
- Invitation expiration
- Invitation acceptance
- Duplicate invitation prevention
- Invitation revocation
- Invitation status management

Supported invitation statuses:

- Pending
- Accepted
- Revoked
- Expired

---

## Validation

- Zod
- Shared validation wrapper
- Type-safe DTO validation
- Centralized validation pipeline

---

## Error Handling

Centralized application error handling.

Features include:

- Custom application errors
- Validation errors
- HTTP status abstraction
- Consistent API response format

Example response:

```json
{
  "code": "INVITATION_ALREADY_EXISTS",
  "message": "A pending invitation already exists."
}
```

---

# Technology Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Sonner

## Backend

- Hono
- Better Auth
- Drizzle ORM
- PostgreSQL
- Zod
- Argon2

---

# Why Hono?

BrewFlow uses **Hono** because it is lightweight, TypeScript-first, standards-based, and integrates seamlessly with Next.js.

Its middleware model, excellent TypeScript support, and high performance make it well suited for building a modular backend architecture while keeping the codebase simple and maintainable.

---

# Architecture

The backend follows a layered architecture to separate HTTP concerns from business logic and infrastructure.

```text
Controller
      │
      ▼
Service
      │
      ▼
Repository Interface
      │
      ▼
Repository Implementation
      │
      ▼
Drizzle ORM
      │
      ▼
PostgreSQL
```

This approach improves maintainability, scalability, and testability by ensuring each layer has a single responsibility.

---

# Design Philosophy

BrewFlow emphasizes maintainability over complexity.

Business logic remains independent from the database, HTTP framework, and infrastructure by relying on dependency injection and interface-driven design.

The project is intentionally structured so that individual components can evolve independently without affecting the rest of the application.

---

# Design Principles

The project follows:

- SOLID Principles
- Clean Architecture
- Dependency Injection
- Repository Pattern
- Feature-based Organization
- Separation of Concerns
- End-to-End Type Safety
- Single Source of Truth
- Maintainable Code
- Scalable Architecture

---

# Project Structure

```text
src
│
├── app
│   ├── (guest)
│   ├── (protected)
│   ├── api
│   └── components
│
├── server
│   ├── features
│   ├── infra
│   ├── middleware
│   ├── shared
│   ├── hono
│   └── container
│
└── lib
```

---

# Getting Started

## Prerequisites

- Node.js 20 or later
- pnpm
- PostgreSQL

---

## Installation

Clone the repository:

```bash
git clone https://github.com/peter-bondad/learn-next.git
cd learn-next
```

Install dependencies:

```bash
pnpm install
```

---

## Configure Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

RESEND_API_KEY=

CORS_ORIGIN=http://localhost:3000
```

> Additional environment variables may be required depending on the services being used.

---

## Initialize the Database

Generate the Better Auth schema and apply database migrations:

```bash
pnpm db:sync-auth
```

---

## Start the Development Server

```bash
pnpm dev
```

The application will be available at:

```text
http://localhost:3000
```

---

# Useful Commands

| Command             | Description                                      |
| ------------------- | ------------------------------------------------ |
| `pnpm dev`          | Start the development server                     |
| `pnpm build`        | Build the application                            |
| `pnpm start`        | Start the production server                      |
| `pnpm lint`         | Run ESLint                                       |
| `pnpm db:generate`  | Generate Drizzle migrations                      |
| `pnpm db:migrate`   | Apply database migrations                        |
| `pnpm db:studio`    | Open Drizzle Studio                              |
| `pnpm db:sync-auth` | Generate Better Auth schema and apply migrations |

---

# Roadmap

## Product Management

- Product CRUD
- Categories
- Images
- Product Status

## Inventory Management

Inventory will serve as the application's **single source of truth**.

Planned features include:

- Stock Management
- Inventory Adjustments
- Inventory History
- Inventory Audit Trail
- Low Stock Alerts

## Menu Management

- Menu Categories
- Product Availability
- Search & Filtering

## Point of Sale (POS)

- Cart
- Checkout
- Discounts
- Receipt Generation
- Payment Processing

## Dashboard

- Revenue Overview
- Sales Analytics
- Inventory Analytics
- Best Selling Products
- Recent Orders

## Employee Management

- Staff Accounts
- Roles
- Permissions
- Activity Logs

## Customer Management

- Customer Profiles
- Purchase History
- Loyalty Program

## Reporting

- Sales Reports
- Inventory Reports
- PDF Export
- Excel Export

## Notifications

- Low Stock Notifications
- Daily Summaries
- Email Notifications

---

# Security

Current security implementations include:

- Better Auth Session Authentication
- Role-Based Access Control (RBAC)
- Permission-Based Authorization
- Secure Invitation Tokens
- SHA-256 Invitation Token Hashing
- Argon2 Password Hashing
- Zod Validation
- Centralized Error Handling

Future improvements include:

- Rate Limiting
- Audit Logging
- Security Headers
- Activity Monitoring

---

# Contributing

BrewFlow is currently a personal project under active development.

Suggestions, architectural discussions, and feedback are always welcome.

---

# Author

**Peter Maironne L. Bondad**

Software Engineer

GitHub: https://github.com/peter-bondad

LinkedIn: _(Add your LinkedIn profile here)_

---

# License

This project is licensed under the MIT License.

# Screenshots

> Coming soon as the UI is completed.

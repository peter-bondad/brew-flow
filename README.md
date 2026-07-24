<p align="center">
  <img src="public/coffee-logo.svg" width="120" alt="BrewFlow Logo">
</p>

<h1 align="center">BrewFlow</h1>

> A Coffee Shop Management Platform built with **Next.js**, **Hono**, **Better Auth**, **Drizzle ORM**, and **PostgreSQL**.

🚧 **Status:** Active Development

---

## About

BrewFlow is a full-stack platform that centralizes inventory, product management, point-of-sale (POS), employee administration, and business analytics for small and medium-sized coffee shops.

It's a portfolio project exploring scalable architecture and end-to-end type safety, inspired by the number of independent coffee shops in **San Pablo City, Laguna** still running on spreadsheets and disconnected tools. The long-term goal is to make it usable by real local businesses.

Instead of treating each module as an isolated CRUD app, BrewFlow keeps inventory as the single source of truth that products, menu, POS, orders, and reporting all read from:

```text
Inventory → Products & Variants → Menu → Point of Sale → Orders → Dashboard & Reports
```

BrewFlow serves multiple clients from a single backend API:

```text
Web Admin Panel (Next.js)   →   Owner/Manager management console
Mobile App (React Native)   →   Staff POS, ordering, and menu
```

---

## Architecture

### Consumers

| Client | Tech | Primary Users | Purpose |
|---|---|---|---|
| **Web Admin** | Next.js App Router | Owner, Manager | Product management, inventory, users, invitations, suppliers, reports |
| **Mobile App** | React Native | Staff, Manager, Owner | Menu catalog, order entry, order history, checkout |
| **Backend API** | Hono + Next.js Route Handler | All clients | Auth, business logic, validation, database access |

### Backend Structure

Layered backend to keep HTTP, business logic, and infrastructure separate:

```text
Controller → Service → Repository Interface → Repository Implementation → Drizzle ORM → PostgreSQL
```

Business logic stays independent of the database, framework, and infrastructure via dependency injection and interface-driven design, following SOLID, Clean Architecture, and the Repository Pattern.

```text
src
├── app
│   ├── (guest)
│   ├── (protected)
│   │   └── admin
│   │       └── products        ← Product management UI
│   │       └── inventory
│   │       └── invite
│   │       └── settings
│   │       └── page.tsx        ← Dashboard
│   ├── api                     ← Backend API routes
│   └── components
├── lib
│   ├── api                     ← Client API hooks (React Query)
│   └── format.ts
└── server
    ├── container               ← Dependency injection
    ├── errors
    ├── features
    │   ├── product
    │   ├── inventory
    │   ├── invitation
    │   ├── user
    │   └── order               ← Order service (in development)
    ├── hono
    ├── infra
    │   └── database
    │       └── schemas
    ├── jobs
    ├── middleware
    └── shared
        ├── product
        ├── inventory
        └── user-role.types.ts
```

---

## Current Features

**Authentication & Authorization**

- Better Auth, session-based auth for web; token-based auth for mobile
- Role-Based Access Control (RBAC) + permission-based guards
- Protected routes (client and server-side)
- Role enforcement by client type (admin vs mobile)

**Invitation System**

- Secure, SHA-256 hashed invitation tokens
- Invitation expiration (computed at read time)
- Acceptance, revocation, duplicate-invite prevention
- Statuses: Pending, Accepted, Revoked, Expired

**Validation & Error Handling**

- Zod-based shared validation pipeline, type-safe DTOs
- Centralized app errors with consistent API response shape:

```json
{
  "code": "INVITATION_ALREADY_EXISTS",
  "message": "A pending invitation already exists."
}
```

**Background Jobs**

- Scheduled invitation expiration via Vercel Cron Jobs

**Data Model (in progress)**

- Product catalog separated from sellable variants (size/SKU/price per variant)
- Cart and order schemas keyed off variants, not base products
- Ingredient-level inventory schema with a recipe system (`productIngredients`) mapping each variant to the raw materials it consumes
- Append-only inventory transaction ledger for auditable stock changes (restock, sale deduction, adjustment, waste, return)

---

## Tech Stack

**Frontend (Web Admin):** Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, Lucide React, Sonner, TanStack Query, TanStack Table

**Mobile App (in development):** React Native, Expo, TanStack Query

**Backend:** Hono, Better Auth, Drizzle ORM, PostgreSQL, Zod, Argon2

**Database:** PostgreSQL via Drizzle ORM, Neon (production)

---

## API Design

Single backend serves both web admin and mobile app. Endpoints are grouped by concern and guarded by role:

```text
/api/auth/*                     → Public auth (login, refresh, logout)
/api/products                   → Staff/mobile: active products only
/api/orders                     → Staff/mobile: create orders, own history
/api/admin/products             → Admin: full product CRUD
/api/admin/inventory            → Admin: inventory management
/api/admin/invitations          → Admin: invite lifecycle
/api/admin/users                → Admin: user management
/api/admin/orders               → Admin: order management and reporting
/api/admin/suppliers            → Admin: supplier management
```

**Auth by client:**
- Web admin uses session cookies via Better Auth.
- Mobile app uses short-lived access tokens + refresh tokens.
- Same user database, same permission logic, different transport.

---

## Development Setup

**Prerequisites:** Node.js 20+, pnpm, PostgreSQL

```bash
git clone https://github.com/peter-bondad/brew-flow.git
cd brew-flow
pnpm install
```

Create a `.env` file:

```env
DATABASE_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

RESEND_API_KEY=

CRON_SECRET=

CORS_ORIGIN=http://localhost:3000

NEXT_PUBLIC_APP_NAME=BrewFlow
NEXT_PUBLIC_APP_DESCRIPTION=Coffee Shop Management Platform
```

Generate the Better Auth schema, then apply migrations:

```bash
pnpm db:auth-gen
pnpm db:sync:schema
```

Start the dev server:

```bash
pnpm dev
```

App runs at `http://localhost:3000`.

---

## Useful Commands

| Command                | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| `pnpm dev`             | Start the development server                             |
| `pnpm build`           | Build the application                                    |
| `pnpm start`           | Start the production server                              |
| `pnpm lint`            | Run ESLint                                               |
| `pnpm test`            | Run unit tests (Vitest)                                  |
| `pnpm db:auth-gen`     | Generate Better Auth schema from `src/lib/auth.ts`       |
| `pnpm db:generate`     | Generate Drizzle migrations                              |
| `pnpm db:migrate`      | Apply database migrations                                |
| `pnpm db:push`         | Push schema changes directly (no migration files)        |
| `pnpm db:studio`       | Open Drizzle Studio                                      |
| `pnpm db:sync:schema`  | Generate + apply migrations in one step                  |
| `pnpm db:seed`         | Seed local database                                      |
| `pnpm db:push:prod`    | Push schema changes to production                        |
| `pnpm db:migrate:prod` | Apply migrations to production                           |
| `pnpm db:seed:prod`    | Seed production database (initial administrator account) |
| `pnpm db:reset`        | Tear down and recreate local Docker database             |

---

## Roadmap

**Core Platform**
- **Products** — CRUD, categories, images, variants (sizes/SKU), status (admin)
- **Inventory** — stock management, adjustments, transaction history/audit trail, low stock detection
- **Orders** — mobile order entry, checkout, order history, inventory deduction
- **Dashboard** — revenue overview, sales & inventory analytics, best sellers, recent orders

**Mobile App (React Native)**
- Menu catalog and product browsing
- Cart, checkout, and payment processing
- Order history and status tracking
- Push notifications for new orders

**Admin Panel Enhancements**
- User management and role assignment
- Invitation system with email delivery
- Supplier management and purchase orders
- Reports and analytics with export

### Future / Exploratory

- **AI-assisted reordering** — suggest restock quantities based on historical sales velocity per ingredient
- **Natural language reporting** — ask questions like "what sold best last week" against the reporting layer instead of navigating dashboards
- **AI-assisted menu content** — generate product descriptions from a name/category as a starting draft for staff to edit
- **Sales anomaly detection** — flag unusual drops/spikes in a product's sales for manager review
- **n8n automation layer** — optional integration for multi-channel alert routing (Slack, SMS, email) and workflow automation beyond what the core notification job handles

---

## Security

- Better Auth session authentication (web) and token authentication (mobile)
- RBAC + permission-based authorization
- Secure invitation tokens (SHA-256 hashed)
- Argon2 password hashing
- Scheduled job authentication (`CRON_SECRET`)
- Zod validation, rate limiting, centralized error handling

**Planned:** audit logging, security headers, activity monitoring

---

## Deployment

Production runs on **Vercel** + **Neon PostgreSQL**, with **Better Auth** and **Vercel Cron Jobs**.

```bash
pnpm db:migrate:prod   # apply production migrations
pnpm db:seed:prod      # seed initial administrator account
```

---

## Author

**Peter Maironne L. Bondad**
Software Engineer

GitHub: https://github.com/peter-bondad/brew-flow

---

## License

MIT License

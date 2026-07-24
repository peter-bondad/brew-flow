# Architecture

## Project Philosophy

BrewFlow is designed around the following principles:

- Simplicity over unnecessary abstraction.
- Production-ready implementations.
- Maintainability over cleverness.
- Strong type safety.
- Feature-first organization.
- Server-first rendering.
- Reusable components before duplication.

---

# Application Architecture

## Folder Structure

Use a feature-first architecture.

Each feature owns its:

- UI
- API
- Business logic
- Validation
- Types
- Database access

Avoid organizing by technical layer when it makes features harder to understand.

---

## Next.js

Rules:

- Prefer Server Components.
- Use Client Components only when interactivity is required.
- Keep pages thin.
- Fetch data on the server whenever possible.
- Minimize client-side fetching.

---

## API Layer

Responsibilities:

- Validate requests.
- Authenticate users.
- Authorize access.
- Call the appropriate service.
- Return typed responses.

Avoid:

- Business logic
- Database queries
- Complex transformations

---

## Service Layer

Responsibilities:

- Own business rules.
- Coordinate repositories.
- Handle transactions.
- Enforce domain constraints.

Services should never contain presentation logic.

---

## Repository / Database Layer

Responsibilities:

- Database access only.
- Query composition.
- No business decisions.
- Return typed models.

Repositories should remain reusable.

---

## Validation

Always validate external input.

Use:

- Zod
- Shared DTOs

Never trust:

- Forms
- API requests
- Query parameters
- Route parameters

---

## DTOs

Rules:

- Reuse DTOs.
- Infer types from Zod.
- Avoid duplicate interfaces.
- Separate API contracts from database models.

---

## Dependency Direction

Allowed flow:

Page

↓

Component

↓

API

↓

Service

↓

Repository

↓

Database

Never reverse this dependency flow.

---

## State Management

Prefer:

- Server state
- URL state
- Local component state

Avoid global state unless multiple unrelated features require it.

---

## Reusable Components

Before creating a component:

- Check existing shared components.
- Extend existing components when appropriate.
- Avoid duplicate implementations.
- Prefer composition over inheritance.

---

## Error Handling

Errors should:

- Be typed.
- Return meaningful messages.
- Avoid leaking internal details.
- Preserve stack traces during development.

---

## General Principles

Always prioritize:

- Readability
- Maintainability
- Simplicity
- Scalability
- Type safety

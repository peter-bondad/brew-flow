# Development Standards

## General Principles

Always follow:

- SOLID
- ACID
- DRY
- KISS
- Composition over inheritance

Prefer readable code over clever code.

---

# Type Safety

Type safety is mandatory.

Rules:

- Never use `any`.
- Never use `@ts-ignore`.
- Never use `@ts-nocheck`.
- Prefer `unknown` over `any`.
- Infer types from Zod.
- Reuse DTOs.
- Avoid duplicate interfaces.
- Avoid unnecessary type assertions.
- Avoid unnecessary non-null assertions (`!`).
- Preserve end-to-end type safety.

---

# Code Quality

Prefer:

- Small focused functions.
- Small focused components.
- Explicit naming.
- Predictable behavior.
- Minimal abstractions.

Avoid:

- Dead code.
- Duplicate logic.
- Deep nesting.
- Large components.
- Large functions.

---

# React

Prefer:

- Server Components.
- Derived state.
- Composition.

Avoid unnecessary:

- useEffect
- useMemo
- useCallback
- Context
- Local state

Only introduce hooks when they provide measurable value.

---

# Database

## Queries

Always:

- Prevent N+1 queries.
- Select only required columns.
- Avoid `SELECT *`.
- Push filtering to the database.
- Push sorting to the database.
- Push aggregation to the database.
- Use pagination for large datasets.
- Reuse existing queries.

---

## Indexes

Recommend indexes for:

- Foreign keys.
- Frequently filtered columns.
- Frequently sorted columns.
- Unique lookups.
- Composite query patterns.

Explain why each index is beneficial.

---

## Transactions

Use transactions only for:

- Atomic operations.
- Multi-step writes.
- Financial consistency.
- Inventory consistency.

Keep transaction scope as small as possible.

---

## Performance

Before implementation, consider:

- Database round trips.
- Query complexity.
- Memory usage.
- CPU usage.
- Network overhead.
- Expected data growth.

Optimize obvious bottlenecks.

Avoid premature optimization.

---

# API Design

Rules:

- RESTful.
- Predictable.
- Consistent.
- Type-safe.
- Easy to extend.

Always:

- Validate requests.
- Return consistent responses.
- Use appropriate HTTP status codes.
- Keep controllers thin.

Business logic belongs in services.

---

# Security

Always consider:

- SQL Injection.
- XSS.
- CSRF (when applicable).
- Authorization.
- Authentication.
- Sensitive data leakage.
- Input validation.

Assume all client input is untrusted.

---

# Testing Mindset

Even when tests are not requested:

Think about:

- Edge cases.
- Invalid input.
- Empty states.
- Error states.
- Large datasets.
- Concurrency.

Implement code that naturally supports testing.

---

# Scalability

Design for future growth.

Consider:

- Read performance.
- Write performance.
- Maintainability.
- Extensibility.
- Operational simplicity.

Choose the simplest solution that scales well.

---

# Final Engineering Mindset

Before considering the implementation complete, ask:

- Is this the simplest solution?
- Is it production-ready?
- Is it type-safe?
- Does it follow the project architecture?
- Is it easy to maintain?
- Is there a cleaner implementation?
- Will another developer understand this in six months?

If improvements are identified, implement them before marking the task complete.

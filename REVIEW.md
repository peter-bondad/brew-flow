# Engineering Review Checklist

Before considering the task complete:

## Correctness

- Build succeeds.
- TypeScript passes.
- ESLint passes.
- No runtime errors.

## Code Quality

- No dead code.
- No duplicated logic.
- No unused imports.
- No unnecessary abstractions.
- No unnecessary state.
- No unnecessary effects.
- No unnecessary re-renders.

## Type Safety

- No `any`.
- No `@ts-ignore`.
- DTOs reused.
- Existing types reused.
- End-to-end type safety maintained.

## Database

- No N+1 queries.
- Appropriate indexes considered.
- Efficient query patterns.
- Transactions used correctly.
- No unnecessary round trips.

## Security

- Validation present.
- Authorization respected.
- Sensitive data protected.

## UI

- Responsive.
- Accessible.
- Consistent with the design system.

## Architecture

- Existing patterns preserved.
- Business logic remains in services.
- Components are reusable.
- Simplicity maintained.

If improvements are identified, implement them before marking the task complete.

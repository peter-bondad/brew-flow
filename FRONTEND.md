# Frontend Guidelines

## Design Philosophy

The BrewFlow admin interface is designed for coffee shop owners and managers.

Prioritize:

- Clarity over decoration.
- Speed over complexity.
- Readability over density.
- Actionable information over visual noise.
- Consistency across all pages.

Every screen should help staff make operational decisions quickly.

---

# Design System

## Theme

Maintain a warm coffee-inspired visual identity.

Use:

- Warm neutral backgrounds.
- Soft brown accents.
- Consistent border radius.
- Subtle shadows.
- Comfortable whitespace.

Avoid:

- Harsh colors.
- Excessive gradients.
- Heavy shadows.
- Flashy animations.
- Decorative UI that does not improve usability.

---

## Layout

Pages should follow a consistent hierarchy.

Structure:

Page Header

↓

Quick Actions (optional)

↓

Summary Cards

↓

Primary Content

↓

Secondary Content

↓

Dialogs / Drawers

Keep layouts predictable across all modules.

---

## Typography

Prefer clear visual hierarchy.

Guidelines:

- One primary page title.
- Short descriptive subtitle.
- Consistent heading sizes.
- Avoid unnecessary font weight changes.
- Keep text concise.

---

# Components

## Reusability

Before creating a new component:

- Check existing shared components.
- Extend existing components when appropriate.
- Prefer composition over duplication.
- Keep shared components generic.
- Extract repeated UI patterns.

Avoid creating feature-specific components that could be shared.

---

## shadcn/ui

Prefer existing shadcn/ui components whenever possible.

Examples:

- Card
- Button
- Table
- Badge
- Sheet
- Dialog
- Dropdown Menu
- Tooltip
- Alert
- Skeleton
- Separator

Avoid rebuilding existing primitives.

---

## Base UI

Use Base UI when:

- More advanced interaction is required.
- Better accessibility is needed.
- shadcn does not provide the required primitive.

Maintain a consistent appearance with shadcn components.

---

## Icons

Use Lucide icons.

Guidelines:

- One icon per action.
- Avoid decorative icons.
- Keep icon sizing consistent.
- Icons should improve recognition.

---

# React Guidelines

Prefer:

- Server Components.
- Composition.
- Derived state.

Avoid unnecessary:

- useEffect
- useMemo
- useCallback
- Context
- Client Components

Only use Client Components when interactivity requires them.

---

## State Management

Prefer:

- Server state.
- URL state.
- Local component state.

Avoid global state unless multiple unrelated features require shared state.

Keep state as close as possible to where it is used.

---

# Forms

Forms should:

- Be type-safe.
- Validate with Zod.
- Display clear validation messages.
- Prevent duplicate submissions.
- Handle loading states.
- Handle error states.
- Handle empty states.

Never rely solely on client-side validation.

---

# Tables

Tables should prioritize operational efficiency.

Include only necessary columns.

Support:

- Search
- Filtering
- Sorting
- Pagination (when needed)

Avoid:

- Horizontal scrolling whenever possible.
- Excessive actions per row.
- Large blocks of text.

---

# Dashboard Philosophy

Dashboards should answer operational questions immediately.

Examples:

- What needs attention?
- What is running low?
- What is selling well?
- What requires action today?

Avoid dashboards that only display interesting statistics.

---

## Charts

Do not add charts by default.

Only use charts when they help users:

- Identify trends.
- Compare historical performance.
- Make business decisions.

Avoid charts that duplicate information already visible in tables or summary cards.

---

# Inventory Pages

Inventory pages should prioritize operational actions.

Show:

- Current stock.
- Stock status.
- Reorder threshold.
- Supplier.
- Unit cost.
- Last updated.
- Available actions.

Highlight:

- Low stock.
- Out of stock.
- Inactive ingredients.

Avoid showing unnecessary metrics.

---

# Loading States

Always provide loading feedback.

Prefer:

- Skeleton components.
- Disabled actions while loading.
- Progressive rendering.

Avoid layout shifts.

---

# Empty States

Empty states should:

- Explain why the page is empty.
- Suggest the next action.
- Include a primary call-to-action when appropriate.

---

# Error States

Error messages should:

- Be understandable.
- Explain what happened.
- Suggest recovery when possible.

Avoid exposing internal implementation details.

---

# Accessibility

Always ensure:

- Keyboard navigation.
- Proper focus management.
- Accessible labels.
- Sufficient color contrast.
- Semantic HTML.

Do not rely on color alone to communicate status.

---

# Responsive Design

Design desktop-first.

Ensure layouts adapt cleanly for tablets and mobile devices.

Avoid horizontal scrolling except for complex data tables.

---

# Performance

Optimize rendering.

Avoid:

- Unnecessary re-renders.
- Large Client Components.
- Unnecessary effects.
- Unnecessary state.

Prefer lazy loading when appropriate.

Reuse components to reduce duplication.

---

# User Experience

Every interaction should provide feedback.

Support:

- Loading indicators.
- Success notifications.
- Error notifications.
- Confirmation for destructive actions.

Keep interactions predictable and consistent.

---

# Final Frontend Checklist

Before considering the UI complete:

- Consistent with the design system.
- Responsive.
- Accessible.
- Type-safe.
- Reusable.
- Minimal and uncluttered.
- No duplicated components.
- No unnecessary Client Components.
- No unnecessary React hooks.
- No unnecessary complexity.
- Matches the existing BrewFlow UI.
- Ready for production.

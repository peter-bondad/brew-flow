# Commit Convention

Before generating any Git commit message, follow this format:

## Format

<type>(<scope>): <subject>

Then provide:

Why:
- Explain why the change was necessary.

Changes:
- Bullet list of the major implementation details.

Breaking Changes:
- State "None" if there are none.

## Type Rules

- feat: new user-visible feature
- fix: actual defect corrected
- refactor: code change that neither fixes a bug nor adds a feature
- style: formatting, missing semicolons, etc. (no code change)
- docs: documentation only
- chore: dependencies, build process, etc.

Do not use feat if the work is primarily refactoring.
Do not use refactor if user-visible behavior changed.
Do not use fix unless an actual defect was corrected.


## Examples

refactor(inventory): simplify stock action dialog state management

Why:
- Remove unnecessary React effects.
- Improve maintainability.

Changes:
- replace multiple state hooks with a single form state
- remove effect-based initialization
- centralize form reset logic
- preserve existing API behavior

Breaking Changes:
- None

fix(inventory): correct low stock threshold to use minimumStockLevel

Why:
- Backend lowStockOnly filter was using restockQuantity instead of minimumStockLevel, causing inconsistent results between the table badge and the filter toggle.

Changes:
- change repository condition from restockQuantity to minimumStockLevel
- align backend filter with StockBadge and stats card logic

Breaking Changes:
- None

feat(inventory): add restock and adjust stock dialogs

Why:
- Users need to perform stock actions directly from the table instead of only seeing console.log stubs.

Changes:
- implement RestockDialog with quantity, unit cost, and note fields
- implement AdjustStockDialog with type selector and quantity change
- wire up dialog state in inventory page
- add useAdjustIngredientStock mutation hook

Breaking Changes:
- None

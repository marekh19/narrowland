---
"narrowland": minor
---

Add `is.propertyOf` higher-order guard to narrow individual object properties via any predicate.

Use it to enforce per-property constraints while keeping the rest of the shape intact, e.g. `const hasStringName = is.propertyOf('name', is.string)` now guarantees that name exists and is a string whenever the guard passes.

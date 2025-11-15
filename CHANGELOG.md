# narrowland

## 1.3.0

### Minor Changes

- Add `is.symbol` type guard and `assert.symbol` assertion
- Add `is.bigint` type guard and `assert.bigint` assertion
- Add `is.instanceOf` type guard and `assert.instanceOf` assertion
  - Can be used to narrow a value to be an instance of a given constructor - e.g. as a predicate for `Array.filter()`
- Add `is.arrayOf` type guard and `assert.arrayOf` assertion
  - Can be used to narrow a value to be an array whose items satisfy a provided type guard - e.g. to narrow `unknown[]` to `string[]`.
- Add `is.propertyOf` higher-order guard to narrow individual object properties via any predicate.
  - Use it to enforce per-property constraints while keeping the rest of the shape intact, e.g. `const hasStringName = is.propertyOf('name', is.string)` now guarantees that name exists and is a string whenever the guard passes.

## 1.2.1

### Patch Changes

- fix: `*.oneOf` - add type binding between first and second argument for improved type inference

## 1.2.0

### Minor Changes

- Resolves #8

  Add `is.oneOf` type guard and `assert.oneOf` assertion.

  - Broader replacement for `.stringLiteral` utilities — works with arrays/tuples of any values (even mixed).
  - Deprecate `is.stringLiteral` and `assert.stringLiteral` (to be removed in v2.0.0).
  - Update README with new usage section

## 1.1.1

### Patch Changes

- extend `*.stringLiteral` to accept `unknown` instead of just `string` - ensures consistency with rest of the api

## 1.1.0

### Minor Changes

- add `assertStringLiteral` and `isStringLiteral` functions

## 1.0.1

### Patch Changes

- bafcaed: no code changes, just docs polish

## 1.0.0

### Major Changes

- 🎉 Initial stable release.

  A lightweight TypeScript library providing **type guards**, **type assertions**, and **invariant utilities** for safe runtime type narrowing.

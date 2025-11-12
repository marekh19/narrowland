# narrowland

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

# narrowland

## 1.7.0

### Minor Changes

- e504090: Add `isEmptyArray`, `assertEmptyArray`, and `ensureEmptyArray` utilities

### Patch Changes

- fce8947: Upgrades TypeScript to v6.0.

  - Drops support for TypeScript < 6.0 as a peer development dependency.
  - Removes tsconfig options that are now redundant defaults in TS 6.0 (`useDefineForClassFields`, `allowImportingTsExtensions`).

- 5b6119a: Fixes TypeScript declaration files being incompatible with `moduleResolution: NodeNext`.

  - Previously, rslib emitted per-source-file declarations with extensionless relative imports, causing TypeScript to silently lose all type information in consumer projects using NodeNext resolution.
  - Migrated build tooling from rslib to tsdown, which bundles both JS and declarations into single output files by default. Also updated package exports to the modern nested `import`/`require` structure with per-condition type declarations (`.d.mts` for ESM, `d.cts` for CJS).

## 1.6.0

### Minor Changes

- 1575baf: - Add `is.function` type guard, `assert.function` assertion, and `ensure.function` utility
  - Narrows a value to `(...args: unknown[]) => unknown` using `typeof value === 'function'`

## 1.5.0

### Minor Changes

- 14a1af1: - Implement `ensure` family to extend `is` and `assert` branches of the library with directly returning the narrowed value
  - Mark `ensure()` as deprecated, replaced with `ensureDefined()` or `ensure.defined()`. Will be removed in v2.0.0

### Patch Changes

- 14a1af1: Fix `assert` namespace typing by adding explicit `AssertNamespace` interface (required by TypeScript for assertion functions) and add namespace integration tests for `is`, `assert`, and `ensure`
- 14a1af1: Minor test fixes - mainly type tests strictness
- 14a1af1: Deprecate `isFalsy` and `assertFalsy` - no valid use case, type narrowing does not work properly. Can be replaced by negating `isTruthy` or `assertTruthy` respectively

## 1.4.0

### Minor Changes

- Add `is.keyOf` type guard and `assert.keyOf` assertion
  - Can be used to safely check if a value is a key of a provided object/record
  - Enables type-safe dynamic property access with full TypeScript inference
- Fix typos:
  - in error messages: "folowing" → "following" in `assert.stringLiteral` and `assert.oneOf`
  - in JSDoc: "narrow" → "narrows" in `is.propertyOf`

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

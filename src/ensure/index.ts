import { ensure as deprecatedEnsure } from '../errors'
import {
  ensureArray,
  ensureArrayOf,
  ensureKeyOf,
  ensureNonEmptyArray,
  ensureObject,
  ensureOneOf,
} from './collections'
import { ensureDefined, ensureNotNull, ensureTruthy } from './existence'
import { ensureFromPredicate } from './fromPredicate'
import type { EnsureNamespace } from './namespace'
import {
  ensureBigint,
  ensureBoolean,
  ensureInstanceOf,
  ensureNonEmptyString,
  ensureNumber,
  ensureString,
  ensureSymbol,
} from './primitives'

// v2.0.0 migration: `ensure` is currently a callable function (deprecated) with namespace
// methods attached via Object.assign. This is a workaround to avoid a breaking change in v1.x.
// The `EnsureNamespace` interface marks only the call signature as @deprecated, so consumers
// see a warning on `ensure(value)` but not on `ensure.string(value)` or `import { ensure }`.
//
// In v2.0.0: remove the Object.assign workaround, delete `namespace.ts` and
// `src/errors/ensure.ts`, and define `ensure` as a plain object (like `is` and `assert`).
export const ensure: EnsureNamespace = Object.assign(deprecatedEnsure, {
  string: ensureString,
  nonEmptyString: ensureNonEmptyString,
  number: ensureNumber,
  boolean: ensureBoolean,
  bigint: ensureBigint,
  symbol: ensureSymbol,
  instanceOf: ensureInstanceOf,
  defined: ensureDefined,
  notNull: ensureNotNull,
  truthy: ensureTruthy,
  array: ensureArray,
  nonEmptyArray: ensureNonEmptyArray,
  arrayOf: ensureArrayOf,
  object: ensureObject,
  oneOf: ensureOneOf,
  keyOf: ensureKeyOf,
  fromPredicate: ensureFromPredicate,
})

export {
  ensureArray,
  ensureArrayOf,
  ensureKeyOf,
  ensureNonEmptyArray,
  ensureObject,
  ensureOneOf,
} from './collections'
export { ensureDefined, ensureNotNull, ensureTruthy } from './existence'
export { ensureFromPredicate } from './fromPredicate'
export {
  ensureBigint,
  ensureBoolean,
  ensureInstanceOf,
  ensureNonEmptyString,
  ensureNumber,
  ensureString,
  ensureSymbol,
} from './primitives'

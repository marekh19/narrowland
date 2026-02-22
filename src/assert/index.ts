import {
  assertArray,
  assertArrayOf,
  assertKeyOf,
  assertNonEmptyArray,
  assertObject,
  assertOneOf,
  assertStringLiteral,
} from './collections'
import {
  assertDefined,
  assertFalsy,
  assertNotNull,
  assertTruthy,
} from './existence'
import { assertFromPredicate } from './fromPredicate'
import type { AssertNamespace } from './namespace'
import {
  assertBigint,
  assertBoolean,
  assertInstanceOf,
  assertNonEmptyString,
  assertNumber,
  assertString,
  assertSymbol,
} from './primitives'

export const assert: AssertNamespace = {
  array: assertArray,
  nonEmptyArray: assertNonEmptyArray,
  arrayOf: assertArrayOf,
  object: assertObject,
  falsy: assertFalsy,
  truthy: assertTruthy,
  defined: assertDefined,
  notNull: assertNotNull,
  boolean: assertBoolean,
  bigint: assertBigint,
  symbol: assertSymbol,
  instanceOf: assertInstanceOf,
  nonEmptyString: assertNonEmptyString,
  stringLiteral: assertStringLiteral,
  oneOf: assertOneOf,
  number: assertNumber,
  string: assertString,
  fromPredicate: assertFromPredicate,
  keyOf: assertKeyOf,
  // FIXME: remove below with v2.0.0 - wrong name, keep for now for backwards compatibility
  /**
   * @deprecated Use `assert.keyOf` instead. Will be removed in v2.0.0.
   */
  keyof: assertKeyOf,
}

export {
  assertArray,
  assertNonEmptyArray,
  assertArrayOf,
  assertObject,
  assertDefined,
  assertFalsy,
  assertNotNull,
  assertTruthy,
  assertBigint,
  assertBoolean,
  assertSymbol,
  assertInstanceOf,
  assertNonEmptyString,
  assertStringLiteral,
  assertNumber,
  assertString,
  assertFromPredicate,
  assertOneOf,
  assertKeyOf,
}

import {
  assertArray,
  assertArrayOf,
  assertEmptyArray,
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
  assertFunction,
  assertInstanceOf,
  assertNonEmptyString,
  assertNumber,
  assertString,
  assertSymbol,
} from './primitives'

export const assert: AssertNamespace = {
  array: assertArray,
  emptyArray: assertEmptyArray,
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
  function: assertFunction,
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
  assertArrayOf,
  assertBigint,
  assertBoolean,
  assertDefined,
  assertEmptyArray,
  assertFalsy,
  assertFromPredicate,
  assertFunction,
  assertInstanceOf,
  assertKeyOf,
  assertNonEmptyArray,
  assertNonEmptyString,
  assertNotNull,
  assertNumber,
  assertObject,
  assertOneOf,
  assertString,
  assertStringLiteral,
  assertSymbol,
  assertTruthy,
}

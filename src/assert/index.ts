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
import {
  assertBigint,
  assertBoolean,
  assertInstanceOf,
  assertNonEmptyString,
  assertNumber,
  assertString,
  assertSymbol,
} from './primitives'

export const assert = {
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

import {
  assertArray,
  assertArrayOf,
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
  assertDate,
  assertNonEmptyString,
  assertNumber,
  assertString,
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
  date: assertDate,
  nonEmptyString: assertNonEmptyString,
  stringLiteral: assertStringLiteral,
  oneOf: assertOneOf,
  number: assertNumber,
  string: assertString,
  fromPredicate: assertFromPredicate,
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
  assertDate,
  assertNonEmptyString,
  assertStringLiteral,
  assertNumber,
  assertString,
  assertFromPredicate,
  assertOneOf,
}

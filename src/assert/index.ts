import { assertArray, assertNonEmptyArray, assertObject } from './collections'
import {
  assertDefined,
  assertFalsy,
  assertNotNull,
  assertTruthy,
} from './existence'
import { assertFromPredicate } from './fromPredicate'
import {
  assertBoolean,
  assertNonEmptyString,
  assertNumber,
  assertString,
} from './primitives'

export const assert = {
  array: assertArray,
  nonEmptyArray: assertNonEmptyArray,
  object: assertObject,
  falsy: assertFalsy,
  truthy: assertTruthy,
  defined: assertDefined,
  notNull: assertNotNull,
  boolean: assertBoolean,
  nonEmptyString: assertNonEmptyString,
  number: assertNumber,
  string: assertString,
  fromPredicate: assertFromPredicate,
}

export {
  assertArray,
  assertNonEmptyArray,
  assertObject,
  assertDefined,
  assertFalsy,
  assertNotNull,
  assertTruthy,
  assertBoolean,
  assertNonEmptyString,
  assertNumber,
  assertString,
  assertFromPredicate,
}

import {
  isArray,
  isArrayOf,
  isNonEmptyArray,
  isObject,
  isOneOf,
  isStringLiteral,
} from './collections'
import { isDefined, isFalsy, isNotNull, isTruthy } from './existence'
import {
  isBoolean,
  isInstanceOf,
  isNonEmptyString,
  isNumber,
  isString,
} from './primitives'

export const is = {
  defined: isDefined,
  notNull: isNotNull,
  truthy: isTruthy,
  falsy: isFalsy,
  string: isString,
  nonEmptyString: isNonEmptyString,
  number: isNumber,
  boolean: isBoolean,
  instanceOf: isInstanceOf,
  array: isArray,
  nonEmptyArray: isNonEmptyArray,
  arrayOf: isArrayOf,
  stringLiteral: isStringLiteral,
  // FIXME: remove below with v2.0.0 - wrong name, keep for now for backwards compatibility
  isStringLiteral: isStringLiteral,
  oneOf: isOneOf,
  object: isObject,
  instanceof: isInstanceOf,
} as const

export {
  isArray,
  isNonEmptyArray,
  isArrayOf,
  isObject,
  isDefined,
  isFalsy,
  isNotNull,
  isTruthy,
  isBoolean,
  isInstanceOf,
  isNonEmptyString,
  isStringLiteral,
  isNumber,
  isString,
  isOneOf,
}

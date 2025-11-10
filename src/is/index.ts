import {
  isArray,
  isNonEmptyArray,
  isObject,
  isStringLiteral,
} from './collections'
import { isDefined, isFalsy, isNotNull, isTruthy } from './existence'
import { isBoolean, isNonEmptyString, isNumber, isString } from './primitives'

export const is = {
  defined: isDefined,
  notNull: isNotNull,
  truthy: isTruthy,
  falsy: isFalsy,
  string: isString,
  nonEmptyString: isNonEmptyString,
  number: isNumber,
  boolean: isBoolean,
  array: isArray,
  nonEmptyArray: isNonEmptyArray,
  isStringLiteral: isStringLiteral,
  object: isObject,
} as const

export {
  isArray,
  isNonEmptyArray,
  isObject,
  isDefined,
  isFalsy,
  isNotNull,
  isTruthy,
  isBoolean,
  isNonEmptyString,
  isStringLiteral,
  isNumber,
  isString,
}

import {
  isArray,
  isArrayOf,
  isKeyOf,
  isNonEmptyArray,
  isObject,
  isOneOf,
  isPropertyOf,
  isStringLiteral,
} from './collections'
import { isDefined, isFalsy, isNotNull, isTruthy } from './existence'
import type { IsNamespace } from './namespace'
import {
  isBigint,
  isBoolean,
  isInstanceOf,
  isNonEmptyString,
  isNumber,
  isString,
  isSymbol,
} from './primitives'

export const is: IsNamespace = {
  defined: isDefined,
  notNull: isNotNull,
  truthy: isTruthy,
  falsy: isFalsy,
  string: isString,
  nonEmptyString: isNonEmptyString,
  number: isNumber,
  boolean: isBoolean,
  bigint: isBigint,
  symbol: isSymbol,
  instanceOf: isInstanceOf,
  array: isArray,
  nonEmptyArray: isNonEmptyArray,
  arrayOf: isArrayOf,
  stringLiteral: isStringLiteral,
  // FIXME: remove below with v2.0.0 - wrong name, keep for now for backwards compatibility
  /**
   * @deprecated Use `is.stringLiteral` instead. Will be removed in v2.0.0.
   */
  isStringLiteral: isStringLiteral,
  oneOf: isOneOf,
  object: isObject,
  instanceof: isInstanceOf,
  propertyOf: isPropertyOf,
  keyOf: isKeyOf,
}

export {
  isArray,
  isNonEmptyArray,
  isArrayOf,
  isObject,
  isDefined,
  isFalsy,
  isNotNull,
  isTruthy,
  isBigint,
  isBoolean,
  isSymbol,
  isInstanceOf,
  isNonEmptyString,
  isStringLiteral,
  isNumber,
  isString,
  isOneOf,
  isPropertyOf,
  isKeyOf,
}

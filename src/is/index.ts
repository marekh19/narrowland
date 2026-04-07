import {
  isArray,
  isArrayOf,
  isEmptyArray,
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
  isFunction,
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
  function: isFunction,
  instanceOf: isInstanceOf,
  array: isArray,
  emptyArray: isEmptyArray,
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
  isArrayOf,
  isBigint,
  isBoolean,
  isDefined,
  isEmptyArray,
  isFalsy,
  isFunction,
  isInstanceOf,
  isKeyOf,
  isNonEmptyArray,
  isNonEmptyString,
  isNotNull,
  isNumber,
  isObject,
  isOneOf,
  isPropertyOf,
  isString,
  isStringLiteral,
  isSymbol,
  isTruthy,
}

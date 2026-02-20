import type { Falsy } from '../types'

/**
 * Type guard that narrows a value to exclude null and undefined
 */
export function isDefined<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined
}

/**
 * Type guard that narrows a value to exclude null
 */
export function isNotNull<T>(value: T): value is Exclude<T, null> {
  return value !== null
}

/**
 * Type guard that narrows a value to exclude falsy values
 */
export function isTruthy<T>(value: T): value is Exclude<T, Falsy> {
  return !!value
}

/**
 * Type guard that narrows a value to only falsy values
 *
 * @deprecated Will be removed in v2.0.0. Type narrowing is incorrect for most types — `Extract<T, Falsy>` excludes valid falsy values like `''` and `0`. Use negated `isTruthy` or direct equality checks instead.
 */
export function isFalsy<T>(value: T): value is Extract<T, Falsy> {
  return !value
}

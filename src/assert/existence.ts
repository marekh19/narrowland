import { raiseAssertError } from '../errors/raise'
import type { Falsy } from '../types'

/**
 * Assertion that narrows a value to exclude null and undefined
 */
export function assertDefined<T>(
  value: T,
  message = 'Expected a defined value',
): asserts value is NonNullable<T> {
  if (value === null || value === undefined) raiseAssertError(message)
}

/**
 * Assertion that narrows a value to exclude null
 */
export function assertNotNull<T>(
  value: T,
  message = 'Expected a non-null value',
): asserts value is Exclude<T, null> {
  if (value === null) raiseAssertError(message)
}

/**
 * Assertion that narrows a value to exclude falsy values
 */
export function assertTruthy<T>(
  value: T,
  message = 'Expected a truthy value',
): asserts value is Exclude<T, Falsy> {
  if (!value) raiseAssertError(message)
}

/**
 * Assertion that narrows a value to only falsy values
 *
 * @deprecated Will be removed in v2.0.0. Type narrowing is incorrect for most types — `Extract<T, Falsy>` excludes valid falsy values like `''` and `0`. Use negated `assertTruthy` or direct equality checks instead.
 */
export function assertFalsy<T>(
  value: T,
  message = 'Expected a falsy value',
): asserts value is Extract<T, Falsy> {
  if (value) raiseAssertError(message)
}

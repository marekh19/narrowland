import { raiseAssertError } from '../errors/raise'

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
): asserts value is Exclude<T, false | 0 | '' | null | undefined> {
  if (!value) raiseAssertError(message)
}

/**
 * Assertion that narrows a value to only falsy values
 */
export function assertFalsy<T>(
  value: T,
  message = 'Expected a falsy value',
): asserts value is Extract<T, false | 0 | '' | null | undefined> {
  if (value) raiseAssertError(message)
}

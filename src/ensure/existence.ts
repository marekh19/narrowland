import { raiseEnsureError } from '../errors/raise'
import type { Falsy } from '../types'

/**
 * Ensures a value is not null or undefined and returns it
 */
export function ensureDefined<T>(
  value: T,
  message = 'Expected a defined value',
): NonNullable<T> {
  if (value === null || value === undefined) raiseEnsureError(message)
  return value
}

/**
 * Ensures a value is not null and returns it
 */
export function ensureNotNull<T>(
  value: T,
  message = 'Expected a non-null value',
): Exclude<T, null> {
  if (value === null) raiseEnsureError(message)
  return value as Exclude<T, null>
}

/**
 * Ensures a value is truthy and returns it
 */
export function ensureTruthy<T>(
  value: T,
  message = 'Expected a truthy value',
): Exclude<T, Falsy> {
  if (!value) raiseEnsureError(message)
  return value as Exclude<T, Falsy>
}

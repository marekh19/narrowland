import { raiseAssertError } from '../errors/raise'

/**
 * Assertion that narrows a value to array
 */
export function assertArray<T = unknown>(
  value: unknown,
  message = 'Expected an array',
): asserts value is T[] {
  if (!Array.isArray(value)) raiseAssertError(message)
}

/**
 * Assertion that narrows a value to non-empty array
 */
export function assertNonEmptyArray<T = unknown>(
  value: unknown,
  message = 'Expected a non-empty array',
): asserts value is [T, ...T[]] {
  if (!Array.isArray(value) || value.length === 0) raiseAssertError(message)
}

/**
 * Assertion that narrows a value to plain object
 */
export function assertObject<T extends object = object>(
  value: unknown,
  message = 'Expected an object',
): asserts value is T {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    raiseAssertError(message)
  }
}

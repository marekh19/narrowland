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
 * @deprecated Use {@link assertOneOf} instead.
 * This function will be removed in the next major release (v2.0.0).
 */
export function assertStringLiteral<const T extends readonly string[]>(
  value: unknown,
  literals: T,
  message?: string,
): asserts value is T[number] {
  if (typeof value !== 'string' || !literals.includes(value)) {
    raiseAssertError(
      message ?? `Expected one of folowing values: ${literals.join(', ')}.`,
    )
  }
}

/**
 * Assertion that narrows the given value to the union of values from the provided collection.
 */
export function assertOneOf<T, const U extends readonly T[]>(
  value: T,
  collection: U,
  message?: string,
): asserts value is U[number] {
  if (!collection.includes(value)) {
    raiseAssertError(
      message ?? `Expected one of folowing values: ${collection.join(', ')}.`,
    )
  }
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

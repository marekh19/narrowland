import { raiseEnsureError } from '../errors/raise'

/**
 * Ensures a value is an array and returns it
 */
export function ensureArray<T = unknown>(
  value: unknown,
  message = 'Expected an array',
): T[] {
  if (!Array.isArray(value)) raiseEnsureError(message)
  return value as T[]
}

/**
 * Ensures a value is an empty array and returns it
 */
export function ensureEmptyArray(
  value: unknown,
  message = 'Expected an empty array',
): [] {
  if (!Array.isArray(value) || value.length !== 0) raiseEnsureError(message)
  return value as []
}

/**
 * Ensures a value is a non-empty array and returns it
 */
export function ensureNonEmptyArray<T = unknown>(
  value: unknown,
  message = 'Expected a non-empty array',
): [T, ...T[]] {
  if (!Array.isArray(value) || value.length === 0) raiseEnsureError(message)
  return value as [T, ...T[]]
}

/**
 * Ensures a value is an array whose elements satisfy the provided guard and returns it
 */
export function ensureArrayOf<T>(
  value: unknown,
  guardFn: (item: unknown) => item is T,
  message = 'Expected an array of valid items',
): T[] {
  if (!Array.isArray(value) || !value.every((item) => guardFn(item))) {
    raiseEnsureError(message)
  }
  return value as T[]
}

/**
 * Ensures the given value is in the provided collection and returns it
 */
export function ensureOneOf<T, const U extends readonly T[]>(
  value: T,
  collection: U,
  message?: string,
): U[number] {
  if (!collection.includes(value)) {
    raiseEnsureError(
      message ?? `Expected one of following values: ${collection.join(', ')}.`,
    )
  }
  return value as U[number]
}

/**
 * Ensures a value is a plain object and returns it
 */
export function ensureObject<T extends object = object>(
  value: unknown,
  message = 'Expected an object',
): T {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    raiseEnsureError(message)
  }
  return value as T
}

/**
 * Ensures the given value is a property of provided object and returns it
 */
export function ensureKeyOf<
  T extends PropertyKey,
  const U extends Record<PropertyKey, unknown>,
>(value: T, record: U, message?: string): T & keyof U {
  if (!Object.hasOwn(record, value)) {
    raiseEnsureError(
      message ??
        `Expected one of following values: ${Object.keys(record).join(', ')}`,
    )
  }
  return value as T & keyof U
}

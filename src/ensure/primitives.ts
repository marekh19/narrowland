import { raiseEnsureError } from '../errors/raise'

/**
 * Ensures a value is a string and returns it
 */
export function ensureString(
  value: unknown,
  message = 'Expected a string',
): string {
  if (typeof value !== 'string') raiseEnsureError(message)
  return value
}

/**
 * Ensures a value is a non-empty string and returns it
 */
export function ensureNonEmptyString(
  value: unknown,
  message = 'Expected a non-empty string',
): string {
  if (typeof value !== 'string' || value.length === 0) raiseEnsureError(message)
  return value
}

/**
 * Ensures a value is a finite number and returns it
 */
export function ensureNumber(
  value: unknown,
  message = 'Expected a number',
): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    raiseEnsureError(message)
  }
  return value
}

/**
 * Ensures a value is a boolean and returns it
 */
export function ensureBoolean(
  value: unknown,
  message = 'Expected a boolean',
): boolean {
  if (typeof value !== 'boolean') raiseEnsureError(message)
  return value
}

/**
 * Ensures a value is a bigint and returns it
 */
export function ensureBigint(
  value: unknown,
  message = 'Expected a bigint',
): bigint {
  if (typeof value !== 'bigint') raiseEnsureError(message)
  return value
}

/**
 * Ensures a value is a symbol and returns it
 */
export function ensureSymbol(
  value: unknown,
  message = 'Expected a symbol',
): symbol {
  if (typeof value !== 'symbol') raiseEnsureError(message)
  return value
}

/**
 * Ensures a value is an instance of the given constructor and returns it
 */
export function ensureInstanceOf<T>(
  value: unknown,
  // biome-ignore lint/suspicious/noExplicitAny: We want any here to allow usage for any Class constructor including the built-in like ErrorConstructor
  ctor: new (...args: any[]) => T,
  message?: string,
): T {
  if (!(value instanceof ctor)) {
    raiseEnsureError(message ?? `Expected instance of ${ctor.name}`)
  }
  return value as T
}

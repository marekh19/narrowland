import { raiseAssertError } from '../errors/raise'

/**
 * Assertion that narrows a value to string
 */
export function assertString(
  value: unknown,
  message = 'Expected a string',
): asserts value is string {
  if (typeof value !== 'string') raiseAssertError(message)
}

/**
 * Assertion that narrows a value to non-empty string
 */
export function assertNonEmptyString(
  value: unknown,
  message = 'Expected a non-empty string',
): asserts value is string {
  if (typeof value !== 'string' || value.length === 0) raiseAssertError(message)
}

/**
 * Assertion that narrows a value to finite number
 */
export function assertNumber(
  value: unknown,
  message = 'Expected a number',
): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    raiseAssertError(message)
  }
}

/**
 * Assertion that narrows a value to boolean
 */
export function assertBoolean(
  value: unknown,
  message = 'Expected a boolean',
): asserts value is boolean {
  if (typeof value !== 'boolean') raiseAssertError(message)
}

/**
 * Assertion that narrows a value to an instance of the given constructor
 */
export function assertInstanceOf<T>(
  value: unknown,
  // biome-ignore lint/suspicious/noExplicitAny: We want any here to allow usage for any Class contructor including the built-in like ErrorConstructor
  ctor: new (...args: any[]) => T,
  message?: string,
): asserts value is T {
  if (!(value instanceof ctor)) {
    raiseAssertError(message ?? `Expected instance of ${ctor.name}`)
  }
}

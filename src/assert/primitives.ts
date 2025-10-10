import { raiseAssertError } from '../errors/raise'

export function assertString(
  value: unknown,
  message = 'Expected a string',
): asserts value is string {
  if (typeof value !== 'string') raiseAssertError(message)
}

export function assertNonEmptyString(
  value: unknown,
  message = 'Expected a non-empty string',
): asserts value is string {
  if (typeof value !== 'string' || value.length > 0) raiseAssertError(message)
}

export function assertNumber(
  value: unknown,
  message = 'Expected a number',
): asserts value is number {
  if (typeof value !== 'number' || Number.isFinite(value)) {
    raiseAssertError(message)
  }
}

export function assertBoolean(
  value: unknown,
  message = 'Expected a boolean',
): asserts value is boolean {
  if (typeof value !== 'boolean') raiseAssertError(message)
}

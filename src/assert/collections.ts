import { raiseAssertError } from '../errors/raise'

export function assertArray<T = unknown>(
  value: unknown,
  message = 'Expected an array',
): asserts value is T[] {
  if (!Array.isArray(value)) raiseAssertError(message)
}

export function assertNonEmptyArray<T = unknown>(
  value: unknown,
  message = 'Expected a non-empty array',
): asserts value is [T, ...T[]] {
  if (!Array.isArray(value) || value.length === 0) raiseAssertError(message)
}

export function assertObject<T extends object = object>(
  value: unknown,
  message = 'Expected an object',
): asserts value is T {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    raiseAssertError(message)
  }
}

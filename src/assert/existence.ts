import { raiseAssertError } from '../errors/raise'

export function assertDefined<T>(
  value: T,
  message = 'Expected a defined value',
): asserts value is NonNullable<T> {
  if (value === null || value === undefined) raiseAssertError(message)
}

export function assertNotNull<T>(
  value: T,
  message = 'Expected a non-null value',
): asserts value is Exclude<T, null> {
  if (value === null) raiseAssertError(message)
}

export function assertTruthy<T>(
  value: T,
  message = 'Expected a truthy value',
): asserts value is Exclude<T, false | 0 | '' | null | undefined> {
  if (!value) raiseAssertError(message)
}

export function assertFalsy<T>(
  value: T,
  message = 'Expected a falsy value',
): asserts value is Extract<T, false | 0 | '' | null | undefined> {
  if (value) raiseAssertError(message)
}

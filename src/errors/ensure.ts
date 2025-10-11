import { raiseEnsureError } from '../errors/raise'

/**
 * Returns value or throws if null or undefined
 */
export function ensure<T>(
  value: T,
  message = 'Expected a defined (non-nullish) value',
): NonNullable<T> {
  if (value === null || value === undefined) {
    raiseEnsureError(message)
  }
  return value as NonNullable<T>
}

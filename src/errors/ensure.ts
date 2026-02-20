import { raiseEnsureError } from '../errors/raise'

/**
 * Returns value or throws if null or undefined
 *
 * @deprecated Use `ensureDefined` instead.
 * In v2.0.0, the `ensure` export will become a namespace object (like `is` and `assert`).
 * Migration: `ensure(value, message?)` → `ensureDefined(value, message?)`
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

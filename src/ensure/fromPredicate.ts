import { raiseEnsureError } from '../errors/raise'

type Predicate<T> = (value: unknown) => value is T

/**
 * Creates an ensure function from a type guard predicate
 */
export function ensureFromPredicate<T>(
  predicate: Predicate<T>,
  defaultMessage = 'Assertion failed',
) {
  return (value: unknown, message = defaultMessage): T => {
    if (!predicate(value)) raiseEnsureError(message)
    return value as T
  }
}

import { raiseAssertError } from '../errors/raise'

type Predicate<T> = (value: unknown) => value is T

/**
 * Creates an assertion function from a type guard predicate
 */
export function assertFromPredicate<T>(
  predicate: Predicate<T>,
  defaultMessage = 'Assertion failed',
) {
  return (value: unknown, message = defaultMessage): asserts value is T => {
    if (!predicate(value)) raiseAssertError(message)
  }
}

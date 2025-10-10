import { raiseAssertError } from '../errors/raise'

type Predicate<T> = (value: unknown) => value is T

export function assertFromPredicate<T>(
  predicate: Predicate<T>,
  defaultMessage = 'Assertion failed',
) {
  return (value: unknown, message = defaultMessage): asserts value is T => {
    if (!predicate(value)) raiseAssertError(message)
  }
}

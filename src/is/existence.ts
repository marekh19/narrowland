/**
 * Type guard that narrows a value to exclude null and undefined
 */
export function isDefined<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined
}

/**
 * Type guard that narrows a value to exclude null
 */
export function isNotNull<T>(value: T): value is Exclude<T, null> {
  return value !== null
}

/**
 * Type guard that narrows a value to exclude falsy values
 */
export function isTruthy<T>(
  value: T,
): value is Exclude<T, false | 0 | '' | null | undefined> {
  return !!value
}

/**
 * Type guard that narrows a value to only falsy values
 */
export function isFalsy<T>(
  value: T,
): value is Extract<T, false | 0 | '' | null | undefined> {
  return !value
}

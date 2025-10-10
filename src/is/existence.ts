export function isDefined<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined
}

export function isNotNull<T>(value: T): value is Exclude<T, null> {
  return value !== null
}

export function isTruthy<T>(
  value: T,
): value is Exclude<T, false | 0 | '' | null | undefined> {
  return !!value
}

export function isFalsy<T>(
  value: T,
): value is Extract<T, false | 0 | '' | null | undefined> {
  return !value
}

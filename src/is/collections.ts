/**
 * Type guard that narrows a value to array
 */
export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value)
}

/**
 * Type guard that narrows a value to non-empty array
 */
export function isNonEmptyArray<T = unknown>(
  value: unknown,
): value is [T, ...T[]] {
  return Array.isArray(value) && value.length > 0
}

/**
 * @deprecated Use {@link isOneOf} instead.
 * This function will be removed in the next major release (v2.0.0).
 */
export function isStringLiteral<const T extends readonly string[]>(
  value: unknown,
  literals: T,
): value is T[number] {
  return typeof value === 'string' && literals.includes(value)
}

/**
 * Type guard that narrows the given value to the union of values from the provided collection.
 */
export function isOneOf<T, const U extends readonly T[]>(
  value: T,
  collection: U,
): value is U[number] {
  return collection.includes(value as U[number])
}

/**
 * Type guard that narrows a value to plain object
 */
export function isObject<T extends object = object>(
  value: unknown,
): value is T {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

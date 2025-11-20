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
 * Type guard that narrows a value to an array whose elements satisfy the provided guard.
 */
export function isArrayOf<T>(
  value: unknown,
  guardFn: (item: unknown) => item is T,
): value is T[] {
  return Array.isArray(value) && value.every((item) => guardFn(item))
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

/**
 * Narrows property K of type T to type U, making it required.
 * Preserves all other properties from T.
 */
type PropNarrow<T, K extends PropertyKey, U> = T & {
  [P in K]: U
}

/**
 * Type guard that narrows the given property of object to the provided type predicate.
 */
export function isPropertyOf<K extends PropertyKey, U>(
  key: K,
  predicate: (value: unknown) => value is U,
) {
  return <T extends Partial<Record<K, unknown>>>(
    obj: T,
  ): obj is PropNarrow<T, K, U> => predicate(obj[key])
}

/**
 * Type guard that narrows the given value to be a property of provided object.
 */
export function isKeyOf<
  T extends PropertyKey,
  const U extends Record<PropertyKey, unknown>,
>(value: T, record: U): value is T & keyof U {
  return Object.hasOwn(record, value)
}

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
 * Type guard that narrows a value to literal type
 */
export function isLiteral<T, const U extends readonly T[]>(
  value: T,
  literals: U,
): value is U[number] {
  return literals.includes(value as U[number])
}

/**
 * Type guard that narrows a value to string literal
 */
export function isStringLiteral<const T extends readonly string[]>(
  value: unknown,
  literals: T,
): value is T[number] {
  return typeof value === 'string' && isLiteral(value, literals)
}

/**
 * Type guard that narrows a value to plain object
 */
export function isObject<T extends object = object>(
  value: unknown,
): value is T {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

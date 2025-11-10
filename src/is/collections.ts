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
 * Type guard that narrows a value to string literal
 */
export function isStringLiteral<const T extends readonly string[]>(
  value: unknown,
  literals: T,
): value is T[number] {
  return typeof value === 'string' && literals.includes(value)
}

/**
 * Type guard that narrows a value to plain object
 */
export function isObject<T extends object = object>(
  value: unknown,
): value is T {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

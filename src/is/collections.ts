export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value)
}

export function isNonEmptyArray<T = unknown>(
  value: unknown,
): value is [T, ...T[]] {
  return Array.isArray(value) && value.length > 0
}

export function isObject<T extends object = object>(
  value: unknown,
): value is T {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

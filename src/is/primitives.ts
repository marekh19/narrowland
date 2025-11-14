/**
 * Type guard that narrows a value to string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Type guard that narrows a value to non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

/**
 * Type guard that narrows a value to finite number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

/**
 * Type guard that narrows a value to boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/**
 * Type guard that narrows a value to bigint
 */
export function isBigint(value: unknown): value is bigint {
  return typeof value === 'bigint'
}

/**
 * Type guard that narrows a value to symbol
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol'
}

/**
 * Type guard that narrows a value to an instance of the given constructor
 */
export function isInstanceOf<T>(
  value: unknown,
  // biome-ignore lint/suspicious/noExplicitAny: We want any here to allow usage for any Class contructor including the built-in like ErrorConstructor
  ctor: new (...args: any[]) => T,
): value is T {
  return value instanceof ctor
}

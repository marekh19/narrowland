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
 * Type guard that narrows a value to Date
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date
}

/**
 * Type guard that narrows a value to bigint
 */
export function isBigint(value: unknown): value is bigint {
  return typeof value === 'bigint'
}

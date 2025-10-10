export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

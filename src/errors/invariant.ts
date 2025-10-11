const PREFIX = 'Invariant failed'

/**
 * Throws if condition is falsy, does nothing if truthy
 */
export function invariant(
  condition: unknown,
  message?: string | (() => string),
): asserts condition {
  if (condition) return

  const provided: string | undefined =
    typeof message === 'function' ? message() : message

  const value: string = provided ? `${PREFIX}: ${provided}` : PREFIX
  throw new Error(value)
}

const IS_PROD = process.env.NODE_ENV === 'production'
const PREFIX = 'Invariant failed'

/**
 * Asserts that a condition is truthy, throwing an error if it's not.
 * 
 * This function is useful for runtime type narrowing and debugging. When the condition
 * is falsy, it throws an Error with a customizable message. In production builds,
 * only a generic error message is thrown to avoid exposing sensitive information.
 * 
 * @param condition - The condition to check. If falsy, an error will be thrown.
 * @param message - Optional error message. Can be a string or a function that returns a string.
 *                  The function is only called if the condition is falsy, allowing for
 *                  lazy evaluation of expensive message generation.
 * 
 * @throws {Error} When the condition is falsy
 * 
 * @example
 * ```typescript
 * // Basic usage
 * invariant(value !== null, 'Value should not be null')
 * 
 * // With lazy message evaluation
 * invariant(isValid, () => `Validation failed: ${getDetailedError()}`)
 * 
 * // Type narrowing
 * const value: string | null = getValue()
 * invariant(value !== null)
 * // value is now narrowed to string
 * console.log(value.length) // TypeScript knows this is safe
 * ```
 */
export function invariant(
  condition: unknown,
  message?: string | (() => string),
): asserts condition {
  if (condition) return

  if (IS_PROD) throw new Error(PREFIX)

  const provided: string | undefined =
    typeof message === 'function' ? message() : message

  const value: string = provided ? `${PREFIX}: ${provided}` : PREFIX
  throw new Error(value)
}

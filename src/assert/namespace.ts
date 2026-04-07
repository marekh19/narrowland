import type { Falsy } from '../types'

/**
 * Explicit type annotation for the `assert` namespace object.
 *
 * TypeScript requires every name in the call target of an assertion function
 * to have an explicit type annotation. Without this interface, calls like
 * `assert.string(value)` fail with:
 *   "Assertions require every name in the call target to be declared with
 *    an explicit type annotation."
 *
 * See: https://github.com/microsoft/TypeScript/issues/36931
 */
export interface AssertNamespace {
  // primitives
  string: (value: unknown, message?: string) => asserts value is string
  nonEmptyString: (value: unknown, message?: string) => asserts value is string
  number: (value: unknown, message?: string) => asserts value is number
  boolean: (value: unknown, message?: string) => asserts value is boolean
  bigint: (value: unknown, message?: string) => asserts value is bigint
  symbol: (value: unknown, message?: string) => asserts value is symbol
  function: (
    value: unknown,
    message?: string,
  ) => asserts value is (...args: unknown[]) => unknown
  instanceOf: <T>(
    value: unknown,
    // biome-ignore lint/suspicious/noExplicitAny: We want any here to allow usage for any Class constructor including the built-in like ErrorConstructor
    ctor: new (...args: any[]) => T,
    message?: string,
  ) => asserts value is T

  // existence
  defined: <T>(value: T, message?: string) => asserts value is NonNullable<T>
  notNull: <T>(value: T, message?: string) => asserts value is Exclude<T, null>
  truthy: <T>(value: T, message?: string) => asserts value is Exclude<T, Falsy>
  /**
   * @deprecated Will be removed in v2.0.0.
   */
  falsy: <T>(value: T, message?: string) => asserts value is Extract<T, Falsy>

  // collections
  array: <T = unknown>(value: unknown, message?: string) => asserts value is T[]
  emptyArray: (value: unknown, message?: string) => asserts value is []
  nonEmptyArray: <T = unknown>(
    value: unknown,
    message?: string,
  ) => asserts value is [T, ...T[]]
  arrayOf: <T>(
    value: unknown,
    guardFn: (item: unknown) => item is T,
    message?: string,
  ) => asserts value is T[]
  object: <T extends object = object>(
    value: unknown,
    message?: string,
  ) => asserts value is T
  oneOf: <T, const U extends readonly T[]>(
    value: T,
    collection: U,
    message?: string,
  ) => asserts value is U[number]
  keyOf: <T extends PropertyKey, const U extends Record<PropertyKey, unknown>>(
    value: T,
    record: U,
    message?: string,
  ) => asserts value is T & keyof U
  /**
   * @deprecated Use {@link assertStringLiteral} instead. Will be removed in v2.0.0.
   */
  stringLiteral: <const T extends readonly string[]>(
    value: unknown,
    literals: T,
    message?: string,
  ) => asserts value is T[number]

  // fromPredicate
  fromPredicate: <T>(
    predicate: (value: unknown) => value is T,
    defaultMessage?: string,
  ) => (value: unknown, message?: string) => asserts value is T

  // FIXME: remove below with v2.0.0 - wrong name, keep for now for backwards compatibility
  /**
   * @deprecated Use `keyOf` instead.
   */
  keyof: <T extends PropertyKey, const U extends Record<PropertyKey, unknown>>(
    value: T,
    record: U,
    message?: string,
  ) => asserts value is T & keyof U
}

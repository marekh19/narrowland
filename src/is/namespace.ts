import type { Falsy } from '../types'

/**
 * Explicit type annotation for the `is` namespace object.
 *
 * Unlike `assert`, type guards (`value is T`) work fine through inferred objects.
 * This interface exists purely for consistency with `AssertNamespace` and `EnsureNamespace`.
 */

type PropNarrow<T, K extends PropertyKey, U> = T & {
  [P in K]: U
}

export interface IsNamespace {
  // primitives
  string: (value: unknown) => value is string
  nonEmptyString: (value: unknown) => value is string
  number: (value: unknown) => value is number
  boolean: (value: unknown) => value is boolean
  bigint: (value: unknown) => value is bigint
  symbol: (value: unknown) => value is symbol
  function: (value: unknown) => value is (...args: unknown[]) => unknown
  instanceOf: <T>(
    value: unknown,
    // biome-ignore lint/suspicious/noExplicitAny: We want any here to allow usage for any Class constructor including the built-in like ErrorConstructor
    ctor: new (...args: any[]) => T,
  ) => value is T

  // existence
  defined: <T>(value: T) => value is NonNullable<T>
  notNull: <T>(value: T) => value is Exclude<T, null>
  truthy: <T>(value: T) => value is Exclude<T, Falsy>
  /**
   * @deprecated Will be removed in v2.0.0.
   */
  falsy: <T>(value: T) => value is Extract<T, Falsy>

  // collections
  array: <T = unknown>(value: unknown) => value is T[]
  emptyArray: (value: unknown) => value is []
  nonEmptyArray: <T = unknown>(value: unknown) => value is [T, ...T[]]
  arrayOf: <T>(
    value: unknown,
    guardFn: (item: unknown) => item is T,
  ) => value is T[]
  object: <T extends object = object>(value: unknown) => value is T
  oneOf: <T, const U extends readonly T[]>(
    value: T,
    collection: U,
  ) => value is U[number]
  keyOf: <T extends PropertyKey, const U extends Record<PropertyKey, unknown>>(
    value: T,
    record: U,
  ) => value is T & keyof U
  /**
   * @deprecated Use {@link isOneOf} instead. Will be removed in v2.0.0.
   */
  stringLiteral: <const T extends readonly string[]>(
    value: unknown,
    literals: T,
  ) => value is T[number]
  propertyOf: <K extends PropertyKey, U>(
    key: K,
    predicate: (value: unknown) => value is U,
  ) => <T extends Partial<Record<K, unknown>>>(
    obj: T,
  ) => obj is PropNarrow<T, K, U>

  // FIXME: remove below with v2.0.0 - wrong names, keep for now for backwards compatibility
  /**
   * @deprecated Use `is.stringLiteral` instead. Will be removed in v2.0.0.
   */
  isStringLiteral: <const T extends readonly string[]>(
    value: unknown,
    literals: T,
  ) => value is T[number]
  /**
   * @deprecated Use `is.instanceOf` instead. Will be removed in v2.0.0.
   */
  instanceof: <T>(
    value: unknown,
    // biome-ignore lint/suspicious/noExplicitAny: We want any here to allow usage for any Class constructor including the built-in like ErrorConstructor
    ctor: new (...args: any[]) => T,
  ) => value is T
}

import type { Falsy } from '../types'

/**
 * v2.0.0 migration: This interface exists to deprecate the `ensure()` call signature
 * while keeping `ensure.xxx()` property access clean.
 *
 * When releasing v2.0.0:
 * 1. Remove this file
 * 2. Remove the deprecated `ensure` function from `src/errors/ensure.ts`
 * 3. Add the `ensure` namespace object directly in `src/ensure/index.ts` (like `is` and `assert`)
 * 4. Re-export `ensure` from `./ensure` in `src/index.ts`
 */
export interface EnsureNamespace {
  /**
   * @deprecated Use `ensureDefined` instead.
   * In v2.0.0, `ensure` will no longer be callable — it will become a namespace object
   * (like `is` and `assert`).
   *
   * Migration: `ensure(value, message?)` → `ensureDefined(value, message?)`
   */
  <T>(value: T, message?: string): NonNullable<T>

  // primitives
  string: (value: unknown, message?: string) => string
  nonEmptyString: (value: unknown, message?: string) => string
  number: (value: unknown, message?: string) => number
  boolean: (value: unknown, message?: string) => boolean
  bigint: (value: unknown, message?: string) => bigint
  symbol: (value: unknown, message?: string) => symbol
  function: (
    value: unknown,
    message?: string,
  ) => (...args: unknown[]) => unknown
  instanceOf: <T>(
    value: unknown,
    // biome-ignore lint/suspicious/noExplicitAny: We want any here to allow usage for any Class constructor including the built-in like ErrorConstructor
    ctor: new (...args: any[]) => T,
    message?: string,
  ) => T

  // existence
  defined: <T>(value: T, message?: string) => NonNullable<T>
  notNull: <T>(value: T, message?: string) => Exclude<T, null>
  truthy: <T>(value: T, message?: string) => Exclude<T, Falsy>

  // collections
  array: <T = unknown>(value: unknown, message?: string) => T[]
  emptyArray: (value: unknown, message?: string) => []
  nonEmptyArray: <T = unknown>(value: unknown, message?: string) => [T, ...T[]]
  arrayOf: <T>(
    value: unknown,
    guardFn: (item: unknown) => item is T,
    message?: string,
  ) => T[]
  object: <T extends object = object>(value: unknown, message?: string) => T
  oneOf: <T, const U extends readonly T[]>(
    value: T,
    collection: U,
    message?: string,
  ) => U[number]
  keyOf: <T extends PropertyKey, const U extends Record<PropertyKey, unknown>>(
    value: T,
    record: U,
    message?: string,
  ) => T & keyof U

  // fromPredicate
  fromPredicate: <T>(
    predicate: (value: unknown) => value is T,
    defaultMessage?: string,
  ) => (value: unknown, message?: string) => T
}

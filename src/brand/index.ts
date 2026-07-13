import { raiseBrandError } from '../errors/raise'

declare const __brand: unique symbol
declare const __base: unique symbol

/**
 * Attaches a nominal tag to `T` so structurally-identical values (two `string`s,
 * two `number`s) can't be used interchangeably. The base type is also recorded
 * (under a phantom key) so `Unbrand` can recover it.
 *
 * @example
 * type Email = Brand<string, 'Email'>
 * type Cents = Brand<number, 'Cents'>
 */
export type Brand<T, B extends string> = T & {
  readonly [__brand]: B
  readonly [__base]: T
}

/**
 * Recovers the underlying base type of a branded type — `Unbrand<Email>` is
 * `string`. Returns `T` unchanged when it isn't branded.
 */
export type Unbrand<T> = T extends { readonly [__base]: infer U } ? U : T

/**
 * Casts a trusted, already-valid value to its branded type. Performs no runtime
 * check — use when the value is known valid (e.g. read from your own DB).
 *
 * @example
 * const id = brand<UserId>(row.id)
 */
export function brand<T extends Brand<unknown, string>>(value: Unbrand<T>): T {
  // The library's only unsafe cast, quarantined here: a nominal tag has no
  // runtime representation, so there is no non-assertion way to attach it.
  return value as T
}

/**
 * Builds a reusable constructor for a branded type that validates before
 * branding, throwing `BrandError` on failure. Existing type guards (e.g.
 * `isNonEmptyString`) can be passed directly as the validator.
 *
 * @example
 * type Email = Brand<string, 'Email'>
 * const toEmail = createBrand<Email>((v) => v.includes('@'))
 * const email = toEmail(userInput) // throws BrandError if invalid
 */
export function createBrand<T extends Brand<unknown, string>>(
  validate: (value: Unbrand<T>) => boolean,
  defaultMessage = 'Invalid branded value',
): (value: Unbrand<T>, message?: string) => T {
  return (value, message = defaultMessage) => {
    if (!validate(value)) raiseBrandError(message)
    // See `brand` above — same unavoidable, encapsulated cast.
    return value as T
  }
}

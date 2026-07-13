import { describe, expect, expectTypeOf, test } from 'vitest'

import { isNonEmptyString } from '../is'
import { type Brand, brand, createBrand, type Unbrand } from './index'

type Email = Brand<string, 'Email'>
type UserId = Brand<string, 'UserId'>
type Cents = Brand<number, 'Cents'>

describe('brand', () => {
  describe('brand', () => {
    test('should return the value unchanged at runtime', () => {
      expect(brand<Email>('a@b.com')).toBe('a@b.com')
      expect(brand<Cents>(199)).toBe(199)
    })

    test('should produce the branded type', () => {
      const email = brand<Email>('a@b.com')
      expectTypeOf(email).toEqualTypeOf<Email>()
    })

    test('branded value should be assignable to its base type', () => {
      const email = brand<Email>('a@b.com')
      const asString: string = email
      expect(asString.toUpperCase()).toBe('A@B.COM')
    })

    test('should keep distinct brands incompatible', () => {
      const email = brand<Email>('a@b.com')
      const id = brand<UserId>('usr_1')
      // @ts-expect-error two brands over the same base are not interchangeable
      const wrong: Email = id
      expect(wrong).toBe('usr_1')
      expectTypeOf(email).not.toEqualTypeOf<UserId>()
    })

    test('should reject a value of the wrong base type', () => {
      // @ts-expect-error Email is branded string, not number
      brand<Email>(123)
    })
  })

  describe('createBrand', () => {
    test('should validate then brand', () => {
      const toEmail = createBrand<Email>((v) => v.includes('@'))
      const email = toEmail('a@b.com')

      expect(email).toBe('a@b.com')
      expectTypeOf(email).toEqualTypeOf<Email>()
    })

    test('should throw BrandError on invalid input', () => {
      const toEmail = createBrand<Email>((v) => v.includes('@'))

      expect(() => toEmail('nope')).toThrow('Invalid branded value')
      try {
        toEmail('nope')
      } catch (e) {
        expect((e as Error).name).toBe('BrandError')
      }
    })

    test('should use a custom default message', () => {
      const toEmail = createBrand<Email>((v) => v.includes('@'), 'Bad email')
      expect(() => toEmail('nope')).toThrow('Bad email')
    })

    test('should allow overriding the message per call', () => {
      const toEmail = createBrand<Email>((v) => v.includes('@'), 'Bad email')
      expect(() => toEmail('nope', 'Not an email')).toThrow('Not an email')
    })

    test('should accept an existing type guard as the validator', () => {
      const toUserId = createBrand<UserId>(isNonEmptyString)

      expect(toUserId('usr_1')).toBe('usr_1')
      expect(() => toUserId('')).toThrow('Invalid branded value')
    })

    test('should work with a numeric brand', () => {
      const toCents = createBrand<Cents>((v) => Number.isInteger(v) && v >= 0)
      const price = toCents(199)

      expect(price).toBe(199)
      expectTypeOf(price).toEqualTypeOf<Cents>()
      expect(() => toCents(-1)).toThrow('Invalid branded value')
    })

    test('should type the validator argument as the base type', () => {
      createBrand<Cents>((v) => {
        expectTypeOf(v).toEqualTypeOf<number>()
        return v >= 0
      })
    })
  })

  describe('Unbrand', () => {
    test('should recover the base type of a brand', () => {
      expectTypeOf<Unbrand<Email>>().toEqualTypeOf<string>()
      expectTypeOf<Unbrand<Cents>>().toEqualTypeOf<number>()
    })

    test('should pass through a non-branded type', () => {
      expectTypeOf<Unbrand<string>>().toEqualTypeOf<string>()
    })
  })
})

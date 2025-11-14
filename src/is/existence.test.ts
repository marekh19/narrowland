import { describe, expect, expectTypeOf, test } from 'vitest'

import { isDefined, isFalsy, isNotNull, isTruthy } from './existence'

describe('is/existence', () => {
  describe('isDefined', () => {
    test('should return true for defined values', () => {
      expect(isDefined('hello')).toBe(true)
      expect(isDefined(42)).toBe(true)
      expect(isDefined(true)).toBe(true)
      expect(isDefined({})).toBe(true)
      expect(isDefined([])).toBe(true)
    })

    test('should return false for null and undefined', () => {
      expect(isDefined(null)).toBe(false)
      expect(isDefined(undefined)).toBe(false)
    })

    test('should narrow type correctly', () => {
      const value: string | null | undefined = 'hello'

      if (isDefined(value)) {
        expectTypeOf(value).toEqualTypeOf<string>()
        expect(value.length).toBe(5)
      }
    })

    test('should work as a predicate to filter an array and narrow type correctly', () => {
      const values: (string | number | { foo: string } | undefined | null)[] = [
        1,
        undefined,
        'hello',
        null,
        { foo: 'bar' },
      ]
      const filtered = values.filter(isDefined)

      expect(filtered).toEqual([1, 'hello', { foo: 'bar' }])
      expect(filtered).toHaveLength(3)
      expectTypeOf(filtered).toEqualTypeOf<
        (string | number | { foo: string })[]
      >()
    })
  })

  describe('isNotNull', () => {
    test('should return true for non-null values', () => {
      expect(isNotNull('hello')).toBe(true)
      expect(isNotNull(42)).toBe(true)
      expect(isNotNull(undefined)).toBe(true) // undefined is not null
    })

    test('should return false for null', () => {
      expect(isNotNull(null)).toBe(false)
    })

    test('should narrow type correctly', () => {
      const value: string | null = 'hello'

      if (isNotNull(value)) {
        expectTypeOf(value).toEqualTypeOf<string>()
        expect(value.length).toBe(5)
      }
    })
  })

  describe('isTruthy', () => {
    test('should return true for truthy values', () => {
      expect(isTruthy('hello')).toBe(true)
      expect(isTruthy(42)).toBe(true)
      expect(isTruthy(true)).toBe(true)
      expect(isTruthy({})).toBe(true)
      expect(isTruthy([])).toBe(true)
    })

    test('should return false for falsy values', () => {
      expect(isTruthy(false)).toBe(false)
      expect(isTruthy(0)).toBe(false)
      expect(isTruthy('')).toBe(false)
      expect(isTruthy(null)).toBe(false)
      expect(isTruthy(undefined)).toBe(false)
      expect(isTruthy(NaN)).toBe(false)
    })

    test('should narrow type correctly', () => {
      const value: string | null | undefined = 'hello'

      if (isTruthy(value)) {
        expectTypeOf(value).toEqualTypeOf<string>()
        expect(value.length).toBe(5)
      }
    })
  })

  describe('isFalsy', () => {
    test('should return true for falsy values', () => {
      expect(isFalsy(false)).toBe(true)
      expect(isFalsy(0)).toBe(true)
      expect(isFalsy('')).toBe(true)
      expect(isFalsy(null)).toBe(true)
      expect(isFalsy(undefined)).toBe(true)
      expect(isFalsy(NaN)).toBe(true)
    })

    test('should return false for truthy values', () => {
      expect(isFalsy('hello')).toBe(false)
      expect(isFalsy(42)).toBe(false)
      expect(isFalsy(true)).toBe(false)
      expect(isFalsy({})).toBe(false)
      expect(isFalsy([])).toBe(false)
    })

    // No type expectTypeOf check - TS can't properly define a Falsy type
  })
})

import { expectTypeOf } from 'expect-type'
import { describe, expect, test } from 'vitest'

import { isBoolean, isNonEmptyString, isNumber, isString } from './primitives'

describe('primitives', () => {
  describe('isString', () => {
    test('should return true for strings', () => {
      expect(isString('hello')).toBe(true)
      expect(isString('')).toBe(true)
      expect(isString('123')).toBe(true)
    })

    test('should return false for non-strings', () => {
      expect(isString(123)).toBe(false)
      expect(isString(true)).toBe(false)
      expect(isString(null)).toBe(false)
      expect(isString(undefined)).toBe(false)
      expect(isString({})).toBe(false)
    })

    test('should narrow type correctly', () => {
      const value: unknown = 'hello'

      if (isString(value)) {
        expectTypeOf(value).toEqualTypeOf<string>()
        expect(value.length).toBe(5)
      }
    })
  })

  describe('isNonEmptyString', () => {
    test('should return true for non-empty strings', () => {
      expect(isNonEmptyString('hello')).toBe(true)
      expect(isNonEmptyString('123')).toBe(true)
      expect(isNonEmptyString('a')).toBe(true)
    })

    test('should return false for empty strings and non-strings', () => {
      expect(isNonEmptyString('')).toBe(false)
      expect(isNonEmptyString(123)).toBe(false)
      expect(isNonEmptyString(null)).toBe(false)
    })

    test('should narrow type correctly', () => {
      const value: unknown = 'hello'

      if (isNonEmptyString(value)) {
        expectTypeOf(value).toEqualTypeOf<string>()
        expect(value.length).toBeGreaterThan(0)
      }
    })
  })

  describe('isNumber', () => {
    test('should return true for finite numbers', () => {
      expect(isNumber(42)).toBe(true)
      expect(isNumber(0)).toBe(true)
      expect(isNumber(-1)).toBe(true)
      expect(isNumber(3.14)).toBe(true)
    })

    test('should return false for non-finite numbers and non-numbers', () => {
      expect(isNumber(NaN)).toBe(false)
      expect(isNumber(Infinity)).toBe(false)
      expect(isNumber('123')).toBe(false)
      expect(isNumber(true)).toBe(false)
      expect(isNumber(null)).toBe(false)
    })

    test('should narrow type correctly', () => {
      const value: unknown = 42

      if (isNumber(value)) {
        expectTypeOf(value).toEqualTypeOf<number>()
        expect(value + 1).toBe(43)
      }
    })
  })

  describe('isBoolean', () => {
    test('should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true)
      expect(isBoolean(false)).toBe(true)
    })

    test('should return false for non-booleans', () => {
      expect(isBoolean(0)).toBe(false)
      expect(isBoolean(1)).toBe(false)
      expect(isBoolean('true')).toBe(false)
      expect(isBoolean(null)).toBe(false)
    })

    test('should narrow type correctly', () => {
      const value: unknown = true

      if (isBoolean(value)) {
        expectTypeOf(value).toEqualTypeOf<boolean>()
        expect(value).toBe(true)
      }
    })
  })
})
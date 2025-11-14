import { describe, expect, expectTypeOf, test } from 'vitest'

import {
  isBigint,
  isBoolean,
  isDate,
  isNonEmptyString,
  isNumber,
  isString,
  isSymbol,
} from './primitives'

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

  describe('isDate', () => {
    test('should return true for Date objects', () => {
      expect(isDate(new Date())).toBe(true)
      expect(isDate(new Date('2023-01-01'))).toBe(true)
      expect(isDate(new Date(0))).toBe(true)
      // Invalid Date is still a Date object
      expect(isDate(new Date('invalid'))).toBe(true)
    })

    test('should return false for non-Date values', () => {
      expect(isDate('2023-01-01')).toBe(false)
      expect(isDate(1234567890)).toBe(false)
      expect(isDate({})).toBe(false)
      expect(isDate(null)).toBe(false)
      expect(isDate(undefined)).toBe(false)
      expect(isDate('')).toBe(false)
    })

    test('should narrow type correctly', () => {
      const value: unknown = new Date()

      if (isDate(value)) {
        expectTypeOf(value).toEqualTypeOf<Date>()
        expect(value.getTime()).toBeTypeOf('number')
      }
    })
  })

  describe('isBigint', () => {
    test('should return true for bigint values', () => {
      expect(isBigint(BigInt(0))).toBe(true)
      expect(isBigint(BigInt(42))).toBe(true)
      expect(isBigint(BigInt(-1))).toBe(true)
      expect(isBigint(BigInt('9007199254740991'))).toBe(true)
      expect(isBigint(0n)).toBe(true)
      expect(isBigint(42n)).toBe(true)
    })

    test('should return false for non-bigint values', () => {
      expect(isBigint(0)).toBe(false)
      expect(isBigint(42)).toBe(false)
      expect(isBigint('42')).toBe(false)
      expect(isBigint(true)).toBe(false)
      expect(isBigint(null)).toBe(false)
      expect(isBigint(undefined)).toBe(false)
      expect(isBigint({})).toBe(false)
    })

    test('should narrow type correctly', () => {
      const value: unknown = BigInt(42)

      if (isBigint(value)) {
        expectTypeOf(value).toEqualTypeOf<bigint>()
        expect(value.toString()).toBe('42')
      }
    })
  })

  describe('isSymbol', () => {
    test('should return true for symbol values', () => {
      expect(isSymbol(Symbol())).toBe(true)
      expect(isSymbol(Symbol('test'))).toBe(true)
      expect(isSymbol(Symbol.for('key'))).toBe(true)
    })

    test('should return false for non-symbol values', () => {
      expect(isSymbol('symbol')).toBe(false)
      expect(isSymbol(42)).toBe(false)
      expect(isSymbol(true)).toBe(false)
      expect(isSymbol(null)).toBe(false)
      expect(isSymbol(undefined)).toBe(false)
      expect(isSymbol({})).toBe(false)
    })

    test('should narrow type correctly', () => {
      const value: unknown = Symbol('test')

      if (isSymbol(value)) {
        expectTypeOf(value).toEqualTypeOf<symbol>()
        expect(value.toString()).toContain('Symbol')
      }
    })
  })
})

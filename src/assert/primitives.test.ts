import { describe, expect, expectTypeOf, test } from 'vitest'

import {
  assertBoolean,
  assertNonEmptyString,
  assertNumber,
  assertString,
} from './primitives'

describe('assert/primitives', () => {
  describe('assertString', () => {
    test('should not throw for strings', () => {
      expect(() => assertString('hello')).not.toThrow()
      expect(() => assertString('')).not.toThrow()
      expect(() => assertString('123')).not.toThrow()
    })

    test('should throw for non-strings', () => {
      expect(() => assertString(123)).toThrow('Expected a string')
      expect(() => assertString(true)).toThrow('Expected a string')
      expect(() => assertString(null)).toThrow('Expected a string')
      expect(() => assertString(undefined)).toThrow('Expected a string')
      expect(() => assertString({})).toThrow('Expected a string')
    })

    test('should throw with custom message', () => {
      expect(() => assertString(123, 'Value must be a string')).toThrow(
        'Value must be a string',
      )
    })

    test('should narrow type correctly', () => {
      const value: unknown = 'hello'

      assertString(value)

      expectTypeOf(value).toEqualTypeOf<string>()
      expect(value.length).toBe(5)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): string => {
        assertString(value)
        return value.toUpperCase() // TypeScript knows this is a string
      }

      expect(processValue('hello')).toBe('HELLO')
      expect(() => processValue(123)).toThrow()
    })
  })

  describe('assertNonEmptyString', () => {
    test('should not throw for non-empty strings', () => {
      expect(() => assertNonEmptyString('hello')).not.toThrow()
      expect(() => assertNonEmptyString('123')).not.toThrow()
      expect(() => assertNonEmptyString('a')).not.toThrow()
    })

    test('should throw for empty strings and non-strings', () => {
      expect(() => assertNonEmptyString('')).toThrow(
        'Expected a non-empty string',
      )
      expect(() => assertNonEmptyString(123)).toThrow(
        'Expected a non-empty string',
      )
      expect(() => assertNonEmptyString(null)).toThrow(
        'Expected a non-empty string',
      )
      expect(() => assertNonEmptyString(undefined)).toThrow(
        'Expected a non-empty string',
      )
    })

    test('should throw with custom message', () => {
      expect(() => assertNonEmptyString('', 'Value cannot be empty')).toThrow(
        'Value cannot be empty',
      )
      expect(() =>
        assertNonEmptyString(123, 'Value must be a non-empty string'),
      ).toThrow('Value must be a non-empty string')
    })

    test('should narrow type correctly', () => {
      const value: unknown = 'hello'

      assertNonEmptyString(value)

      expectTypeOf(value).toEqualTypeOf<string>()
      expect(value.length).toBeGreaterThan(0)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): string => {
        assertNonEmptyString(value)
        return value.toUpperCase() // TypeScript knows this is a non-empty string
      }

      expect(processValue('hello')).toBe('HELLO')
      expect(() => processValue('')).toThrow()
      expect(() => processValue(123)).toThrow()
    })
  })

  describe('assertNumber', () => {
    test('should not throw for finite numbers', () => {
      expect(() => assertNumber(42)).not.toThrow()
      expect(() => assertNumber(0)).not.toThrow()
      expect(() => assertNumber(-1)).not.toThrow()
      expect(() => assertNumber(3.14)).not.toThrow()
    })

    test('should throw for non-finite numbers and non-numbers', () => {
      expect(() => assertNumber(NaN)).toThrow('Expected a number')
      expect(() => assertNumber(Infinity)).toThrow('Expected a number')
      expect(() => assertNumber(-Infinity)).toThrow('Expected a number')
      expect(() => assertNumber('123')).toThrow('Expected a number')
      expect(() => assertNumber(true)).toThrow('Expected a number')
      expect(() => assertNumber(null)).toThrow('Expected a number')
    })

    test('should throw with custom message', () => {
      expect(() => assertNumber('123', 'Value must be a number')).toThrow(
        'Value must be a number',
      )
      expect(() => assertNumber(NaN, 'Value must be finite')).toThrow(
        'Value must be finite',
      )
    })

    test('should narrow type correctly', () => {
      const value: unknown = 42

      assertNumber(value)

      expectTypeOf(value).toEqualTypeOf<number>()
      expect(value + 1).toBe(43)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): number => {
        assertNumber(value)
        return value * 2 // TypeScript knows this is a number
      }

      expect(processValue(21)).toBe(42)
      expect(() => processValue('hello')).toThrow()
      expect(() => processValue(NaN)).toThrow()
    })
  })

  describe('assertBoolean', () => {
    test('should not throw for booleans', () => {
      expect(() => assertBoolean(true)).not.toThrow()
      expect(() => assertBoolean(false)).not.toThrow()
    })

    test('should throw for non-booleans', () => {
      expect(() => assertBoolean(0)).toThrow('Expected a boolean')
      expect(() => assertBoolean(1)).toThrow('Expected a boolean')
      expect(() => assertBoolean('true')).toThrow('Expected a boolean')
      expect(() => assertBoolean(null)).toThrow('Expected a boolean')
      expect(() => assertBoolean(undefined)).toThrow('Expected a boolean')
    })

    test('should throw with custom message', () => {
      expect(() => assertBoolean(0, 'Value must be a boolean')).toThrow(
        'Value must be a boolean',
      )
    })

    test('should narrow type correctly', () => {
      const value: unknown = true

      assertBoolean(value)

      expectTypeOf(value).toEqualTypeOf<boolean>()
      expect(value).toBe(true)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): string => {
        assertBoolean(value)
        return value ? 'true' : 'false' // TypeScript knows this is a boolean
      }

      expect(processValue(true)).toBe('true')
      expect(processValue(false)).toBe('false')
      expect(() => processValue('hello')).toThrow()
    })
  })
})

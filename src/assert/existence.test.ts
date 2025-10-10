import { expectTypeOf } from 'expect-type'
import { describe, expect, test } from 'vitest'

import {
  assertDefined,
  assertFalsy,
  assertNotNull,
  assertTruthy,
} from './existence'

describe('assert/existence', () => {
  describe('assertDefined', () => {
    test('should not throw for defined values', () => {
      expect(() => assertDefined('hello')).not.toThrow()
      expect(() => assertDefined(42)).not.toThrow()
      expect(() => assertDefined(true)).not.toThrow()
      expect(() => assertDefined({})).not.toThrow()
      expect(() => assertDefined([])).not.toThrow()
    })

    test('should throw for null and undefined', () => {
      expect(() => assertDefined(null)).toThrow('Expected a defined value')
      expect(() => assertDefined(undefined)).toThrow('Expected a defined value')
    })

    test('should throw with custom message', () => {
      expect(() => assertDefined(null, 'Value is required')).toThrow(
        'Value is required',
      )
      expect(() => assertDefined(undefined, 'Value is required')).toThrow(
        'Value is required',
      )
    })

    test('should narrow type correctly', () => {
      const value: string | null | undefined = 'hello'

      assertDefined(value)

      expectTypeOf(value).toEqualTypeOf<string>()
      expect(value.length).toBe(5)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: string | null | undefined): string => {
        assertDefined(value)
        return value.toUpperCase() // TypeScript knows this is defined
      }

      expect(processValue('hello')).toBe('HELLO')
      expect(() => processValue(null)).toThrow()
      expect(() => processValue(undefined)).toThrow()
    })
  })

  describe('assertNotNull', () => {
    test('should not throw for non-null values', () => {
      expect(() => assertNotNull('hello')).not.toThrow()
      expect(() => assertNotNull(42)).not.toThrow()
      expect(() => assertNotNull(undefined)).not.toThrow() // undefined is not null
    })

    test('should throw for null', () => {
      expect(() => assertNotNull(null)).toThrow('Expected a non-null value')
    })

    test('should throw with custom message', () => {
      expect(() => assertNotNull(null, 'Value cannot be null')).toThrow(
        'Value cannot be null',
      )
    })

    test('should narrow type correctly', () => {
      const value: string | null = 'hello'

      assertNotNull(value)

      expectTypeOf(value).toEqualTypeOf<string>()
      expect(value.length).toBe(5)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: string | null): string => {
        assertNotNull(value)
        return value.toUpperCase() // TypeScript knows this is not null
      }

      expect(processValue('hello')).toBe('HELLO')
      expect(() => processValue(null)).toThrow()
    })
  })

  describe('assertTruthy', () => {
    test('should not throw for truthy values', () => {
      expect(() => assertTruthy('hello')).not.toThrow()
      expect(() => assertTruthy(42)).not.toThrow()
      expect(() => assertTruthy(true)).not.toThrow()
      expect(() => assertTruthy({})).not.toThrow()
      expect(() => assertTruthy([])).not.toThrow()
    })

    test('should throw for falsy values', () => {
      expect(() => assertTruthy(false)).toThrow('Expected a truthy value')
      expect(() => assertTruthy(0)).toThrow('Expected a truthy value')
      expect(() => assertTruthy('')).toThrow('Expected a truthy value')
      expect(() => assertTruthy(null)).toThrow('Expected a truthy value')
      expect(() => assertTruthy(undefined)).toThrow('Expected a truthy value')
      expect(() => assertTruthy(NaN)).toThrow('Expected a truthy value')
    })

    test('should throw with custom message', () => {
      expect(() => assertTruthy('', 'Value cannot be empty')).toThrow(
        'Value cannot be empty',
      )
      expect(() => assertTruthy(0, 'Value must be non-zero')).toThrow(
        'Value must be non-zero',
      )
    })

    test('should narrow type correctly', () => {
      const value: string | null | undefined = 'hello'

      assertTruthy(value)

      expectTypeOf(value).toEqualTypeOf<string>()
      expect(value.length).toBe(5)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: string | null | undefined): string => {
        assertTruthy(value)
        return value.toUpperCase() // TypeScript knows this is truthy
      }

      expect(processValue('hello')).toBe('HELLO')
      expect(() => processValue('')).toThrow()
      expect(() => processValue(null)).toThrow()
      expect(() => processValue(undefined)).toThrow()
    })
  })

  describe('assertFalsy', () => {
    test('should not throw for falsy values', () => {
      expect(() => assertFalsy(false)).not.toThrow()
      expect(() => assertFalsy(0)).not.toThrow()
      expect(() => assertFalsy('')).not.toThrow()
      expect(() => assertFalsy(null)).not.toThrow()
      expect(() => assertFalsy(undefined)).not.toThrow()
      expect(() => assertFalsy(NaN)).not.toThrow()
    })

    test('should throw for truthy values', () => {
      expect(() => assertFalsy('hello')).toThrow('Expected a falsy value')
      expect(() => assertFalsy(42)).toThrow('Expected a falsy value')
      expect(() => assertFalsy(true)).toThrow('Expected a falsy value')
      expect(() => assertFalsy({})).toThrow('Expected a falsy value')
      expect(() => assertFalsy([])).toThrow('Expected a falsy value')
    })

    test('should throw with custom message', () => {
      expect(() => assertFalsy('hello', 'Value should be empty')).toThrow(
        'Value should be empty',
      )
      expect(() => assertFalsy(42, 'Value should be zero')).toThrow(
        'Value should be zero',
      )
    })

    test('should narrow type correctly', () => {
      const value: string | null | undefined = ''

      assertFalsy(value)

      // TypeScript should narrow the type to only falsy values from the union
      // This test verifies type narrowing by ensuring we can only access
      // properties that exist on the narrowed type
      expect(value).toBe('')

      // Test that TypeScript knows this is a falsy value
      const processFalsy = (val: '' | null | undefined) => {
        if (val === '') return 'empty string'
        if (val === null) return 'null'
        if (val === undefined) return 'undefined'
        return 'unknown'
      }

      expect(processFalsy(value)).toBe('empty string')
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: string | null | undefined): string => {
        assertFalsy(value)
        return 'falsy' // TypeScript knows this is falsy
      }

      expect(processValue('')).toBe('falsy')
      expect(processValue(null)).toBe('falsy')
      expect(processValue(undefined)).toBe('falsy')
      expect(() => processValue('hello')).toThrow()
    })
  })
})


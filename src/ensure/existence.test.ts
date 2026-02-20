import { describe, expect, expectTypeOf, test } from 'vitest'

import { ensureDefined, ensureNotNull, ensureTruthy } from './existence'

describe('ensure/existence', () => {
  describe('ensureDefined', () => {
    test('should return the value for defined values', () => {
      expect(ensureDefined('hello')).toBe('hello')
      expect(ensureDefined(42)).toBe(42)
      expect(ensureDefined(true)).toBe(true)
      expect(ensureDefined(false)).toBe(false)
      expect(ensureDefined(0)).toBe(0)
      expect(ensureDefined('')).toBe('')
      const obj = {}
      expect(ensureDefined(obj)).toBe(obj)
      const arr: unknown[] = []
      expect(ensureDefined(arr)).toBe(arr)
    })

    test('should throw for null and undefined', () => {
      expect(() => ensureDefined(null)).toThrow('Expected a defined value')
      expect(() => ensureDefined(undefined)).toThrow('Expected a defined value')
    })

    test('should throw EnsureError', () => {
      try {
        ensureDefined(null)
      } catch (e) {
        expect((e as Error).name).toBe('EnsureError')
      }
    })

    test('should throw with custom message', () => {
      expect(() => ensureDefined(null, 'Value is required')).toThrow(
        'Value is required',
      )
      expect(() => ensureDefined(undefined, 'Value is required')).toThrow(
        'Value is required',
      )
    })

    test('should narrow type correctly', () => {
      const value: string | null | undefined = 'hello'
      const result = ensureDefined(value)

      expectTypeOf(result).toEqualTypeOf<string>()
      expect(result.length).toBe(5)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: string | null | undefined): string => {
        return ensureDefined(value).toUpperCase()
      }

      expect(processValue('hello')).toBe('HELLO')
      expect(() => processValue(null)).toThrow()
      expect(() => processValue(undefined)).toThrow()
    })
  })

  describe('ensureNotNull', () => {
    test('should return the value for non-null values', () => {
      expect(ensureNotNull('hello')).toBe('hello')
      expect(ensureNotNull(42)).toBe(42)
      expect(ensureNotNull(undefined)).toBe(undefined) // undefined is not null
    })

    test('should throw for null', () => {
      expect(() => ensureNotNull(null)).toThrow('Expected a non-null value')
    })

    test('should throw with custom message', () => {
      expect(() => ensureNotNull(null, 'Value cannot be null')).toThrow(
        'Value cannot be null',
      )
    })

    test('should narrow type correctly', () => {
      const value: string | null = 'hello'
      const result = ensureNotNull(value)

      expectTypeOf(result).toEqualTypeOf<string>()
      expect(result.length).toBe(5)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: string | null): string => {
        return ensureNotNull(value).toUpperCase()
      }

      expect(processValue('hello')).toBe('HELLO')
      expect(() => processValue(null)).toThrow()
    })
  })

  describe('ensureTruthy', () => {
    test('should return the value for truthy values', () => {
      expect(ensureTruthy('hello')).toBe('hello')
      expect(ensureTruthy(42)).toBe(42)
      expect(ensureTruthy(true)).toBe(true)
      const obj = {}
      expect(ensureTruthy(obj)).toBe(obj)
      const arr: unknown[] = []
      expect(ensureTruthy(arr)).toBe(arr)
    })

    test('should throw for falsy values', () => {
      expect(() => ensureTruthy(false)).toThrow('Expected a truthy value')
      expect(() => ensureTruthy(0)).toThrow('Expected a truthy value')
      expect(() => ensureTruthy('')).toThrow('Expected a truthy value')
      expect(() => ensureTruthy(null)).toThrow('Expected a truthy value')
      expect(() => ensureTruthy(undefined)).toThrow('Expected a truthy value')
      expect(() => ensureTruthy(NaN)).toThrow('Expected a truthy value')
    })

    test('should throw with custom message', () => {
      expect(() => ensureTruthy('', 'Value cannot be empty')).toThrow(
        'Value cannot be empty',
      )
      expect(() => ensureTruthy(0, 'Value must be non-zero')).toThrow(
        'Value must be non-zero',
      )
    })

    test('should narrow type correctly', () => {
      const value: string | null | undefined = 'hello'
      const result = ensureTruthy(value)

      expectTypeOf(result).toEqualTypeOf<string>()
      expect(result.length).toBe(5)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: string | null | undefined): string => {
        return ensureTruthy(value).toUpperCase()
      }

      expect(processValue('hello')).toBe('HELLO')
      expect(() => processValue('')).toThrow()
      expect(() => processValue(null)).toThrow()
      expect(() => processValue(undefined)).toThrow()
    })
  })
})

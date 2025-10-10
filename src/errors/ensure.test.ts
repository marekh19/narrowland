import { expectTypeOf } from 'expect-type'
import { describe, expect, test } from 'vitest'

import { ensure } from './ensure'

describe('ensure', () => {
  describe('ensure', () => {
    test('should return value for defined values', () => {
      expect(ensure('hello')).toBe('hello')
      expect(ensure(42)).toBe(42)
      expect(ensure(true)).toBe(true)
      expect(ensure({})).toEqual({})
      expect(ensure([])).toEqual([])
      expect(ensure(0)).toBe(0)
      expect(ensure('')).toBe('')
      expect(ensure(false)).toBe(false)
    })

    test('should throw for null and undefined', () => {
      expect(() => ensure(null)).toThrow('Expected a defined (non-nullish) value')
      expect(() => ensure(undefined)).toThrow('Expected a defined (non-nullish) value')
    })

    test('should throw with custom message', () => {
      expect(() => ensure(null, 'Value is required')).toThrow('Value is required')
      expect(() => ensure(undefined, 'Value is required')).toThrow('Value is required')
    })

    test('should narrow type correctly', () => {
      const value: string | null | undefined = 'hello'

      const result = ensure(value)

      expectTypeOf(result).toEqualTypeOf<string>()
      expect(result.length).toBe(5)
    })

    test('should narrow type correctly with complex types', () => {
      interface User {
        name: string
        age: number
      }

      const value: User | null | undefined = { name: 'John', age: 30 }

      const result = ensure(value)

      expectTypeOf(result).toEqualTypeOf<User>()
      expect(result.name).toBe('John')
      expect(result.age).toBe(30)
    })

    test('should work in conditional logic', () => {
      const processValue = (value: string | null | undefined): string => {
        const ensured = ensure(value, 'Value cannot be null or undefined')
        return ensured.toUpperCase()
      }

      expect(processValue('hello')).toBe('HELLO')
      expect(() => processValue(null)).toThrow('Value cannot be null or undefined')
      expect(() => processValue(undefined)).toThrow('Value cannot be null or undefined')
    })

    test('should work with arrays', () => {
      const value: string[] | null | undefined = ['hello', 'world']

      const result = ensure(value)

      expectTypeOf(result).toEqualTypeOf<string[]>()
      expect(result.length).toBe(2)
      expect(result[0]).toBe('hello')
    })

    test('should work with objects', () => {
      const value: { name: string } | null | undefined = { name: 'test' }

      const result = ensure(value)

      expectTypeOf(result).toEqualTypeOf<{ name: string }>()
      expect(result.name).toBe('test')
    })

    test('should work with union types', () => {
      const value: string | number | null | undefined = 'hello'

      const result = ensure(value)

      // TypeScript should narrow the type to string | number
      expect(result).toBe('hello')
      expect(typeof result).toBe('string')
    })

    test('should work with falsy but defined values', () => {
      expect(ensure(0)).toBe(0)
      expect(ensure('')).toBe('')
      expect(ensure(false)).toBe(false)
      expect(ensure(NaN)).toBe(NaN)
    })

    test('should work with function return values', () => {
      const getValue = (): string | null => Math.random() > 0.5 ? 'hello' : null

      const value = getValue()
      
      if (value !== null) {
        const result = ensure(value)
        expectTypeOf(result).toEqualTypeOf<string>()
        expect(result).toBe('hello')
      } else {
        expect(() => ensure(value)).toThrow('Expected a defined (non-nullish) value')
      }
    })

    test('should work with API responses', () => {
      interface ApiResponse {
        data: string
        status: number
      }

      const mockApiCall = (): ApiResponse | null => {
        return Math.random() > 0.5 ? { data: 'success', status: 200 } : null
      }

      const response = mockApiCall()
      
      if (response !== null) {
        const result = ensure(response)
        expectTypeOf(result).toEqualTypeOf<ApiResponse>()
        expect(result.data).toBe('success')
        expect(result.status).toBe(200)
      } else {
        expect(() => ensure(response)).toThrow('Expected a defined (non-nullish) value')
      }
    })

    test('should work with optional chaining scenarios', () => {
      interface User {
        profile?: {
          name: string
          email: string
        }
      }

      const user: User | null | undefined = {
        profile: { name: 'John', email: 'john@example.com' }
      }

      const ensuredUser = ensure(user)
      const profile = ensuredUser.profile

      if (profile) {
        const ensuredProfile = ensure(profile)
        expectTypeOf(ensuredProfile).toEqualTypeOf<{ name: string; email: string }>()
        expect(ensuredProfile.name).toBe('John')
      }
    })
  })
})
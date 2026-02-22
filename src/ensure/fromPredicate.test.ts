import { describe, expect, expectTypeOf, test } from 'vitest'

import { ensureFromPredicate } from './fromPredicate'

describe('ensure/fromPredicate', () => {
  describe('ensureFromPredicate', () => {
    test('should create ensure function from predicate', () => {
      const isString = (value: unknown): value is string =>
        typeof value === 'string'
      const ensureString = ensureFromPredicate(isString, 'Expected a string')

      expect(ensureString('hello')).toBe('hello')
      expect(() => ensureString(123)).toThrow('Expected a string')
    })

    test('should throw EnsureError', () => {
      const isString = (value: unknown): value is string =>
        typeof value === 'string'
      const ensureString = ensureFromPredicate(isString, 'Expected a string')

      try {
        ensureString(123)
      } catch (e) {
        expect((e as Error).name).toBe('EnsureError')
      }
    })

    test('should work with custom message', () => {
      const isNumber = (value: unknown): value is number =>
        typeof value === 'number' && Number.isFinite(value)
      const ensureNumber = ensureFromPredicate(
        isNumber,
        'Expected a finite number',
      )

      expect(ensureNumber(42)).toBe(42)
      expect(() => ensureNumber('hello')).toThrow('Expected a finite number')
      expect(() => ensureNumber(NaN)).toThrow('Expected a finite number')
    })

    test('should allow overriding message per call', () => {
      const isPositive = (value: unknown): value is number =>
        typeof value === 'number' && value > 0
      const ensurePositive = ensureFromPredicate(
        isPositive,
        'Expected a positive number',
      )

      expect(ensurePositive(42)).toBe(42)
      expect(() => ensurePositive(-1)).toThrow('Expected a positive number')
      expect(() => ensurePositive(-1, 'Value must be positive')).toThrow(
        'Value must be positive',
      )
    })

    test('should work with complex user validation', () => {
      interface User {
        id: string
        email: string
        age: number
        isActive: boolean
      }

      const isUser = (value: unknown): value is User => {
        return (
          typeof value === 'object' &&
          value !== null &&
          'id' in value &&
          'email' in value &&
          'age' in value &&
          'isActive' in value &&
          typeof value.id === 'string' &&
          typeof value.email === 'string' &&
          typeof value.age === 'number' &&
          typeof value.isActive === 'boolean' &&
          value.email.includes('@') &&
          value.age >= 0 &&
          value.age <= 150
        )
      }
      const ensureUser = ensureFromPredicate(
        isUser,
        'Expected a valid user object',
      )

      const validUser = {
        id: '1',
        email: 'john@example.com',
        age: 30,
        isActive: true,
      }
      const result = ensureUser(validUser)
      expect(result).toBe(validUser)
      expectTypeOf(result).toEqualTypeOf<User>()
      expect(result.email).toBe('john@example.com')

      expect(() =>
        ensureUser({
          id: '1',
          email: 'invalid-email',
          age: 30,
          isActive: true,
        }),
      ).toThrow('Expected a valid user object')
      expect(() =>
        ensureUser({
          id: '1',
          email: 'john@example.com',
          age: -5,
          isActive: true,
        }),
      ).toThrow('Expected a valid user object')
      expect(() => ensureUser({ name: 'John' })).toThrow(
        'Expected a valid user object',
      )
    })

    test('should work with API response validation', () => {
      interface ApiResponse<T> {
        success: boolean
        data: T
        error?: string
        timestamp: number
      }

      const isApiResponse = <T>(value: unknown): value is ApiResponse<T> => {
        return (
          typeof value === 'object' &&
          value !== null &&
          'success' in value &&
          'data' in value &&
          'timestamp' in value &&
          typeof value.success === 'boolean' &&
          typeof value.timestamp === 'number' &&
          value.timestamp > 0 &&
          (!('error' in value) || typeof value.error === 'string')
        )
      }
      const ensureApiResponse = ensureFromPredicate(
        isApiResponse,
        'Expected a valid API response',
      )

      const validResponse = {
        success: true,
        data: { id: 1 },
        timestamp: Date.now(),
      }
      expect(ensureApiResponse(validResponse)).toBe(validResponse)

      expect(() =>
        ensureApiResponse({ success: true, data: { id: 1 } }),
      ).toThrow('Expected a valid API response')
      expect(() => ensureApiResponse('invalid')).toThrow(
        'Expected a valid API response',
      )
    })

    test('should narrow type correctly with expectTypeOf', () => {
      const isString = (value: unknown): value is string =>
        typeof value === 'string'
      const ensureString = ensureFromPredicate(isString, 'Expected a string')

      const value: unknown = 'hello'
      const result = ensureString(value)

      expectTypeOf(result).toEqualTypeOf<string>()
      expect(result.length).toBe(5)
    })

    test('should narrow type correctly with complex type and expectTypeOf', () => {
      interface User {
        name: string
        age: number
      }

      const isUser = (value: unknown): value is User => {
        return (
          typeof value === 'object' &&
          value !== null &&
          'name' in value &&
          'age' in value &&
          typeof value.name === 'string' &&
          typeof value.age === 'number'
        )
      }
      const ensureUser = ensureFromPredicate(isUser, 'Expected a user object')

      const value: unknown = { name: 'John', age: 30 }
      const result = ensureUser(value)

      expectTypeOf(result).toEqualTypeOf<User>()
      expect(result.name).toBe('John')
      expect(result.age).toBe(30)
    })

    test('should work with default message when none provided', () => {
      const isBoolean = (value: unknown): value is boolean =>
        typeof value === 'boolean'
      const ensureBoolean = ensureFromPredicate(isBoolean)

      expect(ensureBoolean(true)).toBe(true)
      expect(() => ensureBoolean(123)).toThrow('Assertion failed')
    })
  })
})

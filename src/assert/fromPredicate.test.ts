import { expectTypeOf } from 'expect-type'
import { describe, expect, test } from 'vitest'

import { assertFromPredicate } from './fromPredicate'

describe('assert/fromPredicate', () => {
  describe('assertFromPredicate', () => {
    test('should create assertion function from predicate', () => {
      const isString = (value: unknown): value is string =>
        typeof value === 'string'
      const assertString = assertFromPredicate(isString, 'Expected a string')

      expect(() => assertString('hello')).not.toThrow()
      expect(() => assertString(123)).toThrow('Expected a string')
    })

    test('should work with custom message', () => {
      const isNumber = (value: unknown): value is number =>
        typeof value === 'number' && Number.isFinite(value)
      const assertNumber = assertFromPredicate(
        isNumber,
        'Expected a finite number',
      )

      expect(() => assertNumber(42)).not.toThrow()
      expect(() => assertNumber('hello')).toThrow('Expected a finite number')
      expect(() => assertNumber(NaN)).toThrow('Expected a finite number')
    })

    test('should allow overriding message per call', () => {
      const isPositive = (value: unknown): value is number =>
        typeof value === 'number' && value > 0
      const assertPositive = assertFromPredicate(
        isPositive,
        'Expected a positive number',
      )

      expect(() => assertPositive(42)).not.toThrow()
      expect(() => assertPositive(-1)).toThrow('Expected a positive number')
      expect(() => assertPositive(-1, 'Value must be positive')).toThrow(
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
      const assertUser = assertFromPredicate(
        isUser,
        'Expected a valid user object',
      )

      expect(() =>
        assertUser({
          id: '1',
          email: 'john@example.com',
          age: 30,
          isActive: true,
        }),
      ).not.toThrow()
      expect(() =>
        assertUser({
          id: '1',
          email: 'invalid-email',
          age: 30,
          isActive: true,
        }),
      ).toThrow('Expected a valid user object')
      expect(() =>
        assertUser({
          id: '1',
          email: 'john@example.com',
          age: -5,
          isActive: true,
        }),
      ).toThrow('Expected a valid user object')
      expect(() => assertUser({ name: 'John' })).toThrow(
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
      const assertApiResponse = assertFromPredicate(
        isApiResponse,
        'Expected a valid API response',
      )

      expect(() =>
        assertApiResponse({
          success: true,
          data: { id: 1 },
          timestamp: Date.now(),
        }),
      ).not.toThrow()
      expect(() =>
        assertApiResponse({
          success: false,
          data: null,
          error: 'Not found',
          timestamp: Date.now(),
        }),
      ).not.toThrow()
      expect(() =>
        assertApiResponse({ success: true, data: { id: 1 } }),
      ).toThrow('Expected a valid API response')
      expect(() => assertApiResponse('invalid')).toThrow(
        'Expected a valid API response',
      )
    })

    test('should work with form validation', () => {
      interface FormData {
        username: string
        password: string
        confirmPassword: string
        email: string
        termsAccepted: boolean
      }

      const isFormData = (value: unknown): value is FormData => {
        return (
          typeof value === 'object' &&
          value !== null &&
          'username' in value &&
          'password' in value &&
          'confirmPassword' in value &&
          'email' in value &&
          'termsAccepted' in value &&
          typeof value.username === 'string' &&
          typeof value.password === 'string' &&
          typeof value.confirmPassword === 'string' &&
          typeof value.email === 'string' &&
          typeof value.termsAccepted === 'boolean' &&
          value.username.length >= 3 &&
          value.password.length >= 8 &&
          value.password === value.confirmPassword &&
          value.email.includes('@') &&
          value.termsAccepted === true
        )
      }
      const assertFormData = assertFromPredicate(
        isFormData,
        'Expected valid form data',
      )

      expect(() =>
        assertFormData({
          username: 'john_doe',
          password: 'password123',
          confirmPassword: 'password123',
          email: 'john@example.com',
          termsAccepted: true,
        }),
      ).not.toThrow()

      expect(() =>
        assertFormData({
          username: 'jo',
          password: 'password123',
          confirmPassword: 'password123',
          email: 'john@example.com',
          termsAccepted: true,
        }),
      ).toThrow('Expected valid form data')

      expect(() =>
        assertFormData({
          username: 'john_doe',
          password: 'password123',
          confirmPassword: 'different',
          email: 'john@example.com',
          termsAccepted: true,
        }),
      ).toThrow('Expected valid form data')
    })

    test('should work with array of objects validation', () => {
      interface Product {
        id: string
        name: string
        price: number
        inStock: boolean
      }

      const isProductArray = (value: unknown): value is Product[] => {
        return (
          Array.isArray(value) &&
          value.length > 0 &&
          value.every(
            (item) =>
              typeof item === 'object' &&
              item !== null &&
              'id' in item &&
              'name' in item &&
              'price' in item &&
              'inStock' in item &&
              typeof item.id === 'string' &&
              typeof item.name === 'string' &&
              typeof item.price === 'number' &&
              typeof item.inStock === 'boolean' &&
              item.price > 0,
          )
        )
      }
      const assertProductArray = assertFromPredicate(
        isProductArray,
        'Expected a non-empty array of valid products',
      )

      expect(() =>
        assertProductArray([
          { id: '1', name: 'Product 1', price: 10.99, inStock: true },
          { id: '2', name: 'Product 2', price: 20.5, inStock: false },
        ]),
      ).not.toThrow()

      expect(() => assertProductArray([])).toThrow(
        'Expected a non-empty array of valid products',
      )
      expect(() =>
        assertProductArray([
          { id: '1', name: 'Product 1', price: -10.99, inStock: true },
        ]),
      ).toThrow('Expected a non-empty array of valid products')
    })

    test('should narrow type correctly with expectTypeOf', () => {
      const isString = (value: unknown): value is string =>
        typeof value === 'string'
      const assertString: (
        value: unknown,
        message?: string,
      ) => asserts value is string = assertFromPredicate(
        isString,
        'Expected a string',
      )

      const value: unknown = 'hello'

      assertString(value)

      expectTypeOf(value).toEqualTypeOf<string>()
      expect(value.length).toBe(5)
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
      const assertUser: (
        value: unknown,
        message?: string,
      ) => asserts value is User = assertFromPredicate(
        isUser,
        'Expected a user object',
      )

      const value: unknown = { name: 'John', age: 30 }

      assertUser(value)

      expectTypeOf(value).toEqualTypeOf<User>()
      expect(value.name).toBe('John')
      expect(value.age).toBe(30)
    })

    test('should work with default message when none provided', () => {
      const isBoolean = (value: unknown): value is boolean =>
        typeof value === 'boolean'
      const assertBoolean = assertFromPredicate(isBoolean) // No default message

      expect(() => assertBoolean(true)).not.toThrow()
      expect(() => assertBoolean(123)).toThrow('Assertion failed')
    })
  })
})

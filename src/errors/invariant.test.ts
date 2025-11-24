import { describe, expect, expectTypeOf, test } from 'vitest'

import { invariant } from './invariant'

describe('invariant', () => {
  describe('truthy values', () => {
    const truthyValues = [
      true,
      'hello',
      42,
      {},
      [],
      () => {},
      new Date(),
      Symbol('test'),
      Infinity,
      -Infinity,
    ] as const

    test.each(
      truthyValues,
    )('should not throw for truthy value: %s', (value) => {
      expect(() => invariant(value)).not.toThrow()
    })
  })

  describe('falsy values', () => {
    const falsyValues = [false, 0, -0, NaN, '', null, undefined] as const

    test.each(falsyValues)('should throw for falsy value: %s', (value) => {
      expect(() => invariant(value)).toThrow('Invariant failed')
    })
  })

  describe('message behavior', () => {
    test('should throw with default message when no message provided', () => {
      expect(() => invariant(false)).toThrow('Invariant failed')
    })

    test('should throw with custom message when string provided', () => {
      expect(() => invariant(false, 'Custom error')).toThrow(
        'Invariant failed: Custom error',
      )
    })

    test('should throw with message from function when function provided', () => {
      const messageFn = () => 'Dynamic message'
      expect(() => invariant(false, messageFn)).toThrow(
        'Invariant failed: Dynamic message',
      )
    })

    test('should not call message function when condition is truthy', () => {
      let called = false
      const messageFn = () => {
        called = true
        return 'Should not be called'
      }

      invariant(true, messageFn)
      expect(called).toBe(false)
    })
  })

  describe('type narrowing', () => {
    test('should narrow string | null to string', () => {
      const value: string | null = 'hello'

      invariant(value !== null)

      expectTypeOf(value).toEqualTypeOf<string>()
      expect(value.length).toBe(5)
    })

    test('should narrow unknown to object with property', () => {
      const value: unknown = { name: 'test', age: 25 }

      invariant(typeof value === 'object' && value !== null && 'name' in value)

      expectTypeOf(value).toEqualTypeOf<object & { name: unknown }>()
      expect((value as { name: string }).name).toBe('test')
    })

    test('should narrow array type', () => {
      const value: unknown = [1, 2, 3]

      invariant(Array.isArray(value))

      expectTypeOf(value).toExtend<unknown[]>()
      expect(value.length).toBe(3)
    })
  })

  describe('throw behavior', () => {
    test('should throw Error instance', () => {
      expect(() => invariant(false)).toThrow(Error)
    })

    test('should throw with correct message format', () => {
      try {
        invariant(false, 'Test message')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe('Invariant failed: Test message')
      }
    })

    test('should throw with function message', () => {
      try {
        invariant(false, () => 'Function message')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe(
          'Invariant failed: Function message',
        )
      }
    })
  })
})

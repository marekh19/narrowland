import { describe, expect, expectTypeOf, test } from 'vitest'

import {
  assertArray,
  assertNonEmptyArray,
  assertObject,
  assertStringLiteral,
} from './collections'

describe('assert/collections', () => {
  describe('assertArray', () => {
    test('should not throw for arrays', () => {
      expect(() => assertArray([])).not.toThrow()
      expect(() => assertArray([1, 2, 3])).not.toThrow()
      expect(() => assertArray(['hello', 'world'])).not.toThrow()
      expect(() => assertArray([{}])).not.toThrow()
      expect(() => assertArray([null, undefined])).not.toThrow()
    })

    test('should throw for non-arrays', () => {
      expect(() => assertArray({})).toThrow('Expected an array')
      expect(() => assertArray('hello')).toThrow('Expected an array')
      expect(() => assertArray(42)).toThrow('Expected an array')
      expect(() => assertArray(true)).toThrow('Expected an array')
      expect(() => assertArray(null)).toThrow('Expected an array')
      expect(() => assertArray(undefined)).toThrow('Expected an array')
    })

    test('should throw with custom message', () => {
      expect(() => assertArray({}, 'Value must be an array')).toThrow(
        'Value must be an array',
      )
    })

    test('should narrow type correctly', () => {
      const value: unknown = [1, 2, 3]

      assertArray(value)

      expectTypeOf(value).toEqualTypeOf<unknown[]>()
      expect(value.length).toBe(3)
      expect(value[0]).toBe(1)
    })

    test('should narrow type correctly with generic', () => {
      const value: unknown = ['hello', 'world']

      assertArray<string>(value)

      expectTypeOf(value).toEqualTypeOf<string[]>()
      expect(value[0].toUpperCase()).toBe('HELLO')
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): number => {
        assertArray(value)
        return value.length // TypeScript knows this is an array
      }

      expect(processValue([1, 2, 3])).toBe(3)
      expect(() => processValue({})).toThrow()
    })
  })

  describe('assertNonEmptyArray', () => {
    test('should not throw for non-empty arrays', () => {
      expect(() => assertNonEmptyArray([1])).not.toThrow()
      expect(() => assertNonEmptyArray([1, 2, 3])).not.toThrow()
      expect(() => assertNonEmptyArray(['hello'])).not.toThrow()
      expect(() => assertNonEmptyArray([{}])).not.toThrow()
      expect(() => assertNonEmptyArray([null])).not.toThrow()
    })

    test('should throw for empty arrays and non-arrays', () => {
      expect(() => assertNonEmptyArray([])).toThrow(
        'Expected a non-empty array',
      )
      expect(() => assertNonEmptyArray({})).toThrow(
        'Expected a non-empty array',
      )
      expect(() => assertNonEmptyArray('hello')).toThrow(
        'Expected a non-empty array',
      )
      expect(() => assertNonEmptyArray(42)).toThrow(
        'Expected a non-empty array',
      )
      expect(() => assertNonEmptyArray(null)).toThrow(
        'Expected a non-empty array',
      )
    })

    test('should throw with custom message', () => {
      expect(() => assertNonEmptyArray([], 'Array cannot be empty')).toThrow(
        'Array cannot be empty',
      )
      expect(() =>
        assertNonEmptyArray({}, 'Value must be a non-empty array'),
      ).toThrow('Value must be a non-empty array')
    })

    test('should narrow type correctly', () => {
      const value: unknown = [1, 2, 3]

      assertNonEmptyArray(value)

      expectTypeOf(value).toEqualTypeOf<[unknown, ...unknown[]]>()
      expect(value.length).toBeGreaterThan(0)
      expect(value[0]).toBe(1)
    })

    test('should narrow type correctly with generic', () => {
      const value: unknown = ['hello', 'world']

      assertNonEmptyArray<string>(value)

      expectTypeOf(value).toEqualTypeOf<[string, ...string[]]>()
      expect(value[0].toUpperCase()).toBe('HELLO')
      expect(value.length).toBeGreaterThan(0)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): number => {
        assertNonEmptyArray(value)
        return value.length // TypeScript knows this is a non-empty array
      }

      expect(processValue([1, 2, 3])).toBe(3)
      expect(() => processValue([])).toThrow()
      expect(() => processValue({})).toThrow()
    })
  })

  describe('assertStringLiteral', () => {
    test('should not throw when value is in allowed literals', () => {
      expect(() =>
        assertStringLiteral('a' as 'a' | 'b', ['a', 'b'], 'Invalid literal'),
      ).not.toThrow()
      expect(() =>
        assertStringLiteral('b' as 'a' | 'b', ['a', 'b'], 'Invalid literal'),
      ).not.toThrow()
    })

    test('should throw when value is not in allowed literals', () => {
      expect(() =>
        assertStringLiteral('c' as 'a' | 'b', ['a', 'b'], 'Invalid literal'),
      ).toThrow('Invalid literal')
      expect(() =>
        assertStringLiteral('abc' as 'a' | 'b', ['a', 'b'], 'Invalid literal'),
      ).toThrow('Invalid literal')
    })

    test('should be case-sensitive', () => {
      expect(() =>
        assertStringLiteral('Foo' as 'foo', ['foo'], 'Invalid literal'),
      ).toThrow('Invalid literal')
      expect(() =>
        assertStringLiteral('foo', ['foo'], 'Invalid literal'),
      ).not.toThrow()
    })

    test('should error with correct defualt error message', () => {
      expect(() =>
        assertStringLiteral('d' as 'a' | 'b' | 'c', ['a', 'b', 'c']),
      ).toThrow(`Expected one of folowing values: a, b, c.`)
    })
  })

  describe('assertObject', () => {
    test('should not throw for objects', () => {
      expect(() => assertObject({})).not.toThrow()
      expect(() => assertObject({ name: 'test' })).not.toThrow()
      expect(() => assertObject({ nested: { value: 42 } })).not.toThrow()
      expect(() => assertObject(new Date())).not.toThrow()
      expect(() => assertObject(/regex/)).not.toThrow()
    })

    test('should throw for non-objects', () => {
      expect(() => assertObject([])).toThrow('Expected an object') // arrays are not objects
      expect(() => assertObject('hello')).toThrow('Expected an object')
      expect(() => assertObject(42)).toThrow('Expected an object')
      expect(() => assertObject(true)).toThrow('Expected an object')
      expect(() => assertObject(null)).toThrow('Expected an object')
      expect(() => assertObject(undefined)).toThrow('Expected an object')
      expect(() => assertObject(() => {})).toThrow('Expected an object')
    })

    test('should throw with custom message', () => {
      expect(() => assertObject([], 'Value must be an object')).toThrow(
        'Value must be an object',
      )
      expect(() => assertObject(null, 'Value cannot be null')).toThrow(
        'Value cannot be null',
      )
    })

    test('should narrow type correctly', () => {
      const value: unknown = { name: 'test', age: 25 }

      assertObject(value)

      expectTypeOf(value).toEqualTypeOf<object>()
      expect(typeof value).toBe('object')
      expect(value).not.toBeNull()
    })

    test('should narrow type correctly with specific object type', () => {
      interface User {
        name: string
        age: number
      }

      const value: unknown = { name: 'test', age: 25 }

      assertObject<User>(value)

      expectTypeOf(value).toEqualTypeOf<User>()
      expect(value.name).toBe('test')
      expect(value.age).toBe(25)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): string => {
        assertObject(value)
        return JSON.stringify(value) // TypeScript knows this is an object
      }

      expect(processValue({ name: 'test' })).toBe('{"name":"test"}')
      expect(() => processValue([])).toThrow()
      expect(() => processValue(null)).toThrow()
    })
  })
})

import { describe, expect, expectTypeOf, test } from 'vitest'

import {
  isArray,
  isNonEmptyArray,
  isObject,
  isStringLiteral,
} from './collections'

describe('collections', () => {
  describe('isArray', () => {
    test('should return true for arrays', () => {
      expect(isArray([])).toBe(true)
      expect(isArray([1, 2, 3])).toBe(true)
      expect(isArray(['hello', 'world'])).toBe(true)
      expect(isArray([{}])).toBe(true)
      expect(isArray([null, undefined])).toBe(true)
    })

    test('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false)
      expect(isArray('hello')).toBe(false)
      expect(isArray(42)).toBe(false)
      expect(isArray(true)).toBe(false)
      expect(isArray(null)).toBe(false)
      expect(isArray(undefined)).toBe(false)
      expect(isArray(() => {})).toBe(false)
    })

    test('should narrow type correctly', () => {
      const value: unknown = [1, 2, 3]

      if (isArray(value)) {
        expectTypeOf(value).toEqualTypeOf<unknown[]>()
        expect(value.length).toBe(3)
        expect(value[0]).toBe(1)
      }
    })

    test('should narrow type correctly with generic', () => {
      const value: unknown = ['hello', 'world']

      if (isArray<string>(value)) {
        expectTypeOf(value).toEqualTypeOf<string[]>()
        expect(value[0].toUpperCase()).toBe('HELLO')
      }
    })
  })

  describe('isNonEmptyArray', () => {
    test('should return true for non-empty arrays', () => {
      expect(isNonEmptyArray([1])).toBe(true)
      expect(isNonEmptyArray([1, 2, 3])).toBe(true)
      expect(isNonEmptyArray(['hello'])).toBe(true)
      expect(isNonEmptyArray([{}])).toBe(true)
      expect(isNonEmptyArray([null])).toBe(true)
    })

    test('should return false for empty arrays and non-arrays', () => {
      expect(isNonEmptyArray([])).toBe(false)
      expect(isNonEmptyArray({})).toBe(false)
      expect(isNonEmptyArray('hello')).toBe(false)
      expect(isNonEmptyArray(42)).toBe(false)
      expect(isNonEmptyArray(null)).toBe(false)
    })

    test('should narrow type correctly', () => {
      const value: unknown = [1, 2, 3]

      if (isNonEmptyArray(value)) {
        expectTypeOf(value).toEqualTypeOf<[unknown, ...unknown[]]>()
        expect(value.length).toBeGreaterThan(0)
        expect(value[0]).toBe(1)
      }
    })

    test('should narrow type correctly with generic', () => {
      const value: unknown = ['hello', 'world']

      if (isNonEmptyArray<string>(value)) {
        expectTypeOf(value).toEqualTypeOf<[string, ...string[]]>()
        expect(value[0].toUpperCase()).toBe('HELLO')
        expect(value.length).toBeGreaterThan(0)
      }
    })
  })

  describe('isStringLiteral', () => {
    test('should return true when value is in allowed literals', () => {
      expect(isStringLiteral('a' as 'a' | 'b', ['a', 'b'])).toBe(true)
      expect(isStringLiteral('b' as 'a' | 'b', ['a', 'b'])).toBe(true)
    })

    test('should return false when value is not in allowed literals', () => {
      expect(isStringLiteral('c' as 'a' | 'b', ['a', 'b'])).toBe(false)
      expect(isStringLiteral('ab' as 'a' | 'b', ['a', 'b'])).toBe(false)
    })

    test('should be case-sensitive', () => {
      expect(isStringLiteral('Foo' as 'foo', ['foo'])).toBe(false)
      expect(isStringLiteral('foo', ['foo'])).toBe(true)
    })

    test('should return false for empty allowed list', () => {
      expect(isStringLiteral('any', [])).toBe(false)
    })

    test('should narrow type to provided literal union', () => {
      const value = 'a' as 'a' | 'b' | 'c'

      if (isStringLiteral(value, ['a', 'b'])) {
        expectTypeOf(value).toEqualTypeOf<'a' | 'b'>()
        expect(typeof value).toBe('string')
        expect(value).toBe('a')
      }
    })
  })

  describe('isObject', () => {
    test('should return true for objects', () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ name: 'test' })).toBe(true)
      expect(isObject({ nested: { value: 42 } })).toBe(true)
      expect(isObject(new Date())).toBe(true)
      expect(isObject(/regex/)).toBe(true)
    })

    test('should return false for non-objects', () => {
      expect(isObject([])).toBe(false)
      expect(isObject('hello')).toBe(false)
      expect(isObject(42)).toBe(false)
      expect(isObject(true)).toBe(false)
      expect(isObject(null)).toBe(false)
      expect(isObject(undefined)).toBe(false)
      expect(isObject(() => {})).toBe(false)
    })

    test('should narrow type correctly', () => {
      const value: unknown = { name: 'test', age: 25 }

      if (isObject(value)) {
        expectTypeOf(value).toEqualTypeOf<object>()
        expect(typeof value).toBe('object')
        expect(value).not.toBeNull()
      }
    })

    test('should narrow type correctly with specific object type', () => {
      interface User {
        name: string
        age: number
      }

      const value: unknown = { name: 'test', age: 25 }

      if (isObject<User>(value)) {
        expectTypeOf(value).toEqualTypeOf<User>()
        expect(value.name).toBe('test')
        expect(value.age).toBe(25)
      }
    })

    test('should work with complex object types', () => {
      const value: unknown = {
        users: [{ name: 'John' }],
        count: 1,
      }

      if (isObject(value)) {
        expectTypeOf(value).toEqualTypeOf<object>()
        expect(typeof value).toBe('object')
        expect(value).not.toBeNull()
      }
    })
  })
})

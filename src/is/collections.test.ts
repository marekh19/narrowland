import { describe, expect, expectTypeOf, test } from 'vitest'

import {
  isArray,
  isLiteral,
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

  describe('isLiteral', () => {
    const obj = { some: 'thing' }
    type Value = 'a' | 'b' | 1 | 2 | { some: string } | readonly ['some']
    const literals = ['a', 'b', 1, 2, obj, ['some']] as const

    test('should return true when value is in allowed literals', () => {
      expect(isLiteral('a' as Value, literals)).toBe(true)
      expect(isLiteral('b' as Value, literals)).toBe(true)
      expect(isLiteral(1 as Value, literals)).toBe(true)
      expect(isLiteral(2 as Value, literals)).toBe(true)
      expect(isLiteral(obj as Value, literals)).toBe(true)
    })

    test('should return false when value is not in allowed literals', () => {
      expect(isLiteral('c' as unknown, literals)).toBe(false)
      expect(isLiteral(3 as unknown, literals)).toBe(false)
      expect(isLiteral({ some: 'some' } as unknown, literals)).toBe(false)
      expect(isLiteral({ thing: 'some' } as unknown, literals)).toBe(false)
      expect(isLiteral({} as unknown, literals)).toBe(false)
    })

    test('should be case-sensitive', () => {
      expect(isLiteral('Foo' as 'foo', ['foo'])).toBe(false)
      expect(isLiteral('foo', ['foo'])).toBe(true)
    })

    test('should return false for empty allowed list', () => {
      expect(isLiteral('any', [])).toBe(false)
    })

    test('should narrow type to provided literal union', () => {
      const value = 'a' as unknown

      if (isLiteral(value, literals)) {
        expectTypeOf(value).toEqualTypeOf<
          | 'a'
          | 1
          | 2
          | {
              some: string
            }
          | 'b'
          | readonly ['some']
        >()
        expect(value).toBe('a')
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

    test('should return false for any non-string value', () => {
      const literals = ['a', 'b'] as const
      expect(isStringLiteral(false, literals)).toBe(false)
      expect(isStringLiteral([], literals)).toBe(false)
      expect(isStringLiteral({}, literals)).toBe(false)
      expect(isStringLiteral(1, literals)).toBe(false)
      expect(isStringLiteral(true, literals)).toBe(false)
      expect(isStringLiteral(null, literals)).toBe(false)
      expect(isStringLiteral(undefined, literals)).toBe(false)
    })

    test('should narrow type to provided literal union', () => {
      const value = 'a' as unknown

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

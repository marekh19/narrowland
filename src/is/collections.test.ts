import { describe, expect, expectTypeOf, test } from 'vitest'

import {
  isArray,
  isNonEmptyArray,
  isObject,
  isOneOf,
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

  describe('isOneOf', () => {
    test('should return true when value is in collection (strings)', () => {
      const collection = ['a', 'b', 'c'] as const
      expect(isOneOf('a', ['a', 'd'])).toBe(true)
      expect(isOneOf('b', collection)).toBe(true)
      expect(isOneOf('c', collection)).toBe(true)
    })

    test('should return true when value is in collection (numbers)', () => {
      const collection = [1, 2, 3] as const
      expect(isOneOf(1, collection)).toBe(true)
      expect(isOneOf(2, collection)).toBe(true)
      expect(isOneOf(3, collection)).toBe(true)
    })

    test('should return true when value is in collection (mixed types)', () => {
      type Literal = 'a' | 1 | true | null
      const collection = ['a', 1, true, null] as const

      expect(isOneOf('a' as Literal, collection)).toBe(true)
      expect(isOneOf(1 as Literal, collection)).toBe(true)
      expect(isOneOf(true as Literal, collection)).toBe(true)
      expect(isOneOf(null as Literal, collection)).toBe(true)
    })

    test('should return true when value is in collection (objects)', () => {
      type Literal = { a: number } | { b: number }
      const obj1 = { a: 1 }
      const obj2 = { b: 2 }
      const collection = [obj1, obj2] as const
      expect(isOneOf(obj1 as Literal, collection)).toBe(true)
      expect(isOneOf(obj2 as Literal, collection)).toBe(true)
    })

    test('should return true when value is in collection (arrays)', () => {
      const arr1 = [1, 2]
      const arr2 = [3, 4]
      const collection = [arr1, arr2] as const
      expect(isOneOf(arr1, collection)).toBe(true)
      expect(isOneOf(arr2, collection)).toBe(true)
    })

    test('should return false when value is not in collection', () => {
      const collection = ['a', 'b', 'c'] as const
      expect(isOneOf('d', collection)).toBe(false)
      expect(isOneOf('ab', collection)).toBe(false)
      expect(isOneOf('', collection)).toBe(false)
    })

    test('should return false for empty collection', () => {
      const collection = [] as const
      expect(isOneOf('any', collection)).toBe(false)
      expect(isOneOf(1, collection)).toBe(false)
      expect(isOneOf(null, collection)).toBe(false)
    })

    test('should be case-sensitive for strings', () => {
      const collection = ['foo', 'bar'] as const
      expect(isOneOf('Foo', collection)).toBe(false)
      expect(isOneOf('FOO', collection)).toBe(false)
      expect(isOneOf('foo', collection)).toBe(true)
    })

    test('should handle null and undefined correctly', () => {
      type LiteralWithNull = 'a' | null | 'b'
      const collectionWithNull = ['a', null, 'b'] as const
      expect(isOneOf(null as LiteralWithNull, collectionWithNull)).toBe(true)
      expect(
        isOneOf(undefined as unknown as LiteralWithNull, collectionWithNull),
      ).toBe(false)

      type LiteralWithUndefined = 'a' | undefined | 'b'
      const collectionWithUndefined = ['a', undefined, 'b'] as const
      expect(
        isOneOf(undefined as LiteralWithUndefined, collectionWithUndefined),
      ).toBe(true)
      expect(
        isOneOf(
          null as unknown as LiteralWithUndefined,
          collectionWithUndefined,
        ),
      ).toBe(false)
    })

    test('should handle boolean values correctly', () => {
      const collection = [true, false] as const
      expect(isOneOf(true, collection)).toBe(true)
      expect(isOneOf(false, collection)).toBe(true)
      expect(isOneOf(1 as unknown as boolean, collection)).toBe(false)
      expect(isOneOf(0 as unknown as boolean, collection)).toBe(false)
    })

    test('should handle number values correctly', () => {
      const collection = [0, 1, -1, 42] as const
      expect(isOneOf(0, collection)).toBe(true)
      expect(isOneOf(1, collection)).toBe(true)
      expect(isOneOf(-1, collection)).toBe(true)
      expect(isOneOf(42, collection)).toBe(true)
      expect(isOneOf(2, collection)).toBe(false)
      expect(isOneOf(0.0, collection)).toBe(true)
    })

    test('should return false for similar but different objects', () => {
      const obj1 = { a: 1 }
      const obj2 = { a: 1 }
      const collection = [obj1] as const
      expect(isOneOf(obj1, collection)).toBe(true)
      expect(isOneOf(obj2, collection)).toBe(false) // Different object reference
    })

    test('should return false for similar but different arrays', () => {
      const arr1 = [1, 2]
      const arr2 = [1, 2]
      const collection = [arr1] as const
      expect(isOneOf(arr1, collection)).toBe(true)
      expect(isOneOf(arr2, collection)).toBe(false) // Different array reference
    })

    test('should narrow type correctly for string literals', () => {
      const value = 'a' as unknown
      const collection = ['a', 'b', 'c'] as const

      if (isOneOf(value, collection)) {
        expectTypeOf(value).toEqualTypeOf<'a' | 'b' | 'c'>()
        expect(typeof value).toBe('string')
        expect(value).toBe('a')
      }
    })

    test('should narrow type correctly for number literals', () => {
      const value = 1 as unknown
      const collection = [1, 2, 3] as const

      if (isOneOf(value, collection)) {
        expectTypeOf(value).toEqualTypeOf<1 | 2 | 3>()
        expect(typeof value).toBe('number')
        expect(value).toBe(1)
      }
    })

    test('should narrow type correctly for mixed types', () => {
      const value = 'a' as unknown
      const collection = ['a', 1, true, null] as const

      if (isOneOf(value, collection)) {
        expectTypeOf(value).toEqualTypeOf<'a' | 1 | true | null>()
        expect(value).toBe('a')
      }
    })

    test('should narrow type correctly for boolean literals', () => {
      const value = true as unknown
      const collection = [true, false] as const

      if (isOneOf(value, collection)) {
        expectTypeOf(value).toEqualTypeOf<true | false>()
        expect(typeof value).toBe('boolean')
        expect(value).toBe(true)
      }
    })

    test('should narrow type correctly with empty collection', () => {
      const value = 'any' as unknown
      const collection = [] as const

      if (isOneOf(value, collection)) {
        expectTypeOf(value).toEqualTypeOf<never>()
      }
    })

    test('should narrow type correctly in else branch', () => {
      const value = 'd' as unknown
      const collection = ['a', 'b', 'c'] as const

      if (isOneOf(value, collection)) {
        expectTypeOf(value).toEqualTypeOf<'a' | 'b' | 'c'>()
      } else {
        expectTypeOf(value).toEqualTypeOf<unknown>()
        expect(value).toBe('d')
      }
    })

    test('should work with readonly arrays', () => {
      const readonlyCollection: readonly string[] = ['a', 'b', 'c']
      expect(isOneOf('a', readonlyCollection)).toBe(true)
      expect(isOneOf('d', readonlyCollection)).toBe(false)
    })

    test('should work with regular arrays', () => {
      const regularCollection = ['a', 'b', 'c']
      expect(isOneOf('a', regularCollection)).toBe(true)
      expect(isOneOf('d', regularCollection)).toBe(false)
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

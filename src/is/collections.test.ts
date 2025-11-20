import { describe, expect, expectTypeOf, test } from 'vitest'

import {
  isArray,
  isArrayOf,
  isKeyOf,
  isNonEmptyArray,
  isObject,
  isOneOf,
  isPropertyOf,
  isStringLiteral,
} from './collections'
import { isDefined, isFalsy, isNotNull, isTruthy } from './existence'
import { isBoolean, isNonEmptyString, isNumber, isString } from './primitives'

describe('is/collections', () => {
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

  describe('isArrayOf', () => {
    test('should return false for non-arrays', () => {
      expect(isArrayOf('hello', isString)).toBe(false)
      expect(isArrayOf(42, isNumber)).toBe(false)
      expect(isArrayOf(true, isBoolean)).toBe(false)
      expect(isArrayOf(null, isDefined)).toBe(false)
      expect(isArrayOf(undefined, isNotNull)).toBe(false)
      expect(isArrayOf({ a: 1 }, isObject)).toBe(false)
    })

    test('should validate strings', () => {
      expect(isArrayOf(['a', 'b', 'c'], isString)).toBe(true)
      expect(isArrayOf(['a', 1 as unknown], isString)).toBe(false)
    })

    test('should validate non-empty strings', () => {
      expect(isArrayOf(['a', 'b'], isNonEmptyString)).toBe(true)
      expect(isArrayOf(['a', ''], isNonEmptyString)).toBe(false)
      expect(isArrayOf(['', ''], isNonEmptyString)).toBe(false)
    })

    test('should validate numbers (finite only)', () => {
      expect(isArrayOf([0, 1, 2.5], isNumber)).toBe(true)
      expect(isArrayOf([1, Number.POSITIVE_INFINITY], isNumber)).toBe(false)
      expect(isArrayOf([1, NaN], isNumber)).toBe(false)
    })

    test('should validate booleans', () => {
      expect(isArrayOf([true, false, true], isBoolean)).toBe(true)
      expect(isArrayOf([true, 1 as unknown], isBoolean)).toBe(false)
    })

    test('should validate defined (exclude null and undefined)', () => {
      expect(isArrayOf([0, '', false], isDefined)).toBe(true)
      expect(isArrayOf([null], isDefined)).toBe(false)
      expect(isArrayOf([undefined], isDefined)).toBe(false)
      expect(isArrayOf([1, undefined] as unknown[], isDefined)).toBe(false)
    })

    test('should validate notNull (exclude only null)', () => {
      expect(isArrayOf([undefined, 1] as unknown[], isNotNull)).toBe(true)
      expect(isArrayOf([null], isNotNull)).toBe(false)
      expect(isArrayOf([null, undefined] as unknown[], isNotNull)).toBe(false)
    })

    test('should validate truthy', () => {
      expect(isArrayOf([1, 'a', true], isTruthy)).toBe(true)
      expect(isArrayOf([1, 0] as unknown[], isTruthy)).toBe(false)
      expect(isArrayOf(['', 'a'] as unknown[], isTruthy)).toBe(false)
    })

    test('should validate falsy', () => {
      expect(isArrayOf([0, '', false, null, undefined], isFalsy)).toBe(true)
      expect(isArrayOf([0, 1] as unknown[], isFalsy)).toBe(false)
      expect(isArrayOf(['', 'a'] as unknown[], isFalsy)).toBe(false)
    })

    test('should validate arrays of arrays', () => {
      expect(isArrayOf([[1], [2, 3]], isArray)).toBe(true)
      expect(isArrayOf([[1], []], isNonEmptyArray)).toBe(false)
      expect(isArrayOf([[1], ['a']], isArray)).toBe(true)
      expect(isArrayOf([1, [2]] as unknown[], isArray)).toBe(false)
    })

    test('should validate arrays of non-empty arrays', () => {
      expect(isArrayOf([[1], ['a']], isNonEmptyArray)).toBe(true)
      expect(isArrayOf([[]] as unknown[], isNonEmptyArray)).toBe(false)
    })

    test('should validate objects (non-null, not arrays)', () => {
      expect(isArrayOf([{}, { a: 1 }], isObject)).toBe(true)
      expect(isArrayOf([null] as unknown[], isObject)).toBe(false)
      expect(isArrayOf([[1]] as unknown[], isObject)).toBe(false)
    })

    test('should work with oneOf guard via wrapper', () => {
      const isOneOf123 = (v: unknown): v is 1 | 2 | 3 =>
        isOneOf(v, [1, 2, 3] as const)
      expect(isArrayOf([1, 2, 3], isOneOf123)).toBe(true)
      expect(isArrayOf([1, 4] as unknown[], isOneOf123)).toBe(false)
    })

    test('should narrow type for string arrays', () => {
      const value: unknown = ['x', 'y']

      if (isArrayOf(value, isString)) {
        expectTypeOf(value).toEqualTypeOf<string[]>()
        expect(value[0].toUpperCase()).toBe('X')
      }
    })

    test('should narrow type for number arrays', () => {
      const value: unknown = [1, 2, 3]

      if (isArrayOf(value, isNumber)) {
        expectTypeOf(value).toEqualTypeOf<number[]>()
        expect(value.reduce((a, b) => a + b, 0)).toBe(6)
      }
    })

    test('should narrow type using custom guard', () => {
      type User = { id: number; name: string }
      const isUser = (v: unknown): v is User =>
        isObject(v) &&
        typeof (v as { id: unknown }).id === 'number' &&
        typeof (v as { name: unknown }).name === 'string'

      const value: unknown = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ]

      if (isArrayOf(value, isUser)) {
        expectTypeOf(value).toEqualTypeOf<User[]>()
        expect(value[0].name).toBe('John')
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

  describe('isPropertyOf', () => {
    describe('happy paths', () => {
      test('should return true when property matches predicate (string)', () => {
        const hasName = isPropertyOf('name', isString)
        expect(hasName({ name: 'John' })).toBe(true)
        expect(hasName({ name: 'Jane', age: 30 })).toBe(true)
      })

      test('should return true when property matches predicate (number)', () => {
        const hasAge = isPropertyOf('age', isNumber)
        expect(hasAge({ age: 25 })).toBe(true)
        expect(hasAge({ age: 0 })).toBe(true)
        expect(hasAge({ age: -5 })).toBe(true)
      })

      test('should return true when property matches predicate (boolean)', () => {
        const hasActive = isPropertyOf('active', isBoolean)
        expect(hasActive({ active: true })).toBe(true)
        expect(hasActive({ active: false })).toBe(true)
      })

      test('should return true when property matches predicate (non-empty string)', () => {
        const hasNonEmptyName = isPropertyOf('name', isNonEmptyString)
        expect(hasNonEmptyName({ name: 'John' })).toBe(true)
        expect(hasNonEmptyName({ name: 'a' })).toBe(true)
      })

      test('should return true when property matches predicate (defined)', () => {
        const hasDefinedId = isPropertyOf('id', isDefined)
        expect(hasDefinedId({ id: 0 })).toBe(true)
        expect(hasDefinedId({ id: '' })).toBe(true)
        expect(hasDefinedId({ id: false })).toBe(true)
      })

      test('should work with nested objects', () => {
        const hasNestedName = isPropertyOf(
          'user',
          (v): v is { name: string } =>
            isObject(v) && isString((v as { name: unknown }).name),
        )
        expect(hasNestedName({ user: { name: 'John' } })).toBe(true)
      })
    })

    describe('sad paths', () => {
      test('should return false when property does not exist', () => {
        const hasName = isPropertyOf('name', isString)
        expect(hasName({})).toBe(false)
        expect(hasName({ age: 30 } as { name?: unknown })).toBe(false)
      })

      test('should return false when property is wrong type (string vs number)', () => {
        const hasAge = isPropertyOf('age', isNumber)
        expect(hasAge({ age: '25' as unknown })).toBe(false)
        expect(hasAge({ age: null })).toBe(false)
        expect(hasAge({ age: undefined })).toBe(false)
      })

      test('should return false when property is wrong type (number vs string)', () => {
        const hasName = isPropertyOf('name', isString)
        expect(hasName({ name: 123 as unknown })).toBe(false)
        expect(hasName({ name: null })).toBe(false)
        expect(hasName({ name: undefined })).toBe(false)
      })

      test('should return false when property is empty string for non-empty predicate', () => {
        const hasNonEmptyName = isPropertyOf('name', isNonEmptyString)
        expect(hasNonEmptyName({ name: '' })).toBe(false)
      })

      test('should return false when property is null/undefined for defined predicate', () => {
        const hasDefinedId = isPropertyOf('id', isDefined)
        expect(hasDefinedId({ id: null })).toBe(false)
        expect(hasDefinedId({ id: undefined })).toBe(false)
      })

      test('should return false when property is NaN or Infinity for number predicate', () => {
        const hasAge = isPropertyOf('age', isNumber)
        expect(hasAge({ age: NaN })).toBe(false)
        expect(hasAge({ age: Number.POSITIVE_INFINITY })).toBe(false)
        expect(hasAge({ age: Number.NEGATIVE_INFINITY })).toBe(false)
      })

      test('should throw when object is null/undefined (accessing property)', () => {
        const hasName = isPropertyOf('name', isString)
        expect(() => hasName(null as unknown as { name?: string })).toThrow()
        expect(() =>
          hasName(undefined as unknown as { name?: string }),
        ).toThrow()
      })
    })

    describe('type narrowing', () => {
      test('should narrow property type to string', () => {
        type User = { name?: string | number | null }
        const user: User = { name: 'John' }
        const hasName = isPropertyOf('name', isString)

        if (hasName(user)) {
          expectTypeOf(user.name).toEqualTypeOf<string>()
          expect(user.name.toUpperCase()).toBe('JOHN')
        }
      })

      test('should narrow property type to number', () => {
        type Product = { price?: string | number | null }
        const product: Product = { price: 99.99 }
        const hasPrice = isPropertyOf('price', isNumber)

        if (hasPrice(product)) {
          expectTypeOf(product.price).toEqualTypeOf<number>()
          expect(product.price.toFixed(2)).toBe('99.99')
        }
      })

      test('should narrow property type to boolean', () => {
        type Item = { name: string; isInStock?: unknown }
        const item: Item = { name: 'item' }
        const isInStock = isPropertyOf('isInStock', isBoolean)

        if (isInStock(item)) {
          expectTypeOf(item.isInStock).toEqualTypeOf<boolean>()
          expect(item.name).toBeDefined()
          expect(item.isInStock).not.toBeDefined()
        }
      })

      test('should narrow property type to non-empty string', () => {
        type Item = { title?: string | null }
        const item: Item = { title: 'Hello' }
        const hasTitle = isPropertyOf('title', isNonEmptyString)

        if (hasTitle(item)) {
          expectTypeOf(item.title).toEqualTypeOf<string>()
          expect(item.title.length).toBeGreaterThan(0)
        }
      })

      test('should narrow property type to defined value', () => {
        type Item = { id?: string | null | undefined }
        const item: Item = { id: '123' }
        const hasId = isPropertyOf('id', isDefined)

        if (hasId(item)) {
          expectTypeOf(item.id).toEqualTypeOf<string>()
          expect(item.id).toBe('123')
        }
      })

      test('should preserve other properties in narrowed type', () => {
        type User = { name?: string | number; age: number }
        const user: User = { name: 'John', age: 30 }
        const hasName = isPropertyOf('name', isString)

        if (hasName(user)) {
          expectTypeOf(user.name).toEqualTypeOf<string>()
          expectTypeOf(user.age).toEqualTypeOf<number>()
          expect(user.age).toBe(30)
        }
      })
    })

    describe('real-world examples - filtering arrays', () => {
      test('should filter array of objects by string property', () => {
        type User = { name?: string | null; role: string }
        const users: User[] = [
          { name: 'John', role: 'admin' },
          { name: null, role: 'user' },
          { name: 'Jane', role: 'admin' },
          { role: 'user' },
          { name: 'Bob', role: 'user' },
        ]

        const hasName = isPropertyOf('name', isString)
        const usersWithNames = users.filter(hasName)

        expect(usersWithNames).toHaveLength(3)
        expect(usersWithNames.map((u) => u.name)).toEqual([
          'John',
          'Jane',
          'Bob',
        ])

        // Type check: all filtered items should have name as string
        usersWithNames.forEach((user) => {
          expectTypeOf(user.name).toEqualTypeOf<string>()
          expect(typeof user.name).toBe('string')
        })
      })

      test('should filter array of objects by number property', () => {
        type Product = { price?: number | string | null; category: string }
        const products: Product[] = [
          { price: 19.99, category: 'electronics' },
          { price: null, category: 'books' },
          { price: 29.99, category: 'electronics' },
          { category: 'clothing' },
          {
            price: 'free' as unknown as number | string | null,
            category: 'promo',
          },
        ]

        const hasPrice = isPropertyOf('price', isNumber)
        const productsWithPrices = products.filter(hasPrice)

        expect(productsWithPrices).toHaveLength(2)
        expect(productsWithPrices.map((p) => p.price)).toEqual([19.99, 29.99])

        // Type check: all filtered items should have price as number
        productsWithPrices.forEach((product) => {
          expectTypeOf(product.price).toEqualTypeOf<number>()
          expect(typeof product.price).toBe('number')
        })
      })

      test('should filter array of objects by non-empty string property', () => {
        type Post = { title?: string; published: boolean }
        const posts: Post[] = [
          { title: 'Hello World', published: true },
          { title: '', published: false },
          { title: 'Another Post', published: true },
          { published: false },
        ]

        const hasTitle = isPropertyOf('title', isNonEmptyString)
        const publishedPosts = posts.filter(hasTitle)

        expect(publishedPosts).toHaveLength(2)
        expect(publishedPosts.map((p) => p.title)).toEqual([
          'Hello World',
          'Another Post',
        ])

        // Type check: all filtered items should have title as non-empty string
        publishedPosts.forEach((post) => {
          expectTypeOf(post.title).toEqualTypeOf<string>()
          expect(post.title.length).toBeGreaterThan(0)
        })
      })

      test('should filter array of objects by defined property', () => {
        type Item = { ownerId?: string | null; status: string }
        const items: Item[] = [
          { ownerId: 'user1', status: 'active' },
          { ownerId: null, status: 'pending' },
          { ownerId: 'user2', status: 'active' },
          { status: 'inactive' },
          { ownerId: undefined, status: 'pending' },
        ]

        const hasOwnerId = isPropertyOf('ownerId', isDefined)
        const itemsWithOwner = items.filter(hasOwnerId)

        expect(itemsWithOwner).toHaveLength(2)
        expect(itemsWithOwner.map((i) => i.ownerId)).toEqual(['user1', 'user2'])

        // Type check: all filtered items should have ownerId as defined
        itemsWithOwner.forEach((item) => {
          expectTypeOf(item.ownerId).toEqualTypeOf<string>()
          expect(item.ownerId).toBeDefined()
          expect(item.ownerId).not.toBeNull()
        })
      })

      test('should filter array of objects with complex predicate', () => {
        type User = { email?: string | null; verified: boolean }
        const users: User[] = [
          { email: 'john@example.com', verified: true },
          { email: 'invalid', verified: false },
          { email: 'jane@example.com', verified: true },
          { verified: false },
          { email: null, verified: false },
        ]

        const hasValidEmail = isPropertyOf(
          'email',
          (v): v is string => isString(v) && v.includes('@'),
        )
        const usersWithValidEmail = users.filter(hasValidEmail)

        expect(usersWithValidEmail).toHaveLength(2)
        expect(usersWithValidEmail.map((u) => u.email)).toEqual([
          'john@example.com',
          'jane@example.com',
        ])

        // Type check: all filtered items should have email as string
        usersWithValidEmail.forEach((user) => {
          expectTypeOf(user.email).toEqualTypeOf<string>()
          expect(user.email).toContain('@')
        })
      })

      test('should filter array of objects with multiple property checks', () => {
        type Order = {
          customerId?: string | null
          total?: number | null
          status: string
        }
        const orders: Order[] = [
          { customerId: 'c1', total: 100, status: 'pending' },
          { customerId: 'c2', total: null, status: 'pending' },
          { customerId: null, total: 200, status: 'completed' },
          { total: 150, status: 'pending' },
          { customerId: 'c3', total: 300, status: 'completed' },
        ]

        const hasCustomerId = isPropertyOf('customerId', isString)
        const hasTotal = isPropertyOf('total', isNumber)

        const ordersWithCustomer = orders.filter(hasCustomerId)
        const ordersWithTotal = orders.filter(hasTotal)
        const ordersWithBoth = orders.filter(
          (o) => hasCustomerId(o) && hasTotal(o),
        )

        expect(ordersWithCustomer).toHaveLength(3) // c1, c2, c3
        expect(ordersWithTotal).toHaveLength(4) // 100, 200, 150, 300
        expect(ordersWithBoth).toHaveLength(2) // c1+100, c3+300

        // Type check: filtered items should have narrowed types
        ordersWithBoth.forEach((order) => {
          expectTypeOf(order.customerId).toEqualTypeOf<string>()
          expectTypeOf(order.total).toEqualTypeOf<number>()
        })
      })
    })
  })

  describe('isKeyOf', () => {
    describe('happy paths', () => {
      test('should return true for a string key if present in object', () => {
        const obj = { a: 'a' } as const
        expect(isKeyOf('a', obj)).toBe(true)
      })

      test('should return true for a number key if present in object', () => {
        const obj = { 1: 'a' } as const
        expect(isKeyOf(1, obj)).toBe(true)
        // in case of number keys for as well for stringified number
        expect(isKeyOf((1).toString(), obj)).toBe(true)
        expect(isKeyOf('1', obj)).toBe(true)
      })

      test('should return true for a unique symbol key if present in object', () => {
        const symbol = Symbol('a')
        const obj = { [symbol]: 'a' } as const
        expect(isKeyOf(symbol, obj)).toBe(true)
      })

      test('should return true for a global symbol key if present in object', () => {
        const symbol = Symbol.for('a')
        const obj = { [symbol]: 'a' }
        expect(isKeyOf(Symbol.for('a'), obj)).toBe(true)
      })

      test('should return true for own properties but not inherited ones', () => {
        const proto = { inherited: 'value' } as const
        const obj = Object.assign(Object.create(proto), { own: 'own' } as const)

        expect(isKeyOf('own', obj)).toBe(true)
        expect(isKeyOf('inherited', obj)).toBe(false)
      })

      test('should work with objects created with null prototype', () => {
        const obj = Object.assign(Object.create(null), { safe: true })
        expect(isKeyOf('safe', obj)).toBe(true)
        expect(isKeyOf('missing', obj)).toBe(false)
      })
    })

    describe('sad paths', () => {
      test('should return false if string key not present in object', () => {
        const obj = { a: 'a' } as const
        expect(isKeyOf('b', obj)).toBe(false)
      })

      test('should return false if number key not present in object', () => {
        const obj = { 1: 'a' } as const
        expect(isKeyOf(2, obj)).toBe(false)
      })

      test('should return false if symbol key not present in object', () => {
        const symbol = Symbol('a')
        const obj = { [Symbol('a')]: 'a' } as const
        expect(isKeyOf(symbol, obj)).toBe(false)
      })

      test('should return false if string key is not matching casing', () => {
        const obj = { a: 'a' } as const
        expect(isKeyOf('A', obj)).toBe(false)
      })

      test('should throw when record is null or undefined', () => {
        const obj1 = null as unknown as Record<string, string>
        const obj2 = undefined as unknown as Record<string, string>
        expect(() => isKeyOf('foo', obj1)).toThrow()
        expect(() => isKeyOf('foo', obj2)).toThrow()
      })
    })

    describe('type narrowing', () => {
      test('should narrow PropertyKey to keyof record', () => {
        const record = { foo: 1, bar: 2 } as const
        const key: PropertyKey = 'foo'

        if (isKeyOf(key, record)) {
          expectTypeOf(key).toEqualTypeOf<'foo' | 'bar'>()
          expect(record[key]).toBe(1)
        }
      })

      test('should narrow string to keyof record', () => {
        const record = { click: 'click', submit: 'submit' } as const
        const key: string = 'click'

        if (isKeyOf(key, record)) {
          expectTypeOf(key).toEqualTypeOf<'click' | 'submit'>()
          expect(record[key]).toBe('click')
        }
      })

      test('should narrow string to keyof readonly record', () => {
        const record: Readonly<Record<'click' | 'submit', string>> = {
          click: 'click',
          submit: 'submit',
        }
        const key: string = 'click'

        if (isKeyOf(key, record)) {
          expectTypeOf(key).toEqualTypeOf<'click' | 'submit'>()
          expect(record[key]).toBe('click')
        }
      })

      test('should narrow union of potential keys down to actual keys', () => {
        const record = { foo: 1, bar: 2 } as const

        // Test when key exists
        const key1 = 'foo' as 'foo' | 'baz'
        if (isKeyOf(key1, record)) {
          expectTypeOf(key1).toEqualTypeOf<'foo'>()
          expect(record[key1]).toBe(1)
        }

        // Test when key doesn't exist
        const key2 = 'baz' as 'foo' | 'baz' | 'boo'
        if (isKeyOf(key2, record)) {
          // This branch won't execute since 'baz' is not a key
          expectTypeOf(key2).toEqualTypeOf<'foo'>()
          expect.fail('Should not reach here')
        } else {
          // In else branch, type should be 'baz' or 'boo' since we extracted out the common literal = we know it can't be 'foo'
          expectTypeOf(key2).toEqualTypeOf<'baz' | 'boo'>()
          expect(key2).toBe('baz')
        }
      })

      test('should narrow numeric keys correctly', () => {
        const record = { 0: 'zero', 1: 'one', other: 'other' } as const

        // Test when key exists - type narrowing allows safe access
        const key1 = 0 as 0 | 1 | 2
        if (isKeyOf(key1, record)) {
          // Type is narrowed to allow safe access (0 | 1, excluding 2 and 'other')
          expectTypeOf(record[key1]).toEqualTypeOf<'zero' | 'one'>()
          expect(record[key1]).toBe('zero')
          // Verify we can access both numeric keys
          if (key1 === 0) {
            expectTypeOf(record[key1]).toEqualTypeOf<'zero'>()
            expect(record[key1]).toBe('zero')
          } else {
            expectTypeOf(record[key1]).toEqualTypeOf<'one'>()
            expect(record[key1]).toBe('one')
          }
        }

        // Test when key doesn't exist
        const key2 = 2 as 0 | 1 | 2
        if (isKeyOf(key2, record)) {
          expectTypeOf(key2).toEqualTypeOf<0 | 1>()
          expect.fail('Should not reach here')
        } else {
          // In else branch, type should remain as original union
          expectTypeOf(key2).toEqualTypeOf<2>()
          expect(key2).toBe(2)
        }

        if (!isKeyOf(key2, record)) {
          expectTypeOf(key2).toEqualTypeOf<2>()
          expect(key2).toBe(2)
        }
      })
    })

    describe('real world scenarios', () => {
      test('should safely access configuration flags', () => {
        const featureFlags = {
          enableCheckout: true,
          enableBeta: false,
        } as const

        const incomingFlag = 'enableCheckout' as string
        if (isKeyOf(incomingFlag, featureFlags)) {
          expectTypeOf(incomingFlag).toEqualTypeOf<
            'enableCheckout' | 'enableBeta'
          >()
          expect(typeof featureFlags[incomingFlag]).toBe('boolean')
          expect(featureFlags[incomingFlag]).toBe(true)
        }
      })

      test('should guard dynamic access when dispatching event handlers', () => {
        const handlers = {
          click: () => 'clicked',
          submit: () => 'submitted',
        } as const

        const events = ['click', 'keydown', 'submit']
        const results = [] as string[]

        for (const eventName of events) {
          if (isKeyOf(eventName, handlers)) {
            expectTypeOf(eventName).toEqualTypeOf<'click' | 'submit'>()
            results.push(handlers[eventName]())
          }
        }

        expect(results).toEqual(['clicked', 'submitted'])
      })

      test('should filter object entries by safe keys', () => {
        const translations = {
          hello: 'Hello',
          goodbye: 'Goodbye',
        } as const

        const requestedKeys = ['hello', 'missing'] as const
        const available = requestedKeys.filter((key) =>
          isKeyOf(key, translations),
        )
        const first = available[0]

        expectTypeOf(available).toEqualTypeOf<'hello'[]>()
        expect(available).toEqual(['hello'])
        expectTypeOf(first).toEqualTypeOf<'hello'>()
        expect(first).toBe('hello')
      })
    })
  })
})

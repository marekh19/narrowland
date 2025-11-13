import { describe, expect, expectTypeOf, test } from 'vitest'
import { isArray, isNonEmptyArray, isObject, isOneOf } from '../is/collections'
import { isDefined, isFalsy, isNotNull, isTruthy } from '../is/existence'
import {
  isBoolean,
  isNonEmptyString,
  isNumber,
  isString,
} from '../is/primitives'
import {
  assertArray,
  assertArrayOf,
  assertNonEmptyArray,
  assertObject,
  assertOneOf,
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

  describe('assertArrayOf', () => {
    test('should throw for non-arrays', () => {
      expect(() => assertArrayOf('hello', isString)).toThrow(
        'Expected an array of valid items',
      )
      expect(() => assertArrayOf(42, isNumber)).toThrow(
        'Expected an array of valid items',
      )
      expect(() => assertArrayOf(true, isBoolean)).toThrow(
        'Expected an array of valid items',
      )
      expect(() => assertArrayOf(null, isDefined)).toThrow(
        'Expected an array of valid items',
      )
      expect(() => assertArrayOf(undefined, isNotNull)).toThrow(
        'Expected an array of valid items',
      )
      expect(() => assertArrayOf({ a: 1 }, isObject)).toThrow(
        'Expected an array of valid items',
      )
    })

    test('should validate strings', () => {
      expect(() => assertArrayOf(['a', 'b', 'c'], isString)).not.toThrow()
      expect(() => assertArrayOf(['a', 1 as unknown], isString)).toThrow()
    })

    test('should validate non-empty strings', () => {
      expect(() => assertArrayOf(['a', 'b'], isNonEmptyString)).not.toThrow()
      expect(() => assertArrayOf(['a', ''], isNonEmptyString)).toThrow()
      expect(() => assertArrayOf(['', ''], isNonEmptyString)).toThrow()
    })

    test('should validate numbers (finite only)', () => {
      expect(() => assertArrayOf([0, 1, 2.5], isNumber)).not.toThrow()
      expect(() =>
        assertArrayOf([1, Number.POSITIVE_INFINITY], isNumber),
      ).toThrow()
      expect(() => assertArrayOf([1, NaN], isNumber)).toThrow()
    })

    test('should validate booleans', () => {
      expect(() => assertArrayOf([true, false, true], isBoolean)).not.toThrow()
      expect(() => assertArrayOf([true, 1 as unknown], isBoolean)).toThrow()
    })

    test('should validate defined (exclude null and undefined)', () => {
      expect(() => assertArrayOf([0, '', false], isDefined)).not.toThrow()
      expect(() => assertArrayOf([null], isDefined)).toThrow()
      expect(() => assertArrayOf([undefined], isDefined)).toThrow()
      expect(() =>
        assertArrayOf([1, undefined] as unknown[], isDefined),
      ).toThrow()
    })

    test('should validate notNull (exclude only null)', () => {
      expect(() =>
        assertArrayOf([undefined, 1] as unknown[], isNotNull),
      ).not.toThrow()
      expect(() => assertArrayOf([null], isNotNull)).toThrow()
      expect(() =>
        assertArrayOf([null, undefined] as unknown[], isNotNull),
      ).toThrow()
    })

    test('should validate truthy', () => {
      expect(() => assertArrayOf([1, 'a', true], isTruthy)).not.toThrow()
      expect(() => assertArrayOf([1, 0] as unknown[], isTruthy)).toThrow()
      expect(() => assertArrayOf(['', 'a'] as unknown[], isTruthy)).toThrow()
    })

    test('should validate falsy', () => {
      expect(() =>
        assertArrayOf([0, '', false, null, undefined], isFalsy),
      ).not.toThrow()
      expect(() => assertArrayOf([0, 1] as unknown[], isFalsy)).toThrow()
      expect(() => assertArrayOf(['', 'a'] as unknown[], isFalsy)).toThrow()
    })

    test('should validate arrays of arrays', () => {
      expect(() => assertArrayOf([[1], [2, 3]], isArray)).not.toThrow()
      expect(() => assertArrayOf([[1], []], isNonEmptyArray)).toThrow()
      expect(() => assertArrayOf([[1], ['a']], isArray)).not.toThrow()
      expect(() => assertArrayOf([1, [2]] as unknown[], isArray)).toThrow()
    })

    test('should validate arrays of non-empty arrays', () => {
      expect(() => assertArrayOf([[1], ['a']], isNonEmptyArray)).not.toThrow()
      expect(() => assertArrayOf([[]] as unknown[], isNonEmptyArray)).toThrow()
    })

    test('should validate objects (non-null, not arrays)', () => {
      expect(() => assertArrayOf([{}, { a: 1 }], isObject)).not.toThrow()
      expect(() => assertArrayOf([null] as unknown[], isObject)).toThrow()
      expect(() => assertArrayOf([[1]] as unknown[], isObject)).toThrow()
    })

    test('should work with oneOf guard via wrapper', () => {
      const isOneOf123 = (v: unknown): v is 1 | 2 | 3 =>
        isOneOf(v, [1, 2, 3] as const)
      expect(() => assertArrayOf([1, 2, 3], isOneOf123)).not.toThrow()
      expect(() => assertArrayOf([1, 4] as unknown[], isOneOf123)).toThrow()
    })

    test('should narrow type for string arrays', () => {
      const value: unknown = ['x', 'y']

      assertArrayOf(value, isString)

      expectTypeOf(value).toEqualTypeOf<string[]>()
      expect(value[0].toUpperCase()).toBe('X')
    })

    test('should narrow type for number arrays', () => {
      const value: unknown = [1, 2, 3]

      assertArrayOf(value, isNumber)

      expectTypeOf(value).toEqualTypeOf<number[]>()
      expect(value.reduce((a, b) => a + b, 0)).toBe(6)
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

      assertArrayOf(value, isUser)

      expectTypeOf(value).toEqualTypeOf<User[]>()
      expect(value[0].name).toBe('John')
    })

    test('should support custom error message', () => {
      expect(() =>
        assertArrayOf(
          [1, 'a'] as unknown[],
          isNumber,
          'All items must be numbers',
        ),
      ).toThrow('All items must be numbers')
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
        assertStringLiteral('a', ['a', 'b'], 'Invalid literal'),
      ).not.toThrow()
      expect(() =>
        assertStringLiteral('b', ['a', 'b'], 'Invalid literal'),
      ).not.toThrow()
    })

    test('should throw when value is not in allowed literals', () => {
      expect(() =>
        assertStringLiteral('c', ['a', 'b'], 'Invalid literal'),
      ).toThrow('Invalid literal')
      expect(() =>
        assertStringLiteral('abc', ['a', 'b'], 'Invalid literal'),
      ).toThrow('Invalid literal')
    })

    test('should be case-sensitive', () => {
      expect(() =>
        assertStringLiteral('Foo', ['foo'], 'Invalid literal'),
      ).toThrow('Invalid literal')
      expect(() =>
        assertStringLiteral('foo', ['foo'], 'Invalid literal'),
      ).not.toThrow()
    })

    test('should error with correct defualt error message', () => {
      expect(() => assertStringLiteral('d', ['a', 'b', 'c'])).toThrow(
        `Expected one of folowing values: a, b, c.`,
      )
    })

    test('should narrow type to provided literal union', () => {
      const value = 'a' as unknown
      expectTypeOf(value).toEqualTypeOf<unknown>()
      assertStringLiteral(value, ['a', 'b'], 'Invalid literal')
      expectTypeOf(value).toEqualTypeOf<'a' | 'b'>()
    })
  })

  describe('assertOneOf', () => {
    test('should not throw when value is in collection (strings)', () => {
      const collection = ['a', 'b', 'c'] as const
      expect(() => assertOneOf('a', collection)).not.toThrow()
      expect(() => assertOneOf('b', collection)).not.toThrow()
      expect(() => assertOneOf('c', collection)).not.toThrow()
    })

    test('should not throw when value is in collection (numbers)', () => {
      const collection = [1, 2, 3] as const
      expect(() => assertOneOf(1, collection)).not.toThrow()
      expect(() => assertOneOf(2, collection)).not.toThrow()
      expect(() => assertOneOf(3, collection)).not.toThrow()
    })

    test('should not throw when value is in collection (mixed types)', () => {
      type Literal = 'a' | 1 | true | null
      const collection = ['a', 1, true, null] as const
      expect(() => assertOneOf('a' as Literal, collection)).not.toThrow()
      expect(() => assertOneOf(1 as Literal, collection)).not.toThrow()
      expect(() => assertOneOf(true as Literal, collection)).not.toThrow()
      expect(() => assertOneOf(null as Literal, collection)).not.toThrow()
    })

    test('should not throw when value is in collection (objects)', () => {
      type Literal = { a: number } | { b: number }
      const obj1 = { a: 1 }
      const obj2 = { b: 2 }
      const collection = [obj1, obj2] as const
      expect(() => assertOneOf(obj1 as Literal, collection)).not.toThrow()
      expect(() => assertOneOf(obj2 as Literal, collection)).not.toThrow()
    })

    test('should not throw when value is in collection (arrays)', () => {
      const arr1 = [1, 2]
      const arr2 = [3, 4]
      const collection = [arr1, arr2] as const
      expect(() => assertOneOf(arr1, collection)).not.toThrow()
      expect(() => assertOneOf(arr2, collection)).not.toThrow()
    })

    test('should throw when value is not in collection', () => {
      const collection = ['a', 'b', 'c'] as const
      expect(() => assertOneOf('d', collection)).toThrow(
        'Expected one of folowing values: a, b, c.',
      )
      expect(() => assertOneOf('ab', collection)).toThrow(
        'Expected one of folowing values: a, b, c.',
      )
      expect(() => assertOneOf('', collection)).toThrow(
        'Expected one of folowing values: a, b, c.',
      )
    })

    test('should throw for empty collection', () => {
      const collection = [] as const
      expect(() => assertOneOf('any', collection)).toThrow(
        'Expected one of folowing values: .',
      )
      expect(() => assertOneOf(1, collection)).toThrow(
        'Expected one of folowing values: .',
      )
      expect(() => assertOneOf(null, collection)).toThrow(
        'Expected one of folowing values: .',
      )
    })

    test('should be case-sensitive for strings', () => {
      const collection = ['foo', 'bar'] as const
      expect(() => assertOneOf('Foo', collection)).toThrow(
        'Expected one of folowing values: foo, bar.',
      )
      expect(() => assertOneOf('FOO', collection)).toThrow(
        'Expected one of folowing values: foo, bar.',
      )
      expect(() => assertOneOf('foo', collection)).not.toThrow()
    })

    test('should handle null and undefined correctly', () => {
      type LiteralWithNull = 'a' | null | 'b'
      const collectionWithNull = ['a', null, 'b'] as const
      expect(() =>
        assertOneOf(null as LiteralWithNull, collectionWithNull),
      ).not.toThrow()
      expect(() =>
        assertOneOf(
          undefined as unknown as LiteralWithNull,
          collectionWithNull,
        ),
      ).toThrow('Expected one of folowing values: a, , b.')

      type LiteralWithUndefined = 'a' | undefined | 'b'
      const collectionWithUndefined = ['a', undefined, 'b'] as const
      expect(() =>
        assertOneOf(undefined as LiteralWithUndefined, collectionWithUndefined),
      ).not.toThrow()
      expect(() =>
        assertOneOf(
          null as unknown as LiteralWithUndefined,
          collectionWithUndefined,
        ),
      ).toThrow('Expected one of folowing values: a, , b.')
    })

    test('should handle boolean values correctly', () => {
      const collection = [true, false] as const
      expect(() => assertOneOf(true, collection)).not.toThrow()
      expect(() => assertOneOf(false, collection)).not.toThrow()
      expect(() => assertOneOf(1 as unknown as boolean, collection)).toThrow(
        'Expected one of folowing values: true, false.',
      )
      expect(() => assertOneOf(0 as unknown as boolean, collection)).toThrow(
        'Expected one of folowing values: true, false.',
      )
    })

    test('should handle number values correctly', () => {
      const collection = [0, 1, -1, 42] as const
      expect(() => assertOneOf(0, collection)).not.toThrow()
      expect(() => assertOneOf(1, collection)).not.toThrow()
      expect(() => assertOneOf(-1, collection)).not.toThrow()
      expect(() => assertOneOf(42, collection)).not.toThrow()
      expect(() => assertOneOf(2, collection)).toThrow(
        'Expected one of folowing values: 0, 1, -1, 42.',
      )
      expect(() => assertOneOf(0.0, collection)).not.toThrow()
    })

    test('should throw for similar but different objects', () => {
      const obj1 = { a: 1 }
      const obj2 = { a: 1 }
      const collection = [obj1] as const
      expect(() => assertOneOf(obj1, collection)).not.toThrow()
      expect(() => assertOneOf(obj2, collection)).toThrow(
        'Expected one of folowing values: [object Object].',
      )
    })

    test('should throw for similar but different arrays', () => {
      const arr1 = [1, 2]
      const arr2 = [1, 2]
      const collection = [arr1] as const
      expect(() => assertOneOf(arr1, collection)).not.toThrow()
      expect(() => assertOneOf(arr2, collection)).toThrow(
        'Expected one of folowing values: 1,2.',
      )
    })

    test('should throw with custom message', () => {
      type Literal = 'a' | 'b' | 'c'
      const collection = ['a', 'b', 'c'] as const
      expect(() =>
        assertOneOf('d', collection, 'Value must be one of allowed values'),
      ).toThrow('Value must be one of allowed values')
      expect(() =>
        assertOneOf(
          1 as unknown as Literal,
          collection,
          'Invalid value provided',
        ),
      ).toThrow('Invalid value provided')
    })

    test('should narrow type correctly for string literals', () => {
      const value = 'a' as unknown
      const collection = ['a', 'b', 'c'] as const

      assertOneOf(value, collection)

      expectTypeOf(value).toEqualTypeOf<'a' | 'b' | 'c'>()
      expect(typeof value).toBe('string')
      expect(value).toBe('a')
    })

    test('should narrow type correctly for number literals', () => {
      const value = 1 as unknown
      const collection = [1, 2, 3] as const

      assertOneOf(value, collection)

      expectTypeOf(value).toEqualTypeOf<1 | 2 | 3>()
      expect(typeof value).toBe('number')
      expect(value).toBe(1)
    })

    test('should narrow type correctly for mixed types', () => {
      const value = 'a' as unknown
      const collection = ['a', 1, true, null] as const

      assertOneOf(value, collection)

      expectTypeOf(value).toEqualTypeOf<'a' | 1 | true | null>()
      expect(value).toBe('a')
    })

    test('should narrow type correctly for boolean literals', () => {
      const value = true as unknown
      const collection = [true, false] as const

      assertOneOf(value, collection)

      expectTypeOf(value).toEqualTypeOf<true | false>()
      expect(typeof value).toBe('boolean')
      expect(value).toBe(true)
    })

    test('should narrow type correctly with empty collection', () => {
      const value = 'any' as unknown
      const collection = [] as const

      // This will throw, but TypeScript should narrow to never if it didn't
      expect(() => assertOneOf(value, collection)).toThrow()
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): string => {
        assertOneOf(value, ['a', 'b', 'c'] as const)
        return value.toUpperCase() // TypeScript knows this is 'a' | 'b' | 'c'
      }

      expect(processValue('a')).toBe('A')
      expect(() => processValue('d')).toThrow()
    })

    test('should work with readonly arrays', () => {
      const readonlyCollection: readonly string[] = ['a', 'b', 'c']
      expect(() => assertOneOf('a', readonlyCollection)).not.toThrow()
      expect(() => assertOneOf('d', readonlyCollection)).toThrow(
        'Expected one of folowing values: a, b, c.',
      )
    })

    test('should work with regular arrays', () => {
      const regularCollection = ['a', 'b', 'c']
      expect(() => assertOneOf('a', regularCollection)).not.toThrow()
      expect(() => assertOneOf('d', regularCollection)).toThrow(
        'Expected one of folowing values: a, b, c.',
      )
    })

    test('should narrow type correctly after assertion for tuple', () => {
      const value: unknown = 'hello'

      // Before assertion, type is unknown
      expectTypeOf(value).toEqualTypeOf<unknown>()

      assertOneOf(value, ['hello', 'world'] as const)

      // After assertion, type is narrowed
      expectTypeOf(value).toEqualTypeOf<'hello' | 'world'>()
      expect(value).toBe('hello')
    })

    test('should narrow type correctly after assertion for mutable array', () => {
      const value: unknown = 'hello'
      const collection = ['hello', 'world']

      // Before assertion, type is unknown
      expectTypeOf(value).toEqualTypeOf<unknown>()

      assertOneOf(value, collection)

      // After assertion, type is narrowed - no `as const` = no literals
      expectTypeOf(value).toEqualTypeOf<string>()
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

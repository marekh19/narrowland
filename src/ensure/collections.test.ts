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
  ensureArray,
  ensureArrayOf,
  ensureEmptyArray,
  ensureKeyOf,
  ensureNonEmptyArray,
  ensureObject,
  ensureOneOf,
} from './collections'

describe('ensure/collections', () => {
  describe('ensureArray', () => {
    test('should return the value for arrays', () => {
      const arr1: unknown[] = []
      expect(ensureArray(arr1)).toBe(arr1)
      const arr2 = [1, 2, 3]
      expect(ensureArray(arr2)).toBe(arr2)
      expect(ensureArray(['hello', 'world'])).toEqual(['hello', 'world'])
      expect(ensureArray([{}])).toEqual([{}])
      expect(ensureArray([null, undefined])).toEqual([null, undefined])
    })

    test('should throw for non-arrays', () => {
      expect(() => ensureArray({})).toThrow('Expected an array')
      expect(() => ensureArray('hello')).toThrow('Expected an array')
      expect(() => ensureArray(42)).toThrow('Expected an array')
      expect(() => ensureArray(true)).toThrow('Expected an array')
      expect(() => ensureArray(null)).toThrow('Expected an array')
      expect(() => ensureArray(undefined)).toThrow('Expected an array')
    })

    test('should throw EnsureError', () => {
      try {
        ensureArray({})
      } catch (e) {
        expect((e as Error).name).toBe('EnsureError')
      }
    })

    test('should throw with custom message', () => {
      expect(() => ensureArray({}, 'Value must be an array')).toThrow(
        'Value must be an array',
      )
    })

    test('should narrow type correctly', () => {
      const value: unknown = [1, 2, 3]
      const result = ensureArray(value)

      expectTypeOf(result).toEqualTypeOf<unknown[]>()
      expect(result.length).toBe(3)
      expect(result[0]).toBe(1)
    })

    test('should narrow type correctly with generic', () => {
      const value: unknown = ['hello', 'world']
      const result = ensureArray<string>(value)

      expectTypeOf(result).toEqualTypeOf<string[]>()
      expect(result[0].toUpperCase()).toBe('HELLO')
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): number => {
        return ensureArray(value).length
      }

      expect(processValue([1, 2, 3])).toBe(3)
      expect(() => processValue({})).toThrow()
    })
  })

  describe('ensureEmptyArray', () => {
    test('should return the value for empty arrays', () => {
      const arr: [] = []
      expect(ensureEmptyArray(arr)).toBe(arr)
    })

    test('should throw for non-empty arrays', () => {
      expect(() => ensureEmptyArray([1])).toThrow('Expected an empty array')
      expect(() => ensureEmptyArray([1, 2, 3])).toThrow(
        'Expected an empty array',
      )
      expect(() => ensureEmptyArray(['hello'])).toThrow(
        'Expected an empty array',
      )
    })

    test('should throw for non-arrays', () => {
      expect(() => ensureEmptyArray({})).toThrow('Expected an empty array')
      expect(() => ensureEmptyArray('hello')).toThrow('Expected an empty array')
      expect(() => ensureEmptyArray(42)).toThrow('Expected an empty array')
      expect(() => ensureEmptyArray(null)).toThrow('Expected an empty array')
      expect(() => ensureEmptyArray(undefined)).toThrow(
        'Expected an empty array',
      )
    })

    test('should throw EnsureError', () => {
      try {
        ensureEmptyArray([1])
      } catch (e) {
        expect((e as Error).name).toBe('EnsureError')
      }
    })

    test('should throw with custom message', () => {
      expect(() => ensureEmptyArray([1], 'Must be empty')).toThrow(
        'Must be empty',
      )
    })

    test('should narrow type correctly', () => {
      const value: unknown = []
      const result = ensureEmptyArray(value)

      expectTypeOf(result).toEqualTypeOf<[]>()
      expect(result.length).toBe(0)
    })
  })

  describe('ensureArrayOf', () => {
    test('should throw for non-arrays', () => {
      expect(() => ensureArrayOf('hello', isString)).toThrow(
        'Expected an array of valid items',
      )
      expect(() => ensureArrayOf(42, isNumber)).toThrow(
        'Expected an array of valid items',
      )
      expect(() => ensureArrayOf(true, isBoolean)).toThrow(
        'Expected an array of valid items',
      )
      expect(() => ensureArrayOf(null, isDefined)).toThrow(
        'Expected an array of valid items',
      )
      expect(() => ensureArrayOf(undefined, isNotNull)).toThrow(
        'Expected an array of valid items',
      )
      expect(() => ensureArrayOf({ a: 1 }, isObject)).toThrow(
        'Expected an array of valid items',
      )
    })

    test('should validate and return string arrays', () => {
      const result = ensureArrayOf(['a', 'b', 'c'], isString)
      expect(result).toEqual(['a', 'b', 'c'])
      expectTypeOf(result).toEqualTypeOf<string[]>()
      expect(() => ensureArrayOf(['a', 1 as unknown], isString)).toThrow()
    })

    test('should validate non-empty strings', () => {
      expect(ensureArrayOf(['a', 'b'], isNonEmptyString)).toEqual(['a', 'b'])
      expect(() => ensureArrayOf(['a', ''], isNonEmptyString)).toThrow()
      expect(() => ensureArrayOf(['', ''], isNonEmptyString)).toThrow()
    })

    test('should validate numbers (finite only)', () => {
      expect(ensureArrayOf([0, 1, 2.5], isNumber)).toEqual([0, 1, 2.5])
      expect(() =>
        ensureArrayOf([1, Number.POSITIVE_INFINITY], isNumber),
      ).toThrow()
      expect(() => ensureArrayOf([1, NaN], isNumber)).toThrow()
    })

    test('should validate booleans', () => {
      expect(ensureArrayOf([true, false, true], isBoolean)).toEqual([
        true,
        false,
        true,
      ])
      expect(() => ensureArrayOf([true, 1 as unknown], isBoolean)).toThrow()
    })

    test('should validate defined (exclude null and undefined)', () => {
      expect(ensureArrayOf([0, '', false], isDefined)).toEqual([0, '', false])
      expect(() => ensureArrayOf([null], isDefined)).toThrow()
      expect(() => ensureArrayOf([undefined], isDefined)).toThrow()
    })

    test('should validate notNull (exclude only null)', () => {
      expect(ensureArrayOf([undefined, 1] as unknown[], isNotNull)).toEqual([
        undefined,
        1,
      ])
      expect(() => ensureArrayOf([null], isNotNull)).toThrow()
    })

    test('should validate truthy', () => {
      expect(ensureArrayOf([1, 'a', true], isTruthy)).toEqual([1, 'a', true])
      expect(() => ensureArrayOf([1, 0] as unknown[], isTruthy)).toThrow()
    })

    test('should validate falsy', () => {
      expect(ensureArrayOf([0, '', false, null, undefined], isFalsy)).toEqual([
        0,
        '',
        false,
        null,
        undefined,
      ])
      expect(() => ensureArrayOf([0, 1] as unknown[], isFalsy)).toThrow()
    })

    test('should validate arrays of arrays', () => {
      expect(ensureArrayOf([[1], [2, 3]], isArray)).toEqual([[1], [2, 3]])
      expect(() => ensureArrayOf([[1], []], isNonEmptyArray)).toThrow()
      expect(() => ensureArrayOf([1, [2]] as unknown[], isArray)).toThrow()
    })

    test('should validate objects (non-null, not arrays)', () => {
      expect(ensureArrayOf([{}, { a: 1 }], isObject)).toEqual([{}, { a: 1 }])
      expect(() => ensureArrayOf([null] as unknown[], isObject)).toThrow()
      expect(() => ensureArrayOf([[1]] as unknown[], isObject)).toThrow()
    })

    test('should work with oneOf guard via wrapper', () => {
      const isOneOf123 = (v: unknown): v is 1 | 2 | 3 =>
        isOneOf(v, [1, 2, 3] as const)
      expect(ensureArrayOf([1, 2, 3], isOneOf123)).toEqual([1, 2, 3])
      expect(() => ensureArrayOf([1, 4] as unknown[], isOneOf123)).toThrow()
    })

    test('should narrow type for string arrays', () => {
      const value: unknown = ['x', 'y']
      const result = ensureArrayOf(value, isString)

      expectTypeOf(result).toEqualTypeOf<string[]>()
      expect(result[0].toUpperCase()).toBe('X')
    })

    test('should narrow type for number arrays', () => {
      const value: unknown = [1, 2, 3]
      const result = ensureArrayOf(value, isNumber)

      expectTypeOf(result).toEqualTypeOf<number[]>()
      expect(result.reduce((a, b) => a + b, 0)).toBe(6)
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
      const result = ensureArrayOf(value, isUser)

      expectTypeOf(result).toEqualTypeOf<User[]>()
      expect(result[0].name).toBe('John')
    })

    test('should support custom error message', () => {
      expect(() =>
        ensureArrayOf(
          [1, 'a'] as unknown[],
          isNumber,
          'All items must be numbers',
        ),
      ).toThrow('All items must be numbers')
    })
  })

  describe('ensureNonEmptyArray', () => {
    test('should return the value for non-empty arrays', () => {
      expect(ensureNonEmptyArray([1])).toEqual([1])
      expect(ensureNonEmptyArray([1, 2, 3])).toEqual([1, 2, 3])
      expect(ensureNonEmptyArray(['hello'])).toEqual(['hello'])
      expect(ensureNonEmptyArray([{}])).toEqual([{}])
      expect(ensureNonEmptyArray([null])).toEqual([null])
    })

    test('should throw for empty arrays and non-arrays', () => {
      expect(() => ensureNonEmptyArray([])).toThrow(
        'Expected a non-empty array',
      )
      expect(() => ensureNonEmptyArray({})).toThrow(
        'Expected a non-empty array',
      )
      expect(() => ensureNonEmptyArray('hello')).toThrow(
        'Expected a non-empty array',
      )
      expect(() => ensureNonEmptyArray(42)).toThrow(
        'Expected a non-empty array',
      )
      expect(() => ensureNonEmptyArray(null)).toThrow(
        'Expected a non-empty array',
      )
    })

    test('should throw with custom message', () => {
      expect(() => ensureNonEmptyArray([], 'Array cannot be empty')).toThrow(
        'Array cannot be empty',
      )
      expect(() =>
        ensureNonEmptyArray({}, 'Value must be a non-empty array'),
      ).toThrow('Value must be a non-empty array')
    })

    test('should narrow type correctly', () => {
      const value: unknown = [1, 2, 3]
      const result = ensureNonEmptyArray(value)

      expectTypeOf(result).toEqualTypeOf<[unknown, ...unknown[]]>()
      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toBe(1)
    })

    test('should narrow type correctly with generic', () => {
      const value: unknown = ['hello', 'world']
      const result = ensureNonEmptyArray<string>(value)

      expectTypeOf(result).toEqualTypeOf<[string, ...string[]]>()
      expect(result[0].toUpperCase()).toBe('HELLO')
      expect(result.length).toBeGreaterThan(0)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): number => {
        return ensureNonEmptyArray(value).length
      }

      expect(processValue([1, 2, 3])).toBe(3)
      expect(() => processValue([])).toThrow()
      expect(() => processValue({})).toThrow()
    })
  })

  describe('ensureOneOf', () => {
    test('should return the value when in collection (strings)', () => {
      const collection = ['a', 'b', 'c'] as const
      expect(ensureOneOf('a', collection)).toBe('a')
      expect(ensureOneOf('b', collection)).toBe('b')
      expect(ensureOneOf('c', collection)).toBe('c')
    })

    test('should return the value when in collection (numbers)', () => {
      const collection = [1, 2, 3] as const
      expect(ensureOneOf(1, collection)).toBe(1)
      expect(ensureOneOf(2, collection)).toBe(2)
      expect(ensureOneOf(3, collection)).toBe(3)
    })

    test('should return the value when in collection (mixed types)', () => {
      type Literal = 'a' | 1 | true | null
      const collection = ['a', 1, true, null] as const
      expect(ensureOneOf('a' as Literal, collection)).toBe('a')
      expect(ensureOneOf(1 as Literal, collection)).toBe(1)
      expect(ensureOneOf(true as Literal, collection)).toBe(true)
      expect(ensureOneOf(null as Literal, collection)).toBe(null)
    })

    test('should return the value when in collection (objects)', () => {
      type Literal = { a: number } | { b: number }
      const obj1 = { a: 1 }
      const obj2 = { b: 2 }
      const collection = [obj1, obj2] as const
      expect(ensureOneOf(obj1 as Literal, collection)).toBe(obj1)
      expect(ensureOneOf(obj2 as Literal, collection)).toBe(obj2)
    })

    test('should throw when value is not in collection', () => {
      const collection = ['a', 'b', 'c'] as const
      expect(() => ensureOneOf('d', collection)).toThrow(
        'Expected one of following values: a, b, c.',
      )
      expect(() => ensureOneOf('ab', collection)).toThrow(
        'Expected one of following values: a, b, c.',
      )
      expect(() => ensureOneOf('', collection)).toThrow(
        'Expected one of following values: a, b, c.',
      )
    })

    test('should throw for empty collection', () => {
      const collection = [] as const
      expect(() => ensureOneOf('any', collection)).toThrow(
        'Expected one of following values: .',
      )
    })

    test('should be case-sensitive for strings', () => {
      const collection = ['foo', 'bar'] as const
      expect(() => ensureOneOf('Foo', collection)).toThrow(
        'Expected one of following values: foo, bar.',
      )
      expect(ensureOneOf('foo', collection)).toBe('foo')
    })

    test('should throw with custom message', () => {
      type Literal = 'a' | 'b' | 'c'
      const collection = ['a', 'b', 'c'] as const
      expect(() =>
        ensureOneOf('d', collection, 'Value must be one of allowed values'),
      ).toThrow('Value must be one of allowed values')
      expect(() =>
        ensureOneOf(
          1 as unknown as Literal,
          collection,
          'Invalid value provided',
        ),
      ).toThrow('Invalid value provided')
    })

    test('should narrow type correctly for string literals', () => {
      const value = 'a' as unknown
      const collection = ['a', 'b', 'c'] as const
      const result = ensureOneOf(value, collection)

      expectTypeOf(result).toEqualTypeOf<'a' | 'b' | 'c'>()
      expect(result).toBe('a')
    })

    test('should narrow type correctly for number literals', () => {
      const value = 1 as unknown
      const collection = [1, 2, 3] as const
      const result = ensureOneOf(value, collection)

      expectTypeOf(result).toEqualTypeOf<1 | 2 | 3>()
      expect(result).toBe(1)
    })

    test('should narrow type correctly for mixed types', () => {
      const value = 'a' as unknown
      const collection = ['a', 1, true, null] as const
      const result = ensureOneOf(value, collection)

      expectTypeOf(result).toEqualTypeOf<'a' | 1 | true | null>()
      expect(result).toBe('a')
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): string => {
        return ensureOneOf(value, ['a', 'b', 'c'] as const).toUpperCase()
      }

      expect(processValue('a')).toBe('A')
      expect(() => processValue('d')).toThrow()
    })

    test('should narrow type correctly after assertion for mutable array', () => {
      const value: unknown = 'hello'
      const collection = ['hello', 'world']
      const result = ensureOneOf(value, collection)

      expectTypeOf(result).toEqualTypeOf<string>()
    })
  })

  describe('ensureObject', () => {
    test('should return the value for objects', () => {
      const obj = { name: 'test' }
      expect(ensureObject(obj)).toBe(obj)
      expect(ensureObject({})).toEqual({})
      expect(ensureObject({ nested: { value: 42 } })).toEqual({
        nested: { value: 42 },
      })
      expect(ensureObject(new Date())).toBeInstanceOf(Date)
      expect(ensureObject(/regex/)).toBeInstanceOf(RegExp)
    })

    test('should throw for non-objects', () => {
      expect(() => ensureObject([])).toThrow('Expected an object')
      expect(() => ensureObject('hello')).toThrow('Expected an object')
      expect(() => ensureObject(42)).toThrow('Expected an object')
      expect(() => ensureObject(true)).toThrow('Expected an object')
      expect(() => ensureObject(null)).toThrow('Expected an object')
      expect(() => ensureObject(undefined)).toThrow('Expected an object')
      expect(() => ensureObject(() => {})).toThrow('Expected an object')
    })

    test('should throw with custom message', () => {
      expect(() => ensureObject([], 'Value must be an object')).toThrow(
        'Value must be an object',
      )
      expect(() => ensureObject(null, 'Value cannot be null')).toThrow(
        'Value cannot be null',
      )
    })

    test('should narrow type correctly', () => {
      const value: unknown = { name: 'test', age: 25 }
      const result = ensureObject(value)

      expectTypeOf(result).toEqualTypeOf<object>()
      expect(typeof result).toBe('object')
      expect(result).not.toBeNull()
    })

    test('should narrow type correctly with specific object type', () => {
      interface User {
        name: string
        age: number
      }

      const value: unknown = { name: 'test', age: 25 }
      const result = ensureObject<User>(value)

      expectTypeOf(result).toEqualTypeOf<User>()
      expect(result.name).toBe('test')
      expect(result.age).toBe(25)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): string => {
        return JSON.stringify(ensureObject(value))
      }

      expect(processValue({ name: 'test' })).toBe('{"name":"test"}')
      expect(() => processValue([])).toThrow()
      expect(() => processValue(null)).toThrow()
    })
  })

  describe('ensureKeyOf', () => {
    describe('happy paths', () => {
      test('should return the key for a string key present in object', () => {
        const obj = { a: 'a' } as const
        expect(ensureKeyOf('a', obj)).toBe('a')
      })

      test('should return the key for a number key present in object', () => {
        const obj = { 1: 'a' } as const
        expect(ensureKeyOf(1, obj)).toBe(1)
        expect(ensureKeyOf((1).toString(), obj)).toBe('1')
        expect(ensureKeyOf('1', obj)).toBe('1')
      })

      test('should return the key for a unique symbol key present in object', () => {
        const symbol = Symbol('a')
        const obj = { [symbol]: 'a' } as const
        expect(ensureKeyOf(symbol, obj)).toBe(symbol)
      })

      test('should return the key for a global symbol key present in object', () => {
        const symbol = Symbol.for('a')
        const obj = { [symbol]: 'a' }
        expect(ensureKeyOf(Symbol.for('a'), obj)).toBe(symbol)
      })

      test('should return key for own properties but throw for inherited ones', () => {
        const proto = { inherited: 'value' } as const
        const obj = Object.assign(Object.create(proto), { own: 'own' } as const)

        expect(ensureKeyOf('own', obj)).toBe('own')
        expect(() => ensureKeyOf('inherited', obj)).toThrow()
      })

      test('should work with objects created with null prototype', () => {
        const obj = Object.assign(Object.create(null), { safe: true })
        expect(ensureKeyOf('safe', obj)).toBe('safe')
        expect(() => ensureKeyOf('missing', obj)).toThrow()
      })
    })

    describe('sad paths', () => {
      test('should throw if string key not present in object', () => {
        const obj = { a: 'a' } as const
        expect(() => ensureKeyOf('b', obj)).toThrow(
          'Expected one of following values: a',
        )
      })

      test('should throw if number key not present in object', () => {
        const obj = { 1: 'a' } as const
        expect(() => ensureKeyOf(2, obj)).toThrow(
          'Expected one of following values: 1',
        )
      })

      test('should throw if symbol key not present in object', () => {
        const symbol = Symbol('a')
        const obj = { [Symbol('a')]: 'a' } as const
        expect(() => ensureKeyOf(symbol, obj)).toThrow()
      })

      test('should throw if string key is not matching casing', () => {
        const obj = { a: 'a' } as const
        expect(() => ensureKeyOf('A', obj)).toThrow(
          'Expected one of following values: a',
        )
      })

      test('should throw when record is null or undefined', () => {
        const obj1 = null as unknown as Record<string, string>
        const obj2 = undefined as unknown as Record<string, string>
        expect(() => ensureKeyOf('foo', obj1)).toThrow()
        expect(() => ensureKeyOf('foo', obj2)).toThrow()
      })

      test('should throw with custom message', () => {
        const obj = { a: 'a' } as const
        expect(() =>
          ensureKeyOf('b', obj, 'Key must be a valid property'),
        ).toThrow('Key must be a valid property')
      })
    })

    describe('type narrowing', () => {
      test('should narrow PropertyKey to keyof record', () => {
        const record = { foo: 1, bar: 2 } as const
        const key = 'foo' as PropertyKey
        const result = ensureKeyOf(key, record)

        expectTypeOf(result).toEqualTypeOf<'foo' | 'bar'>()
        expect(record[result]).toBe(1)
      })

      test('should narrow string to keyof record', () => {
        const record = { click: 'click', submit: 'submit' } as const
        const key = 'click' as string
        const result = ensureKeyOf(key, record)

        expectTypeOf(result).toEqualTypeOf<'click' | 'submit'>()
        expect(record[result]).toBe('click')
      })

      test('should narrow union of potential keys down to actual keys', () => {
        const record = { foo: 1, bar: 2 } as const
        const key1 = 'foo' as 'foo' | 'baz'
        const result = ensureKeyOf(key1, record)

        expectTypeOf(result).toEqualTypeOf<'foo'>()
        expect(record[result]).toBe(1)
      })

      test('should narrow type correctly in conditional', () => {
        const record = { foo: 1, bar: 2 } as const

        const processKey = (key: string): number => {
          const narrowed = ensureKeyOf(key, record)
          return record[narrowed]
        }

        expect(processKey('foo')).toBe(1)
        expect(processKey('bar')).toBe(2)
        expect(() => processKey('baz')).toThrow()
      })
    })

    describe('real world scenarios', () => {
      test('should safely access configuration flags', () => {
        const featureFlags = {
          enableCheckout: true,
          enableBeta: false,
        } as const

        const incomingFlag = 'enableCheckout' as string
        const result = ensureKeyOf(incomingFlag, featureFlags)

        expectTypeOf(result).toEqualTypeOf<'enableCheckout' | 'enableBeta'>()
        expect(typeof featureFlags[result]).toBe('boolean')
        expect(featureFlags[result]).toBe(true)
      })

      test('should guard dynamic access when dispatching event handlers', () => {
        const handlers = {
          click: () => 'clicked',
          submit: () => 'submitted',
        } as const

        const events = ['click', 'keydown', 'submit']
        const results = [] as string[]

        for (const eventName of events) {
          try {
            const key = ensureKeyOf(eventName, handlers)
            results.push(handlers[key]())
          } catch {
            // Ignore errors for invalid keys
          }
        }

        expect(results).toEqual(['clicked', 'submitted'])
      })
    })
  })
})

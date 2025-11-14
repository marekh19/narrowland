import { describe, expect, expectTypeOf, test } from 'vitest'

import {
  assertBigint,
  assertBoolean,
  assertInstanceOf,
  assertNonEmptyString,
  assertNumber,
  assertString,
  assertSymbol,
} from './primitives'

describe('assert/primitives', () => {
  describe('assertString', () => {
    test('should not throw for strings', () => {
      expect(() => assertString('hello')).not.toThrow()
      expect(() => assertString('')).not.toThrow()
      expect(() => assertString('123')).not.toThrow()
    })

    test('should throw for non-strings', () => {
      expect(() => assertString(123)).toThrow('Expected a string')
      expect(() => assertString(true)).toThrow('Expected a string')
      expect(() => assertString(null)).toThrow('Expected a string')
      expect(() => assertString(undefined)).toThrow('Expected a string')
      expect(() => assertString({})).toThrow('Expected a string')
    })

    test('should throw with custom message', () => {
      expect(() => assertString(123, 'Value must be a string')).toThrow(
        'Value must be a string',
      )
    })

    test('should narrow type correctly', () => {
      const value: unknown = 'hello'

      assertString(value)

      expectTypeOf(value).toEqualTypeOf<string>()
      expect(value.length).toBe(5)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): string => {
        assertString(value)
        return value.toUpperCase() // TypeScript knows this is a string
      }

      expect(processValue('hello')).toBe('HELLO')
      expect(() => processValue(123)).toThrow()
    })
  })

  describe('assertNonEmptyString', () => {
    test('should not throw for non-empty strings', () => {
      expect(() => assertNonEmptyString('hello')).not.toThrow()
      expect(() => assertNonEmptyString('123')).not.toThrow()
      expect(() => assertNonEmptyString('a')).not.toThrow()
    })

    test('should throw for empty strings and non-strings', () => {
      expect(() => assertNonEmptyString('')).toThrow(
        'Expected a non-empty string',
      )
      expect(() => assertNonEmptyString(123)).toThrow(
        'Expected a non-empty string',
      )
      expect(() => assertNonEmptyString(null)).toThrow(
        'Expected a non-empty string',
      )
      expect(() => assertNonEmptyString(undefined)).toThrow(
        'Expected a non-empty string',
      )
    })

    test('should throw with custom message', () => {
      expect(() => assertNonEmptyString('', 'Value cannot be empty')).toThrow(
        'Value cannot be empty',
      )
      expect(() =>
        assertNonEmptyString(123, 'Value must be a non-empty string'),
      ).toThrow('Value must be a non-empty string')
    })

    test('should narrow type correctly', () => {
      const value: unknown = 'hello'

      assertNonEmptyString(value)

      expectTypeOf(value).toEqualTypeOf<string>()
      expect(value.length).toBeGreaterThan(0)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): string => {
        assertNonEmptyString(value)
        return value.toUpperCase() // TypeScript knows this is a non-empty string
      }

      expect(processValue('hello')).toBe('HELLO')
      expect(() => processValue('')).toThrow()
      expect(() => processValue(123)).toThrow()
    })
  })

  describe('assertNumber', () => {
    test('should not throw for finite numbers', () => {
      expect(() => assertNumber(42)).not.toThrow()
      expect(() => assertNumber(0)).not.toThrow()
      expect(() => assertNumber(-1)).not.toThrow()
      expect(() => assertNumber(3.14)).not.toThrow()
    })

    test('should throw for non-finite numbers and non-numbers', () => {
      expect(() => assertNumber(NaN)).toThrow('Expected a number')
      expect(() => assertNumber(Infinity)).toThrow('Expected a number')
      expect(() => assertNumber(-Infinity)).toThrow('Expected a number')
      expect(() => assertNumber('123')).toThrow('Expected a number')
      expect(() => assertNumber(true)).toThrow('Expected a number')
      expect(() => assertNumber(null)).toThrow('Expected a number')
    })

    test('should throw with custom message', () => {
      expect(() => assertNumber('123', 'Value must be a number')).toThrow(
        'Value must be a number',
      )
      expect(() => assertNumber(NaN, 'Value must be finite')).toThrow(
        'Value must be finite',
      )
    })

    test('should narrow type correctly', () => {
      const value: unknown = 42

      assertNumber(value)

      expectTypeOf(value).toEqualTypeOf<number>()
      expect(value + 1).toBe(43)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): number => {
        assertNumber(value)
        return value * 2 // TypeScript knows this is a number
      }

      expect(processValue(21)).toBe(42)
      expect(() => processValue('hello')).toThrow()
      expect(() => processValue(NaN)).toThrow()
    })
  })

  describe('assertBoolean', () => {
    test('should not throw for booleans', () => {
      expect(() => assertBoolean(true)).not.toThrow()
      expect(() => assertBoolean(false)).not.toThrow()
    })

    test('should throw for non-booleans', () => {
      expect(() => assertBoolean(0)).toThrow('Expected a boolean')
      expect(() => assertBoolean(1)).toThrow('Expected a boolean')
      expect(() => assertBoolean('true')).toThrow('Expected a boolean')
      expect(() => assertBoolean(null)).toThrow('Expected a boolean')
      expect(() => assertBoolean(undefined)).toThrow('Expected a boolean')
    })

    test('should throw with custom message', () => {
      expect(() => assertBoolean(0, 'Value must be a boolean')).toThrow(
        'Value must be a boolean',
      )
    })

    test('should narrow type correctly', () => {
      const value: unknown = true

      assertBoolean(value)

      expectTypeOf(value).toEqualTypeOf<boolean>()
      expect(value).toBe(true)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): string => {
        assertBoolean(value)
        return value ? 'true' : 'false' // TypeScript knows this is a boolean
      }

      expect(processValue(true)).toBe('true')
      expect(processValue(false)).toBe('false')
      expect(() => processValue('hello')).toThrow()
    })
  })

  describe('assertBigint', () => {
    test('should not throw for bigint values', () => {
      expect(() => assertBigint(BigInt(0))).not.toThrow()
      expect(() => assertBigint(BigInt(42))).not.toThrow()
      expect(() => assertBigint(BigInt(-1))).not.toThrow()
      expect(() => assertBigint(0n)).not.toThrow()
      expect(() => assertBigint(42n)).not.toThrow()
    })

    test('should throw for non-bigint values', () => {
      expect(() => assertBigint(0)).toThrow('Expected a bigint')
      expect(() => assertBigint(42)).toThrow('Expected a bigint')
      expect(() => assertBigint('42')).toThrow('Expected a bigint')
      expect(() => assertBigint(true)).toThrow('Expected a bigint')
      expect(() => assertBigint(null)).toThrow('Expected a bigint')
      expect(() => assertBigint(undefined)).toThrow('Expected a bigint')
      expect(() => assertBigint({})).toThrow('Expected a bigint')
    })

    test('should throw with custom message', () => {
      expect(() => assertBigint(42, 'Value must be a bigint')).toThrow(
        'Value must be a bigint',
      )
      expect(() => assertBigint(null, 'Value must be a bigint')).toThrow(
        'Value must be a bigint',
      )
    })

    test('should narrow type correctly', () => {
      const value: unknown = BigInt(42)

      assertBigint(value)

      expectTypeOf(value).toEqualTypeOf<bigint>()
      expect(value).toBe(42n)
    })
  })

  describe('assertBigint', () => {
    test('should not throw for bigint values', () => {
      expect(() => assertBigint(BigInt(0))).not.toThrow()
      expect(() => assertBigint(BigInt(42))).not.toThrow()
      expect(() => assertBigint(BigInt(-1))).not.toThrow()
      expect(() => assertBigint(0n)).not.toThrow()
      expect(() => assertBigint(42n)).not.toThrow()
    })

    test('should throw for non-bigint values', () => {
      expect(() => assertBigint(0)).toThrow('Expected a bigint')
      expect(() => assertBigint(42)).toThrow('Expected a bigint')
      expect(() => assertBigint('42')).toThrow('Expected a bigint')
      expect(() => assertBigint(true)).toThrow('Expected a bigint')
      expect(() => assertBigint(null)).toThrow('Expected a bigint')
      expect(() => assertBigint(undefined)).toThrow('Expected a bigint')
      expect(() => assertBigint({})).toThrow('Expected a bigint')
    })

    test('should throw with custom message', () => {
      expect(() => assertBigint(42, 'Value must be a bigint')).toThrow(
        'Value must be a bigint',
      )
      expect(() => assertBigint(null, 'Value must be a bigint')).toThrow(
        'Value must be a bigint',
      )
    })

    test('should narrow type correctly', () => {
      const value: unknown = BigInt(42)

      assertBigint(value)

      expectTypeOf(value).toEqualTypeOf<bigint>()
      expect(value).toBe(42n)
    })
  })

  describe('assertInstanceOf', () => {
    // Custom classes for testing
    class Animal {
      constructor(public name: string) {}
    }

    class Dog extends Animal {
      constructor(
        name: string,
        public breed: string,
      ) {
        super(name)
      }
    }

    describe('happy paths', () => {
      test('should not throw for Date objects', () => {
        expect(() => assertInstanceOf(new Date(), Date)).not.toThrow()
        expect(() =>
          assertInstanceOf(new Date('2023-01-01'), Date),
        ).not.toThrow()
        expect(() => assertInstanceOf(new Date(0), Date)).not.toThrow()
        // Invalid Date is still a Date object
        expect(() => assertInstanceOf(new Date('invalid'), Date)).not.toThrow()
      })

      test('should not throw for Error objects', () => {
        expect(() => assertInstanceOf(new Error('test'), Error)).not.toThrow()
        expect(() =>
          assertInstanceOf(new TypeError('test'), TypeError),
        ).not.toThrow()
        expect(() =>
          assertInstanceOf(new TypeError('test'), Error),
        ).not.toThrow() // TypeError extends Error
        expect(() =>
          assertInstanceOf(new ReferenceError('test'), ReferenceError),
        ).not.toThrow()
        expect(() =>
          assertInstanceOf(new ReferenceError('test'), Error),
        ).not.toThrow() // ReferenceError extends Error
      })

      test('should not throw for custom class instances', () => {
        const animal = new Animal('Fluffy')
        expect(() => assertInstanceOf(animal, Animal)).not.toThrow()
      })

      test('should not throw for extended class instances', () => {
        const dog = new Dog('Buddy', 'Golden Retriever')
        expect(() => assertInstanceOf(dog, Dog)).not.toThrow()
        expect(() => assertInstanceOf(dog, Animal)).not.toThrow() // Dog extends Animal
      })
    })

    describe('sad paths', () => {
      test('should throw for non-Date values when checking Date', () => {
        expect(() => assertInstanceOf('2023-01-01', Date)).toThrow(
          'Expected instance of Date',
        )
        expect(() => assertInstanceOf(1234567890, Date)).toThrow(
          'Expected instance of Date',
        )
        expect(() => assertInstanceOf({}, Date)).toThrow(
          'Expected instance of Date',
        )
        expect(() => assertInstanceOf(null, Date)).toThrow(
          'Expected instance of Date',
        )
        expect(() => assertInstanceOf(undefined, Date)).toThrow(
          'Expected instance of Date',
        )
        expect(() => assertInstanceOf('', Date)).toThrow(
          'Expected instance of Date',
        )
      })

      test('should throw for non-Error values when checking Error', () => {
        expect(() => assertInstanceOf('error', Error)).toThrow(
          'Expected instance of Error',
        )
        expect(() => assertInstanceOf({ message: 'error' }, Error)).toThrow(
          'Expected instance of Error',
        )
        expect(() => assertInstanceOf(null, Error)).toThrow(
          'Expected instance of Error',
        )
        expect(() => assertInstanceOf(undefined, Error)).toThrow(
          'Expected instance of Error',
        )
      })

      test('should throw for non-instance values when checking custom classes', () => {
        expect(() => assertInstanceOf({ name: 'Fluffy' }, Animal)).toThrow(
          'Expected instance of Animal',
        )
        expect(() => assertInstanceOf('Fluffy', Animal)).toThrow(
          'Expected instance of Animal',
        )
        expect(() => assertInstanceOf(null, Animal)).toThrow(
          'Expected instance of Animal',
        )
        expect(() => assertInstanceOf(undefined, Animal)).toThrow(
          'Expected instance of Animal',
        )
      })

      test('should throw when checking wrong class hierarchy', () => {
        const animal = new Animal('Fluffy')

        // Animal is not a Dog
        expect(() => assertInstanceOf(animal, Dog)).toThrow(
          'Expected instance of Dog',
        )
      })
    })

    describe('custom error message', () => {
      test('should throw with a custom message', () => {
        expect(() =>
          assertInstanceOf(new Animal('Fluffy'), Dog, 'Value must be a Dog'),
        ).toThrow('Value must be a Dog')
      })
    })

    describe('type narrowing', () => {
      test('should narrow type correctly for Date', () => {
        const value: unknown = new Date()

        assertInstanceOf(value, Date)

        expectTypeOf(value).toEqualTypeOf<Date>()
        expect(value.getTime()).toBeTypeOf('number')
      })

      test('should narrow type correctly for Error', () => {
        const value: unknown = new Error('test')

        assertInstanceOf(value, Error)

        expectTypeOf(value).toEqualTypeOf<Error>()
        expect(value.message).toBe('test')
        expect(value.stack).toBeDefined()
      })

      test('should narrow type correctly for custom class', () => {
        const value: unknown = new Animal('Fluffy')

        assertInstanceOf(value, Animal)

        expectTypeOf(value).toEqualTypeOf<Animal>()
        expect(value.name).toBe('Fluffy')
      })

      test('should narrow type correctly for extended class', () => {
        const value: unknown = new Dog('Buddy', 'Golden Retriever')

        assertInstanceOf(value, Dog)

        expectTypeOf(value).toEqualTypeOf<Dog>()
        expect(value.name).toBe('Buddy')
        expect(value.breed).toBe('Golden Retriever')
      })

      test('should narrow type correctly for extended class checking base class', () => {
        const value: unknown = new Dog('Buddy', 'Golden Retriever')

        assertInstanceOf(value, Animal)

        expectTypeOf(value).toEqualTypeOf<Animal>()
        expect(value.name).toBe('Buddy')
        // TypeScript knows it's at least an Animal, but not necessarily a Dog
      })
    })
  })
})

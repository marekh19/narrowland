import { describe, expect, expectTypeOf, test } from 'vitest'

import {
  isBigint,
  isBoolean,
  isInstanceOf,
  isNonEmptyString,
  isNumber,
  isString,
} from './primitives'

describe('primitives', () => {
  describe('isString', () => {
    test('should return true for strings', () => {
      expect(isString('hello')).toBe(true)
      expect(isString('')).toBe(true)
      expect(isString('123')).toBe(true)
    })

    test('should return false for non-strings', () => {
      expect(isString(123)).toBe(false)
      expect(isString(true)).toBe(false)
      expect(isString(null)).toBe(false)
      expect(isString(undefined)).toBe(false)
      expect(isString({})).toBe(false)
    })

    test('should narrow type correctly', () => {
      const value: unknown = 'hello'

      if (isString(value)) {
        expectTypeOf(value).toEqualTypeOf<string>()
        expect(value.length).toBe(5)
      }
    })
  })

  describe('isNonEmptyString', () => {
    test('should return true for non-empty strings', () => {
      expect(isNonEmptyString('hello')).toBe(true)
      expect(isNonEmptyString('123')).toBe(true)
      expect(isNonEmptyString('a')).toBe(true)
    })

    test('should return false for empty strings and non-strings', () => {
      expect(isNonEmptyString('')).toBe(false)
      expect(isNonEmptyString(123)).toBe(false)
      expect(isNonEmptyString(null)).toBe(false)
    })

    test('should narrow type correctly', () => {
      const value: unknown = 'hello'

      if (isNonEmptyString(value)) {
        expectTypeOf(value).toEqualTypeOf<string>()
        expect(value.length).toBeGreaterThan(0)
      }
    })
  })

  describe('isNumber', () => {
    test('should return true for finite numbers', () => {
      expect(isNumber(42)).toBe(true)
      expect(isNumber(0)).toBe(true)
      expect(isNumber(-1)).toBe(true)
      expect(isNumber(3.14)).toBe(true)
    })

    test('should return false for non-finite numbers and non-numbers', () => {
      expect(isNumber(NaN)).toBe(false)
      expect(isNumber(Infinity)).toBe(false)
      expect(isNumber('123')).toBe(false)
      expect(isNumber(true)).toBe(false)
      expect(isNumber(null)).toBe(false)
    })

    test('should narrow type correctly', () => {
      const value: unknown = 42

      if (isNumber(value)) {
        expectTypeOf(value).toEqualTypeOf<number>()
        expect(value + 1).toBe(43)
      }
    })
  })

  describe('isBoolean', () => {
    test('should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true)
      expect(isBoolean(false)).toBe(true)
    })

    test('should return false for non-booleans', () => {
      expect(isBoolean(0)).toBe(false)
      expect(isBoolean(1)).toBe(false)
      expect(isBoolean('true')).toBe(false)
      expect(isBoolean(null)).toBe(false)
    })

    test('should narrow type correctly', () => {
      const value: unknown = true

      if (isBoolean(value)) {
        expectTypeOf(value).toEqualTypeOf<boolean>()
        expect(value).toBe(true)
      }
    })
  })

  describe('isBigint', () => {
    test('should return true for bigint values', () => {
      expect(isBigint(BigInt(0))).toBe(true)
      expect(isBigint(BigInt(42))).toBe(true)
      expect(isBigint(BigInt(-1))).toBe(true)
      expect(isBigint(BigInt('9007199254740991'))).toBe(true)
      expect(isBigint(0n)).toBe(true)
      expect(isBigint(42n)).toBe(true)
    })

    test('should return false for non-bigint values', () => {
      expect(isBigint(0)).toBe(false)
      expect(isBigint(42)).toBe(false)
      expect(isBigint('42')).toBe(false)
      expect(isBigint(true)).toBe(false)
      expect(isBigint(null)).toBe(false)
      expect(isBigint(undefined)).toBe(false)
      expect(isBigint({})).toBe(false)
    })

    test('should narrow type correctly', () => {
      const value: unknown = BigInt(42)

      if (isBigint(value)) {
        expectTypeOf(value).toEqualTypeOf<bigint>()
        expect(value.toString()).toBe('42')
      }
    })
  })

  describe('isInstanceOf', () => {
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
      test('should return true for Date instances', () => {
        expect(isInstanceOf(new Date(), Date)).toBe(true)
        expect(isInstanceOf(new Date('2023-01-01'), Date)).toBe(true)
        expect(isInstanceOf(new Date(0), Date)).toBe(true)
        // Invalid Date is still a Date object
        expect(isInstanceOf(new Date('invalid'), Date)).toBe(true)
      })

      test('should return true for Error instances', () => {
        expect(isInstanceOf(new Error('test'), Error)).toBe(true)
        expect(isInstanceOf(new TypeError('test'), TypeError)).toBe(true)
        expect(isInstanceOf(new TypeError('test'), Error)).toBe(true) // TypeError extends Error
        expect(isInstanceOf(new ReferenceError('test'), ReferenceError)).toBe(
          true,
        )
        expect(isInstanceOf(new ReferenceError('test'), Error)).toBe(true) // ReferenceError extends Error
      })

      test('should return true for custom class instances', () => {
        const animal = new Animal('Fluffy')
        expect(isInstanceOf(animal, Animal)).toBe(true)
      })

      test('should return true for extended class instances', () => {
        const dog = new Dog('Buddy', 'Golden Retriever')
        expect(isInstanceOf(dog, Dog)).toBe(true)
        expect(isInstanceOf(dog, Animal)).toBe(true) // Dog extends Animal
      })
    })

    describe('sad paths', () => {
      test('should return false for non-Date values when checking Date', () => {
        expect(isInstanceOf('2023-01-01', Date)).toBe(false)
        expect(isInstanceOf(1234567890, Date)).toBe(false)
        expect(isInstanceOf({}, Date)).toBe(false)
        expect(isInstanceOf(null, Date)).toBe(false)
        expect(isInstanceOf(undefined, Date)).toBe(false)
        expect(isInstanceOf('', Date)).toBe(false)
      })

      test('should return false for non-Error values when checking Error', () => {
        expect(isInstanceOf('error', Error)).toBe(false)
        expect(isInstanceOf({ message: 'error' }, Error)).toBe(false)
        expect(isInstanceOf(null, Error)).toBe(false)
        expect(isInstanceOf(undefined, Error)).toBe(false)
      })

      test('should return false for non-instance values when checking custom classes', () => {
        expect(isInstanceOf({ name: 'Fluffy' }, Animal)).toBe(false)
        expect(isInstanceOf('Fluffy', Animal)).toBe(false)
        expect(isInstanceOf(null, Animal)).toBe(false)
        expect(isInstanceOf(undefined, Animal)).toBe(false)
      })

      test('should return false when checking wrong class hierarchy', () => {
        const animal = new Animal('Fluffy')
        const dog = new Dog('Buddy', 'Golden Retriever')

        // Animal is not a Dog
        expect(isInstanceOf(animal, Dog)).toBe(false)
        // But Dog is an Animal
        expect(isInstanceOf(dog, Animal)).toBe(true)
      })
    })

    describe('type narrowing', () => {
      test('should narrow type correctly for Date', () => {
        const value: unknown = new Date()

        if (isInstanceOf(value, Date)) {
          expectTypeOf(value).toEqualTypeOf<Date>()
          expect(value.getTime()).toBeTypeOf('number')
        }
      })

      test('should narrow type correctly for Error', () => {
        const value: unknown = new Error('test')

        if (isInstanceOf(value, Error)) {
          expectTypeOf(value).toEqualTypeOf<Error>()
          expect(value.message).toBe('test')
          expect(value.stack).toBeDefined()
        }
      })

      test('should narrow type correctly for custom class', () => {
        const value: unknown = new Animal('Fluffy')

        if (isInstanceOf(value, Animal)) {
          expectTypeOf(value).toEqualTypeOf<Animal>()
          expect(value.name).toBe('Fluffy')
        }
      })

      test('should narrow type correctly for extended class', () => {
        const value: unknown = new Dog('Buddy', 'Golden Retriever')

        if (isInstanceOf(value, Dog)) {
          expectTypeOf(value).toEqualTypeOf<Dog>()
          expect(value.name).toBe('Buddy')
          expect(value.breed).toBe('Golden Retriever')
        }
      })

      test('should narrow type correctly for extended class checking base class', () => {
        const value: unknown = new Dog('Buddy', 'Golden Retriever')

        if (isInstanceOf(value, Animal)) {
          expectTypeOf(value).toEqualTypeOf<Animal>()
          expect(value.name).toBe('Buddy')
          // TypeScript knows it's at least an Animal, but not necessarily a Dog
        }
      })

      test('should narrow type correctly in filter operations', () => {
        const values: unknown[] = [
          new Date(),
          'not a date',
          new Date('2023-01-01'),
          null,
          new Date(0),
        ]

        const dates = values.filter((v) => isInstanceOf(v, Date))

        expectTypeOf(dates).toEqualTypeOf<Date[]>()
        expect(dates).toHaveLength(3)
        dates.forEach((date) => {
          expectTypeOf(date).toEqualTypeOf<Date>()
          expect(date.getTime()).toBeTypeOf('number')
        })
      })
    })
  })
})

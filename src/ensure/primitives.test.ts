import { describe, expect, expectTypeOf, test } from 'vitest'
import {
  ensureBigint,
  ensureBoolean,
  ensureInstanceOf,
  ensureNonEmptyString,
  ensureNumber,
  ensureString,
  ensureSymbol,
} from './primitives'

describe('ensure/primitives', () => {
  describe('ensureString', () => {
    test('should return the value for strings', () => {
      expect(ensureString('hello')).toBe('hello')
      expect(ensureString('')).toBe('')
      expect(ensureString('123')).toBe('123')
    })

    test('should throw for non-strings', () => {
      expect(() => ensureString(123)).toThrow('Expected a string')
      expect(() => ensureString(true)).toThrow('Expected a string')
      expect(() => ensureString(null)).toThrow('Expected a string')
      expect(() => ensureString(undefined)).toThrow('Expected a string')
      expect(() => ensureString({})).toThrow('Expected a string')
    })

    test('should throw EnsureError', () => {
      try {
        ensureString(123)
      } catch (e) {
        expect((e as Error).name).toBe('EnsureError')
      }
    })

    test('should throw with custom message', () => {
      expect(() => ensureString(123, 'Value must be a string')).toThrow(
        'Value must be a string',
      )
    })

    test('should narrow type correctly', () => {
      const value: unknown = 'hello'
      const result = ensureString(value)

      expectTypeOf(result).toEqualTypeOf<string>()
      expect(result.length).toBe(5)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): string => {
        return ensureString(value).toUpperCase()
      }

      expect(processValue('hello')).toBe('HELLO')
      expect(() => processValue(123)).toThrow()
    })
  })

  describe('ensureNonEmptyString', () => {
    test('should return the value for non-empty strings', () => {
      expect(ensureNonEmptyString('hello')).toBe('hello')
      expect(ensureNonEmptyString('123')).toBe('123')
      expect(ensureNonEmptyString('a')).toBe('a')
    })

    test('should throw for empty strings and non-strings', () => {
      expect(() => ensureNonEmptyString('')).toThrow(
        'Expected a non-empty string',
      )
      expect(() => ensureNonEmptyString(123)).toThrow(
        'Expected a non-empty string',
      )
      expect(() => ensureNonEmptyString(null)).toThrow(
        'Expected a non-empty string',
      )
      expect(() => ensureNonEmptyString(undefined)).toThrow(
        'Expected a non-empty string',
      )
    })

    test('should throw with custom message', () => {
      expect(() => ensureNonEmptyString('', 'Value cannot be empty')).toThrow(
        'Value cannot be empty',
      )
      expect(() =>
        ensureNonEmptyString(123, 'Value must be a non-empty string'),
      ).toThrow('Value must be a non-empty string')
    })

    test('should narrow type correctly', () => {
      const value: unknown = 'hello'
      const result = ensureNonEmptyString(value)

      expectTypeOf(result).toEqualTypeOf<string>()
      expect(result.length).toBeGreaterThan(0)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): string => {
        return ensureNonEmptyString(value).toUpperCase()
      }

      expect(processValue('hello')).toBe('HELLO')
      expect(() => processValue('')).toThrow()
      expect(() => processValue(123)).toThrow()
    })
  })

  describe('ensureNumber', () => {
    test('should return the value for finite numbers', () => {
      expect(ensureNumber(42)).toBe(42)
      expect(ensureNumber(0)).toBe(0)
      expect(ensureNumber(-1)).toBe(-1)
      expect(ensureNumber(3.14)).toBe(3.14)
    })

    test('should throw for non-finite numbers and non-numbers', () => {
      expect(() => ensureNumber(NaN)).toThrow('Expected a number')
      expect(() => ensureNumber(Infinity)).toThrow('Expected a number')
      expect(() => ensureNumber(-Infinity)).toThrow('Expected a number')
      expect(() => ensureNumber('123')).toThrow('Expected a number')
      expect(() => ensureNumber(true)).toThrow('Expected a number')
      expect(() => ensureNumber(null)).toThrow('Expected a number')
    })

    test('should throw with custom message', () => {
      expect(() => ensureNumber('123', 'Value must be a number')).toThrow(
        'Value must be a number',
      )
      expect(() => ensureNumber(NaN, 'Value must be finite')).toThrow(
        'Value must be finite',
      )
    })

    test('should narrow type correctly', () => {
      const value: unknown = 42
      const result = ensureNumber(value)

      expectTypeOf(result).toEqualTypeOf<number>()
      expect(result + 1).toBe(43)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): number => {
        return ensureNumber(value) * 2
      }

      expect(processValue(21)).toBe(42)
      expect(() => processValue('hello')).toThrow()
      expect(() => processValue(NaN)).toThrow()
    })
  })

  describe('ensureBoolean', () => {
    test('should return the value for booleans', () => {
      expect(ensureBoolean(true)).toBe(true)
      expect(ensureBoolean(false)).toBe(false)
    })

    test('should throw for non-booleans', () => {
      expect(() => ensureBoolean(0)).toThrow('Expected a boolean')
      expect(() => ensureBoolean(1)).toThrow('Expected a boolean')
      expect(() => ensureBoolean('true')).toThrow('Expected a boolean')
      expect(() => ensureBoolean(null)).toThrow('Expected a boolean')
      expect(() => ensureBoolean(undefined)).toThrow('Expected a boolean')
    })

    test('should throw with custom message', () => {
      expect(() => ensureBoolean(0, 'Value must be a boolean')).toThrow(
        'Value must be a boolean',
      )
    })

    test('should narrow type correctly', () => {
      const value: unknown = true
      const result = ensureBoolean(value)

      expectTypeOf(result).toEqualTypeOf<boolean>()
      expect(result).toBe(true)
    })

    test('should narrow type correctly in conditional', () => {
      const processValue = (value: unknown): string => {
        return ensureBoolean(value) ? 'true' : 'false'
      }

      expect(processValue(true)).toBe('true')
      expect(processValue(false)).toBe('false')
      expect(() => processValue('hello')).toThrow()
    })
  })

  describe('ensureBigint', () => {
    test('should return the value for bigint values', () => {
      expect(ensureBigint(BigInt(0))).toBe(0n)
      expect(ensureBigint(BigInt(42))).toBe(42n)
      expect(ensureBigint(BigInt(-1))).toBe(-1n)
      expect(ensureBigint(0n)).toBe(0n)
      expect(ensureBigint(42n)).toBe(42n)
    })

    test('should throw for non-bigint values', () => {
      expect(() => ensureBigint(0)).toThrow('Expected a bigint')
      expect(() => ensureBigint(42)).toThrow('Expected a bigint')
      expect(() => ensureBigint('42')).toThrow('Expected a bigint')
      expect(() => ensureBigint(true)).toThrow('Expected a bigint')
      expect(() => ensureBigint(null)).toThrow('Expected a bigint')
      expect(() => ensureBigint(undefined)).toThrow('Expected a bigint')
      expect(() => ensureBigint({})).toThrow('Expected a bigint')
    })

    test('should throw with custom message', () => {
      expect(() => ensureBigint(42, 'Value must be a bigint')).toThrow(
        'Value must be a bigint',
      )
      expect(() => ensureBigint(null, 'Value must be a bigint')).toThrow(
        'Value must be a bigint',
      )
    })

    test('should narrow type correctly', () => {
      const value: unknown = BigInt(42)
      const result = ensureBigint(value)

      expectTypeOf(result).toEqualTypeOf<bigint>()
      expect(result).toBe(42n)
    })
  })

  describe('ensureSymbol', () => {
    test('should return the value for symbol values', () => {
      const sym = Symbol('test')
      expect(ensureSymbol(sym)).toBe(sym)

      const sym2 = Symbol()
      expect(ensureSymbol(sym2)).toBe(sym2)

      const sym3 = Symbol.for('key')
      expect(ensureSymbol(sym3)).toBe(sym3)
    })

    test('should throw for non-symbol values', () => {
      expect(() => ensureSymbol('symbol')).toThrow('Expected a symbol')
      expect(() => ensureSymbol(42)).toThrow('Expected a symbol')
      expect(() => ensureSymbol(true)).toThrow('Expected a symbol')
      expect(() => ensureSymbol(null)).toThrow('Expected a symbol')
      expect(() => ensureSymbol(undefined)).toThrow('Expected a symbol')
      expect(() => ensureSymbol({})).toThrow('Expected a symbol')
    })

    test('should throw with custom message', () => {
      expect(() => ensureSymbol('symbol', 'Value must be a symbol')).toThrow(
        'Value must be a symbol',
      )
      expect(() => ensureSymbol(null, 'Value must be a symbol')).toThrow(
        'Value must be a symbol',
      )
    })

    test('should narrow type correctly', () => {
      const value: unknown = Symbol('test')
      const result = ensureSymbol(value)

      expectTypeOf(result).toEqualTypeOf<symbol>()
      expect(result.toString()).toContain('Symbol')
    })
  })

  describe('ensureInstanceOf', () => {
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
      test('should return the value for Date objects', () => {
        const date = new Date()
        expect(ensureInstanceOf(date, Date)).toBe(date)
        expect(ensureInstanceOf(new Date('2023-01-01'), Date)).toBeInstanceOf(
          Date,
        )
        expect(ensureInstanceOf(new Date(0), Date)).toBeInstanceOf(Date)
        expect(ensureInstanceOf(new Date('invalid'), Date)).toBeInstanceOf(Date)
      })

      test('should return the value for Error objects', () => {
        const err = new Error('test')
        expect(ensureInstanceOf(err, Error)).toBe(err)
        expect(
          ensureInstanceOf(new TypeError('test'), TypeError),
        ).toBeInstanceOf(TypeError)
        expect(ensureInstanceOf(new TypeError('test'), Error)).toBeInstanceOf(
          Error,
        )
      })

      test('should return the value for custom class instances', () => {
        const animal = new Animal('Fluffy')
        expect(ensureInstanceOf(animal, Animal)).toBe(animal)
      })

      test('should return the value for extended class instances', () => {
        const dog = new Dog('Buddy', 'Golden Retriever')
        expect(ensureInstanceOf(dog, Dog)).toBe(dog)
        expect(ensureInstanceOf(dog, Animal)).toBe(dog)
      })
    })

    describe('sad paths', () => {
      test('should throw for non-Date values when checking Date', () => {
        expect(() => ensureInstanceOf('2023-01-01', Date)).toThrow(
          'Expected instance of Date',
        )
        expect(() => ensureInstanceOf(1234567890, Date)).toThrow(
          'Expected instance of Date',
        )
        expect(() => ensureInstanceOf({}, Date)).toThrow(
          'Expected instance of Date',
        )
        expect(() => ensureInstanceOf(null, Date)).toThrow(
          'Expected instance of Date',
        )
        expect(() => ensureInstanceOf(undefined, Date)).toThrow(
          'Expected instance of Date',
        )
      })

      test('should throw for non-Error values when checking Error', () => {
        expect(() => ensureInstanceOf('error', Error)).toThrow(
          'Expected instance of Error',
        )
        expect(() => ensureInstanceOf({ message: 'error' }, Error)).toThrow(
          'Expected instance of Error',
        )
        expect(() => ensureInstanceOf(null, Error)).toThrow(
          'Expected instance of Error',
        )
      })

      test('should throw for non-instance values when checking custom classes', () => {
        expect(() => ensureInstanceOf({ name: 'Fluffy' }, Animal)).toThrow(
          'Expected instance of Animal',
        )
        expect(() => ensureInstanceOf('Fluffy', Animal)).toThrow(
          'Expected instance of Animal',
        )
        expect(() => ensureInstanceOf(null, Animal)).toThrow(
          'Expected instance of Animal',
        )
      })

      test('should throw when checking wrong class hierarchy', () => {
        const animal = new Animal('Fluffy')
        expect(() => ensureInstanceOf(animal, Dog)).toThrow(
          'Expected instance of Dog',
        )
      })
    })

    describe('custom error message', () => {
      test('should throw with a custom message', () => {
        expect(() =>
          ensureInstanceOf(new Animal('Fluffy'), Dog, 'Value must be a Dog'),
        ).toThrow('Value must be a Dog')
      })
    })

    describe('type narrowing', () => {
      test('should narrow type correctly for Date', () => {
        const value: unknown = new Date()
        const result = ensureInstanceOf(value, Date)

        expectTypeOf(result).toEqualTypeOf<Date>()
        expect(result.getTime()).toBeTypeOf('number')
      })

      test('should narrow type correctly for Error', () => {
        const value: unknown = new Error('test')
        const result = ensureInstanceOf(value, Error)

        expectTypeOf(result).toEqualTypeOf<Error>()
        expect(result.message).toBe('test')
        expect(result.stack).toBeDefined()
      })

      test('should narrow type correctly for custom class', () => {
        const value: unknown = new Animal('Fluffy')
        const result = ensureInstanceOf(value, Animal)

        expectTypeOf(result).toEqualTypeOf<Animal>()
        expect(result.name).toBe('Fluffy')
      })

      test('should narrow type correctly for extended class', () => {
        const value: unknown = new Dog('Buddy', 'Golden Retriever')
        const result = ensureInstanceOf(value, Dog)

        expectTypeOf(result).toEqualTypeOf<Dog>()
        expect(result.name).toBe('Buddy')
        expect(result.breed).toBe('Golden Retriever')
      })

      test('should narrow type correctly for extended class checking base class', () => {
        const value: unknown = new Dog('Buddy', 'Golden Retriever')
        const result = ensureInstanceOf(value, Animal)

        expectTypeOf(result).toEqualTypeOf<Animal>()
        expect(result.name).toBe('Buddy')
      })
    })
  })
})

import { describe, expect, expectTypeOf, test } from 'vitest'
import { ensureArray, ensureKeyOf } from './collections'
import { ensureDefined } from './existence'
import { ensure } from './index'
import { ensureString } from './primitives'

describe('ensure namespace', () => {
  describe('ensure.string', () => {
    test('runtime parity with ensureString', () => {
      expect(ensure.string('hello')).toBe(ensureString('hello'))
      expect(() => ensure.string(42)).toThrow('Expected a string')
      expect(() => ensureString(42)).toThrow('Expected a string')
    })

    test('returns narrowed type through namespace', () => {
      const value: unknown = 'hello'
      const result = ensure.string(value)
      expectTypeOf(result).toEqualTypeOf<string>()
      expect(result.toUpperCase()).toBe('HELLO')
    })
  })

  describe('ensure.defined', () => {
    test('runtime parity with ensureDefined', () => {
      expect(ensure.defined('hello')).toBe(ensureDefined('hello'))
      expect(ensure.defined(0)).toBe(ensureDefined(0))
      expect(() => ensure.defined(null)).toThrow('Expected a defined value')
      expect(() => ensureDefined(null)).toThrow('Expected a defined value')
      expect(() => ensure.defined(undefined)).toThrow(
        'Expected a defined value',
      )
    })

    test('returns narrowed type through namespace', () => {
      const value: string | null | undefined = 'hello'
      const result = ensure.defined(value)
      expectTypeOf(result).toEqualTypeOf<string>()
      expect(result).toBe('hello')
    })
  })

  describe('ensure.array', () => {
    test('runtime parity with ensureArray', () => {
      expect(ensure.array([])).toEqual(ensureArray([]))
      expect(ensure.array([1, 2])).toEqual(ensureArray([1, 2]))
      expect(() => ensure.array('hello')).toThrow('Expected an array')
      expect(() => ensureArray('hello')).toThrow('Expected an array')
      expect(() => ensure.array({})).toThrow('Expected an array')
    })

    test('returns narrowed type through namespace', () => {
      const value: unknown = [1, 2, 3]
      const result = ensure.array(value)
      expectTypeOf(result).toEqualTypeOf<unknown[]>()
      expect(result.length).toBe(3)
    })
  })

  describe('ensure.keyOf', () => {
    test('runtime parity with ensureKeyOf', () => {
      const record = { foo: 1, bar: 2 } as const
      expect(ensure.keyOf('foo', record)).toBe(ensureKeyOf('foo', record))
      expect(ensure.keyOf('bar', record)).toBe(ensureKeyOf('bar', record))
      expect(() => ensure.keyOf('baz', record)).toThrow(
        'Expected one of following values: foo, bar',
      )
      expect(() => ensureKeyOf('baz', record)).toThrow(
        'Expected one of following values: foo, bar',
      )
    })

    test('returns narrowed type through namespace', () => {
      const record = { foo: 1, bar: 2 } as const
      const key = 'foo' as string
      const result = ensure.keyOf(key, record)
      expectTypeOf(result).toEqualTypeOf<'foo' | 'bar'>()
      expect(record[result]).toBe(1)
    })
  })
})

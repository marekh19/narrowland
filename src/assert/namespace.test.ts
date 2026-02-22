import { describe, expect, expectTypeOf, test } from 'vitest'
import { assertArray, assertKeyOf } from './collections'
import { assertDefined } from './existence'
import { assert } from './index'
import { assertString } from './primitives'

describe('assert namespace', () => {
  describe('assert.string', () => {
    test('runtime parity with assertString', () => {
      expect(() => assert.string('hello')).not.toThrow()
      expect(() => assert.string(42)).toThrow('Expected a string')
      expect(() => assertString(42)).toThrow('Expected a string')
    })

    test('narrows type through namespace', () => {
      const value: unknown = 'hello'
      assert.string(value)
      expectTypeOf(value).toEqualTypeOf<string>()
      expect(value.toUpperCase()).toBe('HELLO')
    })
  })

  describe('assert.defined', () => {
    test('runtime parity with assertDefined', () => {
      expect(() => assert.defined('hello')).not.toThrow()
      expect(() => assert.defined(0)).not.toThrow()
      expect(() => assert.defined(null)).toThrow('Expected a defined value')
      expect(() => assertDefined(null)).toThrow('Expected a defined value')
      expect(() => assert.defined(undefined)).toThrow(
        'Expected a defined value',
      )
    })

    test('narrows type through namespace', () => {
      const value: string | null | undefined = 'hello'
      assert.defined(value)
      expectTypeOf(value).toEqualTypeOf<string>()
      expect(value).toBe('hello')
    })
  })

  describe('assert.array', () => {
    test('runtime parity with assertArray', () => {
      expect(() => assert.array([])).not.toThrow()
      expect(() => assert.array([1, 2])).not.toThrow()
      expect(() => assert.array('hello')).toThrow('Expected an array')
      expect(() => assertArray('hello')).toThrow('Expected an array')
      expect(() => assert.array({})).toThrow('Expected an array')
    })

    test('narrows type through namespace', () => {
      const value: unknown = [1, 2, 3]
      assert.array(value)
      expectTypeOf(value).toEqualTypeOf<unknown[]>()
      expect(value.length).toBe(3)
    })
  })

  describe('assert.keyOf', () => {
    test('runtime parity with assertKeyOf', () => {
      const record = { foo: 1, bar: 2 } as const
      expect(() => assert.keyOf('foo', record)).not.toThrow()
      expect(() => assert.keyOf('bar', record)).not.toThrow()
      expect(() => assert.keyOf('baz', record)).toThrow(
        'Expected one of following values: foo, bar',
      )
      expect(() => assertKeyOf('baz', record)).toThrow(
        'Expected one of following values: foo, bar',
      )
    })

    test('narrows type through namespace', () => {
      const record = { foo: 1, bar: 2 } as const
      const key = 'foo' as string
      assert.keyOf(key, record)
      expectTypeOf(key).toEqualTypeOf<'foo' | 'bar'>()
      expect(record[key]).toBe(1)
    })
  })
})

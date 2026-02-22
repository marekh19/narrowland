import { describe, expect, expectTypeOf, test } from 'vitest'
import { isArray, isKeyOf } from './collections'
import { isDefined } from './existence'
import { is } from './index'
import { isString } from './primitives'

describe('is namespace', () => {
  describe('is.string', () => {
    test('runtime parity with isString', () => {
      const values = ['hello', 42, null, undefined, true, {}, []]
      for (const v of values) {
        expect(is.string(v)).toBe(isString(v))
      }
    })

    test('narrows type through namespace', () => {
      const value: unknown = 'hello'
      if (is.string(value)) {
        expectTypeOf(value).toEqualTypeOf<string>()
        expect(value.toUpperCase()).toBe('HELLO')
      }
    })
  })

  describe('is.defined', () => {
    test('runtime parity with isDefined', () => {
      const values = ['hello', 42, null, undefined, 0, '', false]
      for (const v of values) {
        expect(is.defined(v)).toBe(isDefined(v))
      }
    })

    test('narrows type through namespace', () => {
      const value: string | null | undefined = 'hello'
      if (is.defined(value)) {
        expectTypeOf(value).toEqualTypeOf<string>()
        expect(value).toBe('hello')
      }
    })
  })

  describe('is.array', () => {
    test('runtime parity with isArray', () => {
      const values = [[], [1, 2], 'hello', 42, null, {}, undefined]
      for (const v of values) {
        expect(is.array(v)).toBe(isArray(v))
      }
    })

    test('narrows type through namespace', () => {
      const value: unknown = [1, 2, 3]
      if (is.array(value)) {
        expectTypeOf(value).toEqualTypeOf<unknown[]>()
        expect(value.length).toBe(3)
      }
    })
  })

  describe('is.keyOf', () => {
    test('runtime parity with isKeyOf', () => {
      const record = { foo: 1, bar: 2 } as const
      const keys = ['foo', 'bar', 'baz', 'qux']
      for (const k of keys) {
        expect(is.keyOf(k, record)).toBe(isKeyOf(k, record))
      }
    })

    test('narrows type through namespace', () => {
      const record = { foo: 1, bar: 2 } as const
      const key = 'foo' as string
      if (is.keyOf(key, record)) {
        expectTypeOf(key).toEqualTypeOf<'foo' | 'bar'>()
        expect(record[key]).toBe(1)
      }
    })
  })
})

import { describe, expect, test } from 'vitest'

import { raiseAssertError, raiseEnsureError, raiseError } from './raise'

describe('raise', () => {
  describe('raiseError', () => {
    test('should throw error with default name', () => {
      expect(() => raiseError('Test error')).toThrow('Test error')

      try {
        raiseError('Test error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).name).toBe('InvariantError')
        expect((error as Error).message).toBe('Test error')
      }
    })

    test('should throw error with custom options', () => {
      const cause = new Error('Original error')

      try {
        raiseError('Test error', {
          name: 'ValidationError',
          code: 'V001',
          cause,
        })
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).name).toBe('ValidationError')
        expect((error as Error).message).toBe('Test error')
        //@ts-expect-error - testing augmented property
        expect((error as Error).code).toBe('V001')
        expect((error as Error).cause).toBe(cause)
      }
    })

    test('should have never return type', () => {
      const fn = () => {
        raiseError('This never returns')
        return 'unreachable'
      }

      expect(() => fn()).toThrow('This never returns')
    })
  })

  describe('raiseAssertError', () => {
    test('should throw AssertionError directly', () => {
      expect(() => raiseAssertError('Assertion failed')).toThrow(
        'Assertion failed',
      )

      try {
        raiseAssertError('Assertion failed')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).name).toBe('AssertionError')
        expect((error as Error).message).toBe('Assertion failed')
      }
    })

    test('should work with custom options', () => {
      const cause = new Error('Original error')

      try {
        raiseAssertError('Assertion failed', {
          code: 'A001',
          cause,
        })
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).name).toBe('AssertionError')
        expect((error as Error).message).toBe('Assertion failed')
        //@ts-expect-error - testing augmented property
        expect((error as Error).code).toBe('A001')
        expect((error as Error).cause).toBe(cause)
      }
    })
  })

  describe('raiseEnsureError', () => {
    test('should throw EnsureError directly', () => {
      expect(() => raiseEnsureError('Ensure failed')).toThrow('Ensure failed')

      try {
        raiseEnsureError('Ensure failed')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).name).toBe('EnsureError')
        expect((error as Error).message).toBe('Ensure failed')
      }
    })

    test('should work with custom options', () => {
      const cause = new Error('Original error')

      try {
        raiseEnsureError('Ensure failed', {
          code: 'E001',
          cause,
        })
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).name).toBe('EnsureError')
        expect((error as Error).message).toBe('Ensure failed')
        //@ts-expect-error - testing augmented property
        expect((error as Error).code).toBe('E001')
        expect((error as Error).cause).toBe(cause)
      }
    })
  })
})

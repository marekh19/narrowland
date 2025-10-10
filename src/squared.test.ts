import { expect, test } from 'vitest'
import { squared } from './squared'

test('squared', () => {
  expect(squared(2)).toBe(4)
  expect(squared(-10)).toBe(100)
  expect(squared(1)).toBe(1)
  expect(squared(0)).toBe(0)
  expect(squared(256)).toBe(65536)
})

# 🛡️ Narrowland

[![codecov](https://codecov.io/gh/marekh19/narrowland/branch/main/graph/badge.svg)](https://codecov.io/gh/marekh19/narrowland)
[![npm version](https://img.shields.io/npm/v/narrowland.svg)](https://www.npmjs.com/package/narrowland)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/narrowland)](https://bundlephobia.com/package/narrowland)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight TypeScript library providing type guards, type assertions, ensure functions, and invariant utilities for runtime type narrowing.

## 🚀 30-Second Pitch

**Narrowland** solves the problem of runtime type narrowing in TypeScript applications. Instead of writing verbose type checks and assertions, you get a clean, consistent API that provides:

- **Type Guards** (`is.*`) - Check types without throwing errors, perfect for conditional logic
- **Type Assertions** (`assert.*`) - Throw errors for invalid types with full TypeScript inference
- **Ensure Functions** (`ensure.*`) - Validate and return the narrowed value in one step, throwing `EnsureError` on failure
- **Invariant Utilities** (`invariant`, `raiseError`) - Handle edge cases and invariants gracefully

All functions are **tree-shakeable**, **zero-dependency**, and **fully typed** with TypeScript's type narrowing. You can import individual functions or use the grouped APIs.

## 📦 Installation

```bash
npm install narrowland
# or
pnpm add narrowland
# or
yarn add narrowland
```

## 🎯 Quick Start

```typescript
import { isString, assertNumber, ensureString, ensureDefined, invariant } from 'narrowland'

// Or import grouped APIs
import { is, assert, ensure } from 'narrowland'

// Type guards - return boolean, don't throw
if (isString(userInput)) {
  // userInput is now typed as string
  console.log(userInput.toUpperCase())
}

// Type guards from grouped import
if (is.string(userInput)) {
  // userInput is now typed as string
  console.log(userInput.toUpperCase())
}

// Assertions - throw on invalid types, narrow in same scope
assertNumber(age) // throws if not a number
// age is now typed as number

// Ensure - validate and return the narrowed value in one step
const name = ensure.string(rawName) // throws EnsureError if not a string
// name is typed as string

const config = ensure.defined(maybeConfig, 'Config is required')
// config is typed as NonNullable<typeof maybeConfig>

// Invariant - check conditions (throws on falsy, does nothing on truthy)
invariant(user.age >= 18, 'User must be an adult')
```

## 📚 API Reference

> All functions except `is.*` throw errors if the condition is not satisfied.

### Type Guards (`is.*`)

Type guards return `boolean` and narrow types without throwing errors. **Safer than assertions** because they don't throw.

| Function | Type Guard | Description |
|----------|------------|-------------|
| `is.defined(value)` | `value is NonNullable<T>` | Checks if value is not null or undefined |
| `is.notNull(value)` | `value is Exclude<T, null>` | Checks if value is not null |
| `is.truthy(value)` | `value is Exclude<T, false \| 0 \| '' \| null \| undefined>` | Checks if value is truthy |
| `is.falsy(value)` | `value is Extract<T, false \| 0 \| '' \| null \| undefined>` | Checks if value is falsy |
| `is.string(value)` | `value is string` | Checks if value is a string |
| `is.nonEmptyString(value)` | `value is string` | Checks if value is a non-empty string |
| `is.number(value)` | `value is number` | Checks if value is a finite number |
| `is.boolean(value)` | `value is boolean` | Checks if value is a boolean |
| `is.bigint(value)` | `value is bigint` | Checks if value is a bigint |
| `is.symbol(value)` | `value is symbol` | Checks if value is a symbol |
| `is.instanceOf(value, constructor)` | `value is T` | Checks if value is an instance of the given constructor |
| `is.array(value)` | `value is T[]` | Checks if value is an array |
| `is.nonEmptyArray(value)` | `value is [T, ...T[]]` | Checks if value is a non-empty array |
| `is.arrayOf(value, guard)` | `value is T[]` | Checks if value is an array whose items satisfy the provided guard |
| `is.stringLiteral(value, literals)` ⚠️ | `value is T[number]` | Checks if value is a member of string literals array (deprecated: use `is.oneOf` instead, will be removed in v2.0.0) |
| `is.oneOf(value, collection)` | `value is T[number]` | Checks if value is a member of the provided collection (works with any type) |
| `is.object(value)` | `value is T` | Checks if value is a plain object |
| `is.propertyOf(key, predicate)` | `obj is T & { [P in K]-?: U }` | Checks that the selected property satisfies the provided predicate and makes it required |
| `is.keyOf(value, record)` | `value is T & keyof U` | Checks if value is a key of the provided record |

### Type Assertions (`assert.*`)

Assertions throw errors for invalid types and narrow types in the same scope. **Use when you expect the value to be valid**.

| Function | Assertion | Description |
|----------|-----------|-------------|
| `assert.defined(value, message?)` | `asserts value is NonNullable<T>` | Throws if value is null or undefined |
| `assert.notNull(value, message?)` | `asserts value is Exclude<T, null>` | Throws if value is null |
| `assert.truthy(value, message?)` | `asserts value is Exclude<T, false \| 0 \| '' \| null \| undefined>` | Throws if value is falsy |
| `assert.falsy(value, message?)` | `asserts value is Extract<T, false \| 0 \| '' \| null \| undefined>` | Throws if value is truthy |
| `assert.string(value, message?)` | `asserts value is string` | Throws if value is not a string |
| `assert.nonEmptyString(value, message?)` | `asserts value is string` | Throws if value is not a non-empty string |
| `assert.number(value, message?)` | `asserts value is number` | Throws if value is not a finite number |
| `assert.boolean(value, message?)` | `asserts value is boolean` | Throws if value is not a boolean |
| `assert.bigint(value, message?)` | `asserts value is bigint` | Throws if value is not a bigint |
| `assert.symbol(value, message?)` | `asserts value is symbol` | Throws if value is not a symbol |
| `assert.instanceOf(value, constructor, message?)` | `asserts value is T` | Throws if value is not an instance of the given constructor |
| `assert.array(value, message?)` | `asserts value is T[]` | Throws if value is not an array |
| `assert.nonEmptyArray(value, message?)` | `asserts value is [T, ...T[]]` | Throws if value is not a non-empty array |
| `assert.arrayOf(value, guard, message?)` | `asserts value is T[]` | Throws if value is not an array whose items satisfy the provided guard |
| `assert.stringLiteral(value, literals, message?)` ⚠️ | `value is T[number]` | Throws if value is not a member of provided string literals array (deprecated: use `assert.oneOf` instead, will be removed in v2.0.0) |
| `assert.oneOf(value, collection, message?)` | `asserts value is T[number]` | Throws if value is not a member of the provided collection (works with any type) |
| `assert.object(value, message?)` | `asserts value is T` | Throws if value is not a plain object |
| `assert.keyOf(value, record, message?)` | `asserts value is T & keyof U` | Throws if value is not a key of the provided record |
| `assert.fromPredicate(predicate, message?)` | `(value, message?) => asserts value is T` | Creates custom assertion from predicate |

### Ensure Functions (`ensure.*`)

Ensure functions validate a value and **return the narrowed value** directly, throwing `EnsureError` on failure. They combine the check and return into a single expression — ideal for inline assignments and pipelines.

| Function | Return Type | Description |
|----------|-------------|-------------|
| `ensure.defined(value, message?)` | `NonNullable<T>` | Returns value or throws if null/undefined |
| `ensure.notNull(value, message?)` | `Exclude<T, null>` | Returns value or throws if null |
| `ensure.truthy(value, message?)` | `Exclude<T, false \| 0 \| '' \| null \| undefined>` | Returns value or throws if falsy |
| `ensure.string(value, message?)` | `string` | Returns value or throws if not a string |
| `ensure.nonEmptyString(value, message?)` | `string` | Returns value or throws if not a non-empty string |
| `ensure.number(value, message?)` | `number` | Returns value or throws if not a finite number |
| `ensure.boolean(value, message?)` | `boolean` | Returns value or throws if not a boolean |
| `ensure.bigint(value, message?)` | `bigint` | Returns value or throws if not a bigint |
| `ensure.symbol(value, message?)` | `symbol` | Returns value or throws if not a symbol |
| `ensure.instanceOf(value, constructor, message?)` | `T` | Returns value or throws if not an instance of the given constructor |
| `ensure.array(value, message?)` | `T[]` | Returns value or throws if not an array |
| `ensure.nonEmptyArray(value, message?)` | `[T, ...T[]]` | Returns value or throws if not a non-empty array |
| `ensure.arrayOf(value, guard, message?)` | `T[]` | Returns value or throws if not an array whose items satisfy the provided guard |
| `ensure.oneOf(value, collection, message?)` | `T[number]` | Returns value or throws if not a member of the provided collection |
| `ensure.object(value, message?)` | `T` | Returns value or throws if not a plain object |
| `ensure.keyOf(value, record, message?)` | `T & keyof U` | Returns value or throws if not a key of the provided record |
| `ensure.fromPredicate(predicate, message?)` | `(value, message?) => T` | Creates custom ensure function from predicate |

### Invariant Utilities

| Function | Return Type | Description |
|----------|-------------|-------------|
| `ensure(value, message?)` ⚠️ | `NonNullable<T>` | Calling `ensure` as a function is deprecated — use `ensure.defined` instead. In v2.0.0, the call signature will be removed. |
| `invariant(condition, message?)` | `asserts condition` | Throws if condition is falsy (generic condition checker) |
| `raiseError(message, options?)` | `never` | Throws error with custom name/code/cause (most flexible) |

## 🎨 When to Use What?

Narrowland provides a palette of solutions from most generic to very specific:

### **Type Guards (`is.*`)** - Safest, Most Flexible

- **Use when**: You want to check types without throwing
- **Best for**: Conditional logic, filtering, optional validation
- **Example**: `if (isString(value)) { /* value is string */ }`

### **Type Assertions (`assert.*`)** - Narrow in Place

- **Use when**: You expect the value to be valid and want to fail fast with narrowing in the same scope
- **Best for**: Input validation at the top of functions, API boundaries
- **Example**: `assertString(userInput)` - throws immediately if not string, narrows type below

### **Ensure Functions (`ensure.*`)** - Validate and Return

- **Use when**: You need the narrowed value as a return or assignment in one expression
- **Best for**: Inline assignments, function arguments, pipelines, destructuring
- **Throws**: `EnsureError` if validation fails
- **Example**: `const name = ensure.string(rawInput)` - validates and returns the string

### **Invariant** - Generic Condition Checker

- **Use when**: You want to check any condition, not just types
- **Best for**: Business logic validation, state checks, complex conditions
- **Example**: `invariant(user.age >= 18, 'User must be adult')`

### **RaiseError** - Most Flexible Error Creation

- **Use when**: You need custom error types with specific properties or inline assertions
- **Best for**: API errors, domain-specific errors, when you need error codes, inline assertions
- **Example**: `getUserById(maybeId ?? raiseError('User id must be defined'))`

## 🍳 Copy-Paste Recipes

### Type Guards - Simple Checks

```typescript
import { isDefined, isTruthy } from 'narrowland'

// Check if value exists
if (isDefined(maybeValue)) {
  // maybeValue is now NonNullable<typeof maybeValue>
  console.log(maybeValue)
}

// Check if value is truthy
if (isTruthy(userInput)) {
  // userInput is now truthy type
  return userInput
}
```

### Assertions - Fail Fast

```typescript
import { assertString } from 'narrowland'

function processInput(input: unknown) {
  assertString(input) // throws if not string
  // input is now string
  return input.toUpperCase()
}
```

### Ensure - Validate and Return

```typescript
import { ensure } from 'narrowland'

// Validate and assign in one step
const name = ensure.string(rawInput) // throws EnsureError if not a string
const age = ensure.number(rawAge) // throws EnsureError if not a finite number

// Handle null/undefined values
function getUserName(user: { name?: string | null }) {
  const name = ensure.defined(user.name, 'Name is required')
  // name is now string (was string | null | undefined)
  return name
}

// Use inline as function arguments
processUser(ensure.string(data.name), ensure.number(data.age))
```

### Ensure - Custom Validators

```typescript
import { ensure, isString } from 'narrowland'

// Create a reusable ensure function from any type guard
const ensureMyString = ensure.fromPredicate(isString, 'Must be a string')

const value = ensureMyString(input) // returns string or throws EnsureError
```

### Invariant - Business Rules

```typescript
import { invariant } from 'narrowland'

function calculateAge(birthYear: number) {
  invariant(birthYear > 1900, 'Invalid birth year')
  invariant(birthYear <= new Date().getFullYear(), 'Birth year cannot be in future')
  
  return new Date().getFullYear() - birthYear
}
```

### Filtering Arrays

```typescript
import { isString, isInstanceOf } from 'narrowland'

// Filter strings from mixed array
const mixedArray = ['hello', 42, 'world', true]
const strings = mixedArray.filter(isString) // TypeScript knows these are strings

// Filter Date instances from mixed array
const values = [new Date(), '2023-01-01', new Date('2024-01-01'), null, 42]
const dates = values.filter((v) => isInstanceOf(v, Date)) // TypeScript knows `dates` is Date[]
```

### Property Guards - Filter Objects by Required Keys

```typescript
import { isDefined, isPropertyOf } from 'narrowland'

type User = {
  id: string
  email?: string | null
}

const users: User[] = [
  { id: '1', email: 'one@example.com' },
  { id: '2', email: null },
  { id: '3' },
]

const hasEmail = isPropertyOf('email', isDefined)

const contactableUsers = users.filter(hasEmail)
// ?^ contactableUsers is typed as PropNarrow<User, "email", {}>[]
contactableUsers.forEach((user) => {
  user.email.toLowerCase()
  // ?^ user.email is typed as string
})
```

### ArrayOf - Array Type Narrowing

```typescript
import { isArrayOf, isString } from 'narrowland'

// Narrow array of strings
const maybeStringArray: unknown = ['hello', 'world', 'typescript']
if (isArrayOf(maybeStringArray, isString)) {
  // maybeStringArray is now typed as string[]
  const uppercased = maybeStringArray.map((s) => s.toUpperCase())
}
```

### OneOf - Union Type Narrowing

```typescript
import { is, assert, ensure } from 'narrowland'

// Works with any type, not just strings
const status = 'pending' as unknown
const validStatuses = ['pending', 'completed', 'failed'] as const

// Type guard - returns boolean
if (is.oneOf(status, validStatuses)) {
  // status is now typed as 'pending' | 'completed' | 'failed'
  console.log(status.toUpperCase())
}

// Assertion - throws if invalid
assert.oneOf(status, validStatuses)
// status is now typed as 'pending' | 'completed' | 'failed'

// Ensure - validate and return in one step
const validStatus = ensure.oneOf(status, validStatuses)
// validStatus is typed as 'pending' | 'completed' | 'failed'
```

### KeyOf - Safe Object Key Access

```typescript
import { is, assert, ensure } from 'narrowland'

const handlers = {
  click: () => 'clicked',
  submit: () => 'submitted',
} as const

// Type guard - returns boolean
const eventName = 'click' as string
if (is.keyOf(eventName, handlers)) {
  // eventName is now typed as 'click' | 'submit'
  handlers[eventName]() // Safe to call
}

// Assertion - throws if invalid
assert.keyof(eventName, handlers)
// eventName is now typed as 'click' | 'submit'
handlers[eventName]() // Safe to call

// Ensure - validate and return in one step
const key = ensure.keyOf(eventName, handlers)
handlers[key]() // Safe to call
```

## 📊 Bundle Size

- **Size**: 1.08kB (minified + brotli)
- **Dependencies**: 0
- **Tree-shakeable**: ✅ (import individual functions)
- **ESM + CJS**: ✅

## 🛠️ Development

### Prerequisites

- Node.js 20+
- pnpm 8+

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/narrowland.git
cd narrowland

# Install dependencies
pnpm install

# Build the library
pnpm build

# Run in development mode
pnpm dev
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git switch -c feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Add tests for new functionality
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/marekh19/narrowland/blob/main/LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [tiny-invariant](https://github.com/alexreardon/tiny-invariant) for the invariant pattern
- Built with modern tooling: Vitest, Biome, RSLib
- Zero dependencies for maximum compatibility

---

**Made with ❤️ for the TypeScript community**

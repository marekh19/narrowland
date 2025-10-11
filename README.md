# 🛡️ Narrowland

[![codecov](https://codecov.io/gh/your-username/narrowland/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/narrowland)
[![npm version](https://img.shields.io/npm/v/narrowland.svg)](https://www.npmjs.com/package/narrowland)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/narrowland)](https://bundlephobia.com/package/narrowland)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight TypeScript library providing type guards, type assertions, and invariant utilities for runtime type narrowing.

## 🚀 30-Second Pitch

**Narrowland** solves the problem of runtime type narrowing in TypeScript applications. Instead of writing verbose type checks and assertions, you get a clean, consistent API that provides:

- **Type Guards** (`is.*`) - Check types without throwing errors, perfect for conditional logic
- **Type Assertions** (`assert.*`) - Throw errors for invalid types with full TypeScript inference
- **Invariant Utilities** (`ensure`, `invariant`, `raiseError`) - Handle edge cases and invariants gracefully

All functions are **tree-shakeable**, **zero-dependency**, and **fully typed** with TypeScript's type narrowing. You can import individual functions or use the grouped APIs - it's completely tree-shakeable.

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
// Import individual functions (tree-shakeable)
import { isString, assertNumber, ensure, invariant } from 'narrowland'

// Or import grouped APIs
import { is, assert, ensure, invariant } from 'narrowland'

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

// Assertions - throw on invalid types
assertNumber(age) // throws if not a number
// age is now typed as number

// Assertions from grouped import
assert.number(age) // throws if not a number
// age is now typed as number

// Ensure - return value or throw (only for null/undefined)
const name = ensure(user.name, 'Name is required')
// name is typed as NonNullable<typeof user.name>

// Invariant - check conditions (throws on falsy, does nothing on truthy)
invariant(isString(items), 'Items must be a string')
```

## 📚 API Reference

> [!NOTE]  
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
| `is.array(value)` | `value is T[]` | Checks if value is an array |
| `is.nonEmptyArray(value)` | `value is [T, ...T[]]` | Checks if value is a non-empty array |
| `is.object(value)` | `value is T` | Checks if value is a plain object |

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
| `assert.array(value, message?)` | `asserts value is T[]` | Throws if value is not an array |
| `assert.nonEmptyArray(value, message?)` | `asserts value is [T, ...T[]]` | Throws if value is not a non-empty array |
| `assert.object(value, message?)` | `asserts value is T` | Throws if value is not a plain object |
| `assert.fromPredicate(predicate, message?)` | `(value, message?) => asserts value is T` | Creates custom assertion from predicate |

### Invariant Utilities

| Function | Return Type | Description |
|----------|-------------|-------------|
| `ensure<T>(value, message?)` | `NonNullable<T>` | Returns value or throws if null/undefined (only checks nullish) |
| `invariant(condition, message?)` | `asserts condition` | Throws if condition is falsy (generic condition checker) |
| `raiseError(message, options?)` | `never` | Throws error with custom name/code/cause (most flexible) |

## 🎨 When to Use What?

Narrowland provides a palette of solutions from most generic to very specific:

### **Type Guards (`is.*`)** - Safest, Most Flexible

- **Use when**: You want to check types without throwing
- **Best for**: Conditional logic, filtering, optional validation
- **Example**: `if (isString(value)) { /* value is string */ }`

### **Type Assertions (`assert.*`)** - Most Direct

- **Use when**: You expect the value to be valid and want to fail fast
- **Best for**: Input validation, API boundaries, when you're confident about the type
- **Example**: `assertString(userInput)` - throws immediately if not string

### **Ensure** - Specific Null/Undefined Check

- **Use when**: You have a maybe value and know it should be defined
- **Best for**: Optional chaining results, API responses, configuration values
- **Throws**: If value is null or undefined (similar to invariant, but only for nullish values)
- **Example**: `const name = ensure(user.name)` - only checks for null/undefined

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

### Ensure - Handle Null/Undefined

```typescript
import { ensure } from 'narrowland'

function getUserName(user: { name?: string | null }) {
  // ensure throws if null/undefined, returns value otherwise
  const name = ensure(user.name, 'Name is required')
  // name is now string (was string | null | undefined)
  return name
}
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
import { isString } from 'narrowland'

const mixedArray = ['hello', 42, 'world', true]
const strings = mixedArray.filter(isString) // TypeScript knows these are strings
```

## 📊 Bundle Size

- **Size**: 602 B (minified + brotli)
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
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Add tests for new functionality
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [tiny-invariant](https://github.com/alexreardon/tiny-invariant) for the invariant pattern
- Built with modern tooling: Vitest, Biome, RSLib
- Zero dependencies for maximum compatibility

---

**Made with ❤️ for the TypeScript community**

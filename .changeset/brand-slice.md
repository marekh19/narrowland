---
'narrowland': minor
---

Add branded types — a new `brand` slice for turning loose primitives into distinct nominal types.

A bare `string` can be an email, a user id, or a slug, and the compiler lets you mix them freely. Branding tags the base type so those values stop being interchangeable, catching a whole class of "passed the wrong id" bugs at compile time.

- `Brand<T, B>` / `Unbrand<T>` — tag a base type (`Brand<string, 'Email'>`, `Brand<number, 'Cents'>`); recover its base.
- `brand<T>(value)` — cast a trusted, already-valid value. No runtime check.
- `createBrand<T>(validate, message?)` — build a reusable constructor that validates first and throws `BrandError`. Existing guards like `isNonEmptyString` work as validators.

```ts
type UserId = Brand<string, 'UserId'>
type Email = Brand<string, 'Email'>

const id = brand<UserId>(row.id)
const toEmail = createBrand<Email>((v) => v.includes('@'))

sendMail(toEmail(input)) // ✅
sendMail(id)             // ❌ compile error — UserId is not an Email
```

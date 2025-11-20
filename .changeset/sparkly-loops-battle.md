---
"narrowland": minor
---

- Add `is.keyOf` type guard and `assert.keyOf` assertion
  - Can be used to safely check if a value is a key of a provided object/record
  - Enables type-safe dynamic property access with full TypeScript inference
- Fix typo in error messages: "folowing" → "following" in `assert.stringLiteral` and `assert.oneOf`
- Fix typo in JSDoc: "narrow" → "narrows" in `is.propertyOf`

---
"narrowland": patch
---

Deprecate `isFalsy` and `assertFalsy` - no valid use case, type narrowing does not work properly. Can be replaced by negating `isTruthy` or `assertTruthy` respectivelly

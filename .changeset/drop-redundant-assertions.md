---
"narrowland": patch
---

Drop redundant type assertions flagged by oxlint 1.73.

Internal cleanup in `ensure`, `ensureOneOf`, `ensureKeyOf`, and `isOneOf`. Runtime output and public type signatures are unchanged — the compiler now verifies the narrowing instead of a blind cast.

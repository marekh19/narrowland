---
"narrowland": patch
---

Fixes TypeScript declaration files being incompatible with `moduleResolution: NodeNext`.

- Previously, rslib emitted per-source-file declarations with extensionless relative imports, causing TypeScript to silently lose all type information in consumer projects using NodeNext resolution.
- Migrated build tooling from rslib to tsdown, which bundles both JS and declarations into single output files by default. Also updated package exports to the modern nested `import`/`require` structure with per-condition type declarations (`.d.mts` for ESM, `d.cts` for CJS).

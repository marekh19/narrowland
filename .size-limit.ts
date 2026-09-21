import type { SizeLimitConfig } from 'size-limit'

export default [
  {
    name: 'Full API',
    path: 'dist/index.mjs',
    limit: '1.7 kB',
  },
  {
    name: 'ensureString',
    path: 'dist/index.mjs',
    import: '{ ensureString }',
    limit: '600 B',
  },
  {
    name: 'isDefined, isOneOf, isKeyOf',
    path: 'dist/index.mjs',
    import: '{ isDefined, isOneOf, isKeyOf }',
    limit: '650 B',
  },
] satisfies SizeLimitConfig

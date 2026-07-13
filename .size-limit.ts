import type { SizeLimitConfig } from 'size-limit'

export default [
  {
    path: 'dist/index.mjs',
    limit: '1.3kB',
  },
] satisfies SizeLimitConfig

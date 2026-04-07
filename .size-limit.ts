import type { SizeLimitConfig } from 'size-limit'

export default [
  {
    path: 'dist/index.mjs',
    limit: '1.25kB',
  },
] satisfies SizeLimitConfig

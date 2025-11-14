import type { SizeLimitConfig } from 'size-limit'

export default [
  {
    path: 'dist/index.js',
    limit: '1kB',
  },
] satisfies SizeLimitConfig

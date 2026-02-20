import type { SizeLimitConfig } from 'size-limit'

export default [
  {
    path: 'dist/index.js',
    limit: '1.1kB',
  },
] satisfies SizeLimitConfig

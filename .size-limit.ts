import type { SizeLimitConfig } from 'size-limit'

export default [
  {
    path: 'dist/index.js',
    limit: '750B',
  },
] satisfies SizeLimitConfig

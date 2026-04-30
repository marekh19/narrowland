import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['typescript', 'unicorn', 'oxc'],
  categories: {
    correctness: 'error',
  },
  rules: {
    'no-console': 'error',
    'typescript/no-explicit-any': 'error',
    'typescript/no-non-null-assertion': 'error',
    'typescript/no-unnecessary-type-assertion': 'error',
  },
  env: {
    builtin: true,
  },
  options: {
    typeAware: true,
  },
})

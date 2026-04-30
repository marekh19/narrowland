import { defineConfig } from 'oxfmt'

export default defineConfig({
  singleQuote: true,
  semi: false,
  printWidth: 80,
  ignorePatterns: ['*.yml', '*.yaml', '*.md'],
})

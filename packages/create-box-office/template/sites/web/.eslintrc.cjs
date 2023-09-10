module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:svelte/prettier',
  ],
  plugins: ['@typescript-eslint', 'import'],
  ignorePatterns: ['*.cjs'],
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte'],
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  ],
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  rules: {
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          orderImportKind: 'asc',
        },
        groups: [
          'type',
          'builtin',
          'external',
          'internal',
          'unknown',
          'parent',
          'sibling',
          'index',
          'object',
        ],
        'newlines-between': 'always',
      },
    ],
  },
}

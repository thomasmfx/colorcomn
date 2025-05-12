import js from '@eslint/js';
import globals from 'globals';
import perfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  { ignores: ['dist/**'] },

  // --- Configuration for Server-Side/Default JS files ---
  {
    files: ['**/*.{js,cjs}'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      js,
      perfectionist,
    },
    rules: {
      ...js.configs.recommended.rules,
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'line-length',
          order: 'desc',
          fallbackSort: {
            type: 'natural',
            order: 'asc',
          },
          groups: [
            'type',
            ['builtin', 'external'],
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],
        },
      ],
    },
  },

  // --- Configuration specifically for CLIENT-SIDE JS Modules ---
  {
    files: ['public/js/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      js,
      perfectionist,
    },
    rules: {
      ...js.configs.recommended.rules,

      'perfectionist/sort-imports': [
        'error',
        {
          type: 'line-length',
          order: 'desc',
          fallbackSort: {
            type: 'natural',
            order: 'asc',
          },
          groups: [
            'type',
            ['builtin', 'external'],
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],
        },
      ],
    },
  },

  eslintPluginPrettierRecommended,
];
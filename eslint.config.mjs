import js from '@eslint/js';
import globals from 'globals';
import perfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  { ignores: ['dist/**'] },
  {
    files: ['**/*.{js,cjs}'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.browser, ...globals.node },
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
            oder: 'asc',
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

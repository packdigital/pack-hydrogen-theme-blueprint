/**
 * @type {import("@types/eslint").Linter.BaseConfig}
 */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:hydrogen/recommended',
    'plugin:hydrogen/typescript',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      parser: '@typescript-eslint/parser',
    },
  ],
  plugins: ['react-refresh', 'import'],
  rules: {
    'no-console': 'off',
    'no-inline-styles': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/forbid-prop-types': 'off',
    'react/no-array-index-key': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/naming-convention': 'off',
    'hydrogen/prefer-image-component': 'off',
    'no-useless-escape': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    'no-case-declarations': 'off',
    'jest/no-deprecated-functions': 'off',
    'react-refresh/only-export-components': [
      'error',
      {
        allowExportNames: [
          'meta',
          'links',
          'headers',
          'loader',
          'action',
          'shouldRevalidate',
        ],
      },
    ],
    'prettier/prettier': ['error', {endOfLine: 'auto'}],
    'tailwindcss/no-custom-classname': [
      'warn',
      {whitelist: ['theme-\\S+', 'swiper-\\S+', 'text-shadow(?:-[a-z0-9]+)?']},
    ],
    'import/order': [
      'error',
      {
        /**
         * @description
         *
         * This keeps imports separate from one another, ensuring that imports are separated
         * by their relative groups. As you move through the groups, imports become closer
         * to the current file.
         *
         * @example
         * ```
         * import fs from 'fs';
         *
         * import package from 'npm-package';
         *
         * import xyz from '~/project-file';
         *
         * import index from '../';
         *
         * import sibling from './foo';
         * ```
         */
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
        'newlines-between': 'always',
        alphabetize: {order: 'asc', caseInsensitive: true},
      },
    ],
  },
  globals: {
    document: true,
    window: true,
  },
};

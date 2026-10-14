/**
 * @type {import("@types/eslint").Linter.BaseConfig}
 */
module.exports = {
  extends: [
    'plugin:hydrogen/recommended',
    'plugin:hydrogen/typescript',
    'plugin:tailwindcss/recommended',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      parser: '@typescript-eslint/parser',
    },
  ],
  plugins: ['import', 'react-refresh'],
  rules: {
    'no-console': 'off',
    'no-inline-styles': 'off',
    /**
     * `Set-Cookie` is the one response header that is legitimately repeated —
     * one line per cookie. `Headers.set()` deletes every existing value before
     * adding its own, so it silently drops every cookie already on the
     * response: Shopify's tracking cookies (appended by Hydrogen's
     * `collectTrackingInformation`), Pack's `pack_session` / `__pack`, and the
     * cart id from `cartSetIdDefault`. Dropping the tracking cookies makes
     * Shopify count a new session on the next request; dropping the cart id
     * loses the cart.
     *
     * This reads as correct in review — `set` looks more deliberate than
     * `append` — which is why it needs a rule rather than vigilance.
     *
     * Building a brand-new Response with a single cookie is fine: that uses a
     * `headers` object literal, not `.set()`, and is not matched here.
     */
    'no-restricted-syntax': [
      'error',
      {
        selector:
          'CallExpression[callee.property.name="set"][arguments.0.value=/^[Ss]et-[Cc]ookie$/]',
        message:
          "`Set-Cookie` is a repeated header — `Headers.set()` deletes every cookie already on the response (Shopify tracking, Pack session, cart id). Use `headers.append('Set-Cookie', …)` instead.",
      },
    ],
    'react-hooks/exhaustive-deps': 'off',
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
    'no-empty': 'off',
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
    'tailwindcss/no-custom-classname': [
      'warn',
      {whitelist: ['theme-\\S+', 'swiper-\\S+']},
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
        pathGroups: [{pattern: '~/**', group: 'internal'}],
        'newlines-between': 'always',
      },
    ],
  },
  globals: {
    document: true,
    window: true,
  },
};

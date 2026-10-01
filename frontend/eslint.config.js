// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import cssModulesPlugin from 'eslint-plugin-css-modules';
import postcssModules from 'eslint-plugin-postcss-modules';
import importPlugin from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      '*.config.*',
      '**/*.d.ts',
      '**/*.d.css.ts',
      'dist',
      'node_modules',
      'package*.json',
      'public',
      'storybook-static',
    ],
  },
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  storybook.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        projectService: true,
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
        warnOnUnsupportedTypeScriptVersion: false,
      },
      globals: globals.browser,
    },
    plugins: {
      'css-modules': cssModulesPlugin,
      'postcss-modules': postcssModules,
      perfectionist,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tseslint.plugin,
      'unused-imports': unusedImports,
    },
    rules: {
      // TypeScript
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: true,
          fixStyle: 'separate-type-imports',
          prefer: 'type-imports',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],

      // Unused imports
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'off',

      // CSS Modules
      'css-modules/no-undef-class': 'error',
      'css-modules/no-unused-class': 'warn',
      "postcss-modules/no-undef-class": "error",
      "postcss-modules/no-unused-class": "warn",

      // Imports
      'import/no-unresolved': 'error',
      'import/no-unused-modules': 'error',
      'import/order': 'off',

      // Perfectionist
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'alphabetical',
          order: 'asc',
          groups: [
            'value-builtin',
            'value-external',
            'value-internal',
            ['value-parent', 'value-sibling'],
            [
              'type-import',
              'type-internal',
              'type-parent',
              'type-sibling',
              'type-index',
            ],
            'ts-equals-import',
            'side-effect-style',
            'style',
          ],
          internalPattern: [
            '^/',
            '@/',
            '^@components/',
            '^@contexts/',
            '^@hocs/',
            '^@hooks/',
            '^@pages/',
            '^@services/',
            '^@utils/',
          ],
          customGroups: [
            {
              groupName: 'base-components',
              anyOf: [{ elementNamePattern: '/*/*/[!-]*/*.*' }],
            },
            {
              groupName: 'compound-components',
              anyOf: [{ elementNamePattern: '/*/*/*-*/*.*' }],
            },
          ],
          newlinesBetween: 1,
        },
      ],

      // React
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
    },
    settings: {
      'css-modules': {
        camelCase: 'true',
        filetypes: {
          '.css': 'postcss',
          '.module.css': 'postcss',
        },
      },
       "postcss-modules": {
        include: "**/*.module.(css|scss)",
        exclude: "**/node_modules/**/*",
      },
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.app.json', './tsconfig.json'],
        },
      },
    },
  },
  eslintPluginPrettierRecommended
);
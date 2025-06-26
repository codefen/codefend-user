import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import ts from 'typescript-eslint';
import unicornRecommended from 'eslint-plugin-unicorn';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import prettierRecommended from 'eslint-config-prettier';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {
    ...js.configs.recommended,
    ...unicornRecommended.configs.recommended,
    ...ts.configs.recommended,
  },
  allConfig: ts.configs.all,
});

const IGNORES_PATHS = [
  '.github/*',
  '..vscode',
  '.husky',
  'public',
  'node_modules',
  'dist/*',
  'src-tauri/*',
  'public/editor-lib',
  'public/particles',
  'public/flags',
  '*.min.js',
  '*.json',
  'pnpm-lock.yaml',
];

const baseConfig = {
  plugins: {
    '@typescript-eslint': fixupPluginRules(typescriptEslintPlugin),
    'react-refresh': fixupPluginRules(reactRefresh),
    'react-hooks': fixupPluginRules(reactHooks),
  },
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals['es2022'],
    },
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  rules: {
    ...prettierRecommended.rules,
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'no-console': 'off',
  },
};

//pluginImport.rules
const config = [
  { ignores: IGNORES_PATHS },
  ...fixupConfigRules(compat.extends()),
  {
    ...baseConfig,
    files: ['src/**/*.{js,mjs,cjs,jsx}'],
  },
  {
    ...baseConfig,
    //...ts.configs.recommended,
    files: ['src/**/*.{ts,tsx,mts}'],
    languageOptions: {
      ...baseConfig.languageOptions,
      parser: parser,
      parserOptions: {
        ...baseConfig.languageOptions.parserOptions,
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.app.json'],
      },
    },
    rules: {
      ...baseConfig.rules,
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-empty-pattern': ['error', { allowObjectPatternsAsParameters: false }],
      'no-undef': ['warn', { typeof: false }],
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
];

export default config;

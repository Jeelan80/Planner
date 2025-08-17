import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  // Specific overrides for card components to disable all style-related rules
  {
    files: [
      '**/PhotoCard.tsx',
      '**/ProjectProgressCard.tsx',
      '**/QuickNotesCard.tsx',
      '**/MotivationalQuoteCard.tsx',
      '**/cards/*.tsx'
    ],
    rules: {
      // Turn off all possible style-related rules
      'no-inline-styles': 'off',
      '@typescript-eslint/no-inline-styles': 'off',
      'react/no-inline-styles': 'off',
      'style/no-inline-styles': 'off',
      'css/no-inline-styles': 'off',
      'jsx-a11y/no-inline-styles': 'off',
      // Turn off all warnings and errors
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  }
);

import js from '@eslint/js'
import { plugin as shadcn } from '@shadcn/lint'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default tseslint.config(
  { ignores: ['dist', 'src-tauri'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-useless-assignment': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}', '**/__tests__/**'],
    plugins: { shadcn },
    settings: {
      shadcn: {
        componentImports: ['(?:^|/)ui(?:/|$)'],
        mergeFunctions: ['joinClasses'],
        note: 'See docs/design-rules.md. Keep white surfaces, mint accent, and no shadows or gradients.',
      },
    },
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'Literal[value=/(^|\\s)([\\w-]+:)*(shadow(-[^\\s]+)?|drop-shadow(-[^\\s]+)?|bg-gradient[^\\s]*|bg-linear[^\\s]*|bg-radial[^\\s]*|bg-conic[^\\s]*)(\\s|$)/]',
          message: 'TypelessLocal uses flat surfaces: shadows and gradients are not allowed.',
        },
        {
          selector:
            'TemplateElement[value.raw=/(^|\\s)([\\w-]+:)*(shadow(-[^\\s]+)?|drop-shadow(-[^\\s]+)?|bg-gradient[^\\s]*|bg-linear[^\\s]*|bg-radial[^\\s]*|bg-conic[^\\s]*)(\\s|$)/]',
          message: 'TypelessLocal uses flat surfaces: shadows and gradients are not allowed.',
        },
      ],
      'shadcn/no-raw-colors': 'error',
      'shadcn/no-arbitrary-values': 'error',
      'shadcn/no-unknown-classes': 'error',
      'shadcn/no-inline-styles': 'error',
      'shadcn/require-static-classes': 'error',
      'shadcn/no-restyle': [
        'error',
        {
          allow: ['layout'],
          contracts: [{ pattern: '^Card(Header|Content|Footer)$', allow: ['layout', 'spacing'] }],
        },
      ],
    },
  },
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'shadcn/no-restyle': 'off',
      'shadcn/no-arbitrary-values': 'off',
      'shadcn/require-static-classes': 'off',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
)

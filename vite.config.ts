import { defineConfig } from 'vite-plus';

/**
 * Vite+ configuration for `@tochii/errors`.
 *
 * One file drives Oxfmt (`fmt`), Oxlint (`lint`) and Vitest (`test`). The
 * `fmt`/`lint` values were produced by
 * `dbx migrate --from biome --target vite`.
 */
export default defineConfig({
    test: {
        environment: 'node',
        include: ['tests/**/*.test.ts'],
        testTimeout: 30_000,
        hookTimeout: 30_000,
    },
    fmt: {
        useTabs: false,
        tabWidth: 4,
        printWidth: 100,
        endOfLine: 'lf',
        bracketSameLine: false,
        bracketSpacing: true,
        singleQuote: true,
        jsxSingleQuote: false,
        quoteProps: 'as-needed',
        trailingComma: 'es5',
        semi: true,
        arrowParens: 'avoid',
        ignorePatterns: [
            '**/node_modules/**',
            '**/dist/**',
            '**/.turbo/**',
            '**/.generated/**',
            '**/generated/**',
            '*.json',
            '**/tsconfig*.json',
            '**/*.yml',
            '**/*.yaml',
            '**/CHANGELOG.md',
        ],
        sortImports: {
            groups: [
                'builtin',
                'external',
                ['custom0', 'internal'],
                ['parent', 'sibling', 'index'],
            ],
            internalPattern: ['~/', '@/'],
            newlinesBetween: true,
            sortPackageJson: false,
            customGroups: [{ groupName: 'custom0', elementNamePattern: ['@tochii/**'] }],
        },
    },
    lint: {
        $schema: './node_modules/oxlint/configuration_schema.json',
        ignorePatterns: [
            '**/node_modules/**',
            '**/dist/**',
            '**/.turbo/**',
            '**/.generated/**',
            '**/generated/**',
        ],
        rules: {
            'typescript/no-empty-object-type': 'off',
            'typescript/no-useless-empty-export': 'off',
            'unicorn/no-static-only-class': 'off',
            'no-unused-vars': 'warn',
            'no-case-declarations': 'off',
            'typescript/no-non-null-assertion': 'off',
            'unicorn/prefer-node-protocol': 'off',
            'prefer-template': 'off',
            'no-return-assign': 'off',
            'typescript/no-explicit-any': 'off',
        },
    },
});

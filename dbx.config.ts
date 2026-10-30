import { defineConfig } from '@deltabox/toolchain';

/**
 * `@deltabox/toolchain` configuration for `@tochii/errors`.
 *
 * `dbx sync` manages `commitlint.config.mjs`, the GitHub workflows and the VS
 * Code settings. Formatting/linting are Ox (Oxfmt/Oxlint) via `vp fmt` /
 * `vp lint`, configured in `vite.config.ts`.
 */
export default defineConfig({
    toolchain: {
        project: {
            type: 'project',
            name: 'errors',
            scope: '@tochii',
            author: 'T0chi',
            license: 'MIT',
            description: 'Shared typed errors and stable error codes used in official tochiResources proejcts.',
            nodeVersion: '22',
            packageManager: 'yarn',
            packageManagerVersion: '4.17.1',
        },
        changelog: {
            // The workspace names double as commitlint scopes.
            scopes: ['errors', 'ci', 'release', 'deps'],
            workflows: {
                release: false,
                changelog: false
            }
        },
    },
});

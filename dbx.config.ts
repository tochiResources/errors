import { defineConfig } from '@deltabox/toolchain';

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
            scopes: ['errors', 'ci', 'release', 'deps'],
            workflows: {
                release: false,
                changelog: false
            }
        },
    },
});

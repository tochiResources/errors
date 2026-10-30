import { defineConfig } from '@deltabox/toolchain';

let addNugetWorkflow = false;
const NUGET_WORKFLOW_PATH = '.github/workflows/nuget.yml';
const NUGET_WORKFLOW = ensureNugetReleaseWorkflow();

export default defineConfig({
    toolchain: {
        project: {
            type: 'project',
            name: 'errors',
            scope: '@tochii',
            author: 'T0chi',
            license: 'MIT',
            description:
                'Shared typed errors and stable error codes used in official tochiResources proejcts.',
            repo: 'https://github.com/tochiResources/errors',
            nodeVersion: '22',
            packageManager: 'yarn',
            packageManagerVersion: '4.17.1',
        },
        changelog: {
            branches: { dev: 'dev' },
            scopes: ['errors', 'ci', 'release', 'deps'],
            workflows: {
                release: true,
                changelog: true,
            },
        },
        hooks: {
            beforeSync: () => {
                addNugetWorkflow = true;
            },
            beforeTask: ({ task }) => {
                if (!addNugetWorkflow) return;
                addNugetWorkflow = false;
                const run = task.run;
                task.run = async ctx => {
                    const files = (await run(ctx)) ?? [];
                    files.push({ path: NUGET_WORKFLOW_PATH, content: NUGET_WORKFLOW });
                    return files;
                };
            },
        }
    },
});

function ensureNugetReleaseWorkflow() {
    return `name: Publish NuGet
on:
  push:
    tags:
      - 'v*'

permissions:
  contents: read
  id-token: write

jobs:
  publish:
    runs-on: ubuntu-latest
    environment: release

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '10.0.x'

      - name: Validate tag matches package.json
        run: |
          version="$(node -p "require('./package.json').version")"
          if [ "$GITHUB_REF_NAME" != "v$version" ]; then
            echo "::error::Tag $GITHUB_REF_NAME does not match package.json version $version"
            exit 1
          fi

      - name: Pack
        run: dotnet pack csharp/TochiRes.Errors.csproj -c Release -o artifacts

      - name: NuGet login (OIDC)
        id: login
        uses: NuGet/login@v1
        with:
          user: \${{ secrets.NUGET_USER }}

      - name: Push to NuGet
        run: dotnet nuget push artifacts/*.nupkg --api-key "\${{ steps.login.outputs.NUGET_API_KEY }}" --source https://api.nuget.org/v3/index.json --skip-duplicate
`;
}

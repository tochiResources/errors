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
        },
        changelog: {
            vscode: true,
            branches: { dev: 'dev' },
            scopes: ['errors', 'ci', 'release', 'deps'],
            workflows: {
                sync: true,
                issues: true,
                ci: {
                    pullRequestBranches: [
                        'main',
                        'dev',
                        'release/**',
                        'feat/**',
                        'feature/**',
                        'fix/**',
                        'chore/**',
                        'dependabot/**',
                    ],
                },
                changelog: true,
                release: {
                    extra: {
                        permissions: { contents: 'write', 'id-token': 'write' },
                        concurrency: { group: 'release', 'cancel-in-progress': false },
                    },
                    jobs: {
                        'create-release-pr': {
                            name: 'release',
                            'runs-on': 'ubuntu-latest',
                            environment: 'release',
                            steps: [
                                {
                                    name: 'Checkout',
                                    uses: 'actions/checkout@v4',
                                    with: {
                                        'fetch-depth': 0,
                                        token: '${{ secrets.GITHUB_TOKEN }}',
                                    },
                                },
                                {
                                    name: 'Setup Node',
                                    uses: 'actions/setup-node@v4',
                                    with: {
                                        'node-version': '{{nodeVersion}}',
                                        'registry-url': 'https://registry.npmjs.org',
                                    },
                                },
                                {
                                    name: 'Enable Corepack',
                                    run: 'corepack enable\ncorepack prepare {{packageManager}}@{{yarnVersion}} --activate',
                                },
                                {
                                    name: 'Install dependencies',
                                    run: '{{packageManager}} install --immutable',
                                },
                                { name: 'Build', run: '{{packageManager}} build' },
                                {
                                    name: 'Resolve version + release state',
                                    id: 'release',
                                    run: [
                                        'version="$(node -p "require(\'./package.json\').version")"',
                                        'echo "version=$version" >> "$GITHUB_OUTPUT"',
                                        'if git ls-remote --exit-code --tags origin "v$version" >/dev/null 2>&1; then',
                                        '  echo "Release v$version already exists; skipping."',
                                        '  echo "skip=true" >> "$GITHUB_OUTPUT"',
                                        'else',
                                        '  echo "skip=false" >> "$GITHUB_OUTPUT"',
                                        'fi',
                                    ].join('\n'),
                                },
                                {
                                    name: 'Extract release notes',
                                    if: "steps.release.outputs.skip == 'false'",
                                    run: [
                                        'last_tag="$(git describe --tags --abbrev=0 2>/dev/null || true)"',
                                        'if [ -n "$last_tag" ]; then',
                                        '  last_version="${last_tag#v}"',
                                        '  notes="$(awk -v v="$last_version" \'/^## / { if ($2 == v) exit; started = 1 } started { print }\' CHANGELOG.md 2>/dev/null || true)"',
                                        'else',
                                        '  notes="$(cat CHANGELOG.md 2>/dev/null || true)"',
                                        'fi',
                                        '[ -n "$notes" ] || notes="Release v${{ steps.release.outputs.version }}"',
                                        'printf \'%s\\n\' "$notes" > RELEASE_NOTES.md',
                                    ].join('\n'),
                                },
                                {
                                    name: 'Create the GitHub Release',
                                    if: "steps.release.outputs.skip == 'false'",
                                    env: { GH_TOKEN: '${{ secrets.GITHUB_TOKEN }}' },
                                    run: [
                                        'gh release create "v${{ steps.release.outputs.version }}" \\',
                                        '  --title "v${{ steps.release.outputs.version }}" \\',
                                        '  --notes-file RELEASE_NOTES.md \\',
                                    ].join('\n'),
                                },
                                {
                                    name: 'Upgrade npm for trusted publishing',
                                    if: "steps.release.outputs.skip == 'false'",
                                    run: 'npm install -g npm@^11.15.1',
                                },
                                {
                                    name: 'Publish to npm (fallback: staged)',
                                    if: "steps.release.outputs.skip == 'false'",
                                    run: [
                                        '{{packageManager}} pack --out package.tgz',
                                        'if npm publish package.tgz --access public; then',
                                        '  echo "Published to npm."',
                                        'else',
                                        '  echo "::warning::Direct publish failed; falling back to a staged publish."',
                                        '  npm stage publish package.tgz --access public',
                                        'fi',
                                    ].join('\n'),
                                },
                            ],
                        },
                    },
                },
            },
        },
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

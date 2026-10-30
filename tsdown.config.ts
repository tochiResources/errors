import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: { index: 'src/index.ts', codes: 'src/codes.ts', serialize: 'src/serialize.ts' },
    format: ['esm'],
    platform: 'neutral',
    fixedExtension: false,
    deps: { neverBundle: [/^node:/] },
    dts: { tsconfig: 'tsconfig.dts.json', sourcemap: false },
    clean: true,
    sourcemap: false,
    target: 'es2022',
    tsconfig: 'tsconfig.build.json',
});

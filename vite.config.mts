import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import hawkVitePlugin from '@hawk.so/vite-plugin';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

const appRoot = process.cwd();
const appVersion = JSON.parse(readFileSync(resolve(appRoot, 'public/version.json'), 'utf8')).version as string;

export default defineConfig(({ mode }) => {
    const allEnv = loadEnv(mode, appRoot, '');
    const env = loadEnv(mode, appRoot, 'VITE_');
    const hawkToken = env.VITE_HAWK_TOKEN;

    return {
        plugins: [
            react(),
            svgr(),
            VitePWA({
                strategies: 'injectManifest',
                srcDir: 'src',
                filename: 'service-worker.ts',
                injectRegister: false,
                manifest: false,
                devOptions: {
                    enabled: false,
                },
                injectManifest: {
                    globIgnores: ['**/*.map', 'asset-manifest.json', 'LICENSE'],
                    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
                },
            }),
            hawkToken &&
                hawkVitePlugin({
                    token: hawkToken,
                    removeSourceMaps: true,
                }),
        ].filter(Boolean),
        build: {
            outDir: 'build',
            sourcemap: Boolean(hawkToken) || env.VITE_GENERATE_SOURCEMAP !== 'false',
        },
        server: {
            host: allEnv.HOST || '0.0.0.0',
            port: Number(allEnv.PORT) || 8006,
        },
        define: {
            __APP_VERSION__: JSON.stringify(appVersion),
            __BUILD_TIMESTAMP__: JSON.stringify(Date.now()),
        },
        test: {
            environment: 'jsdom',
            globals: true,
            setupFiles: './src/setupTests.ts',
            include: ['src/**/*.{test,spec}.{ts,tsx}'],
        },
    };
});

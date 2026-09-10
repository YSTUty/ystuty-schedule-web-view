import hawkVitePlugin from '@hawk.so/vite-plugin';
import react from '@vitejs/plugin-react';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv, type PluginOption } from 'vite';
import { checker } from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

import packageJson from './package.json' with { type: 'json' };

const appRoot = process.cwd();
const { version } = packageJson;

/** Возвращает короткий хеш текущего Git-коммита для маркировки сборки. */
function getGitCommitHash() {
  try {
    execFileSync('git', ['rev-parse', '--is-inside-work-tree'], {
      stdio: 'ignore',
    });
    return execFileSync('git', ['rev-parse', '--short', 'HEAD'])
      .toString()
      .trim();
  } catch {
    return null;
  }
}

/** Форматирует время сборки для отображения в интерфейсе и Hawk release. */
function formatBuildDate() {
  const date = new Date();
  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(
    date.getHours(),
  ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export default ({ mode }: { mode: string }) => {
  const allEnv = loadEnv(mode, appRoot, '');
  const env = loadEnv(mode, appRoot, 'VITE_');

  const isDev = process.env.NODE_ENV !== 'production';
  const hawkToken = env.VITE_HAWK_TOKEN;
  const commitHash = getGitCommitHash();
  const buildDate = formatBuildDate();
  const buildTimestamp = Date.now();
  const release = [version, commitHash, buildDate].filter(Boolean).join('-');

  const plugins: PluginOption[] = [
    react(),
    svgr(),
    checker({
      typescript: true,
      overlay: true,
    }),
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
        globIgnores: [
          '**/*.map',
          'asset-manifest.json',
          'LICENSE',
          'stats.html',
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ];

  if (hawkToken) {
    plugins.push(
      hawkVitePlugin({
        token: hawkToken,
        release,
        removeSourceMaps: true,
      }) as PluginOption,
    );
  }

  if (allEnv.ANALYZE === 'true') {
    plugins.push(
      visualizer({
        filename: 'build/stats.html',
        gzipSize: true,
        brotliSize: true,
      }) as PluginOption,
    );
  }

  return defineConfig({
    plugins,
    build: {
      target: 'es2019',
      outDir: 'build',
      sourcemap: Boolean(hawkToken) || env.VITE_GENERATE_SOURCEMAP !== 'false',
    },
    resolve: {
      alias: {
        '@': path.resolve(appRoot, 'src'),
        // Пакет MUI 5 поставляет CommonJS-файлы для deep import, которые некорректно
        // обрабатываются Rolldown в Vite 8. Используем ESM-версии иконок напрямую.
        '@mui/icons-material': path.resolve(appRoot, 'node_modules/@mui/icons-material/esm'),
      },
    },
    server: {
      host: allEnv.HOST || '0.0.0.0',
      port: Number(allEnv.PORT) || 8006,
    },
    define: {
      isDev: JSON.stringify(isDev),
      __APP_VERSION__: JSON.stringify(version),
      __BUILD_DATE__: JSON.stringify(buildDate),
      __BUILD_G_HASH__: JSON.stringify(commitHash),
      __BUILD_TIMESTAMP__: JSON.stringify(buildTimestamp),
    },
  });
};

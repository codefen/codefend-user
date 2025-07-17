import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import tsconfig from './tsconfig.app.json';

interface TsconfigPaths {
  [key: string]: string[];
}

const raw: TsconfigPaths = tsconfig.compilerOptions.paths;
const alias: Record<string, string> = {};
const {
  VITE_PORT: PORT,
  TAURI_HOST: HOST,
  TAURI_PLATFORM: PLATFORM = '',
  TAURI_DEBUG: IS_DEBUG,
} = process.env;

for (const x in raw) {
  const resolvedPath = path.resolve(__dirname, raw[x][0].replace('/*', ''));
  alias[x.replace('/*', '')] = resolvedPath;
}

// https://vitejs.dev/config/
export default defineConfig(() => ({
  resolve: {
    alias,
  },
  plugins: [react()],
  clearScreen: false,
  server: {
    strictPort: true,
    host: HOST || '0.0.0.0', // Cambiado de false a '0.0.0.0' para permitir acceso desde LAN
    port: Number(PORT),
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    cssMinify: !IS_DEBUG ? ('esbuild' as 'esbuild') : ('esbuild' as 'esbuild'),
    target: PLATFORM.startsWith('windows') ? 'chrome105' : 'safari13',
    sourcemap: !!IS_DEBUG,
    minify: !IS_DEBUG ? ('esbuild' as 'esbuild') : false,
  },
}));

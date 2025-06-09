import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import tsconfig from './tsconfig.app.json';

const raw: any = tsconfig.compilerOptions.paths;
const alias: any = {};
const {
  VITE_PORT: PORT,
  TAURI_HOST: HOST,
  TAURI_PLATFORM: PLATFORM = '',
  TAURI_DEBUG: IS_DEBUG,
} = process.env;

for (const x in raw) {
  alias[x.replace('/*', '')] = raw[x].map(p => path.resolve(__dirname, p.replace('/*', '')));
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
    host: HOST || false,
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

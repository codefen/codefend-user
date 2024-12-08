import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import LightningCSS from 'unplugin-lightningcss/vite';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import tsconfig from './tsconfig.json';

const raw = tsconfig.compilerOptions.paths;
const alias = {};

for (const x in raw) {
  alias[x.replace('/*', '')] = raw[x].map(p => path.resolve(__dirname, p.replace('/*', '')));
}

const PORT = process.env.VITE_PORT;
const HOST = process.env.TAURI_HOST;
const PLATFORM = process.env.TAURI_PLATFORM;
const IS_DEBUG = process.env.TAURI_DEBUG;

// https://vitejs.dev/config/
export default defineConfig(() => ({
  resolve: {
    alias,
  },
  plugins: [react(), LightningCSS()],
  clearScreen: false,
  server: {
    strictPort: true,
    host: HOST || false,
    port: Number(PORT),
    hmr: HOST
    ? {
        protocol: "ws",
        host: HOST,
        port: Number(PORT),
      }
    : undefined,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
    warmup: {
      clientFiles: [
        './src/app/views/components/modals/modalwrapper/ModalWrapper.tsx',
        './src/app/views/components/Table/tablev2.tsx',
        './src/app/views/components/defaults/Show.tsx',
      ],
    },
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    cssMinify: !IS_DEBUG ? 'lightningcss' as 'lightningcss' : "esbuild" as "esbuild",
    target: PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    sourcemap: !!IS_DEBUG,
    minify: !IS_DEBUG ? 'esbuild' as "esbuild" : false,
  },
}));

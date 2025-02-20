import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import LightningCSS from 'unplugin-lightningcss/vite';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import tsconfig from './tsconfig.json';

const raw = tsconfig.compilerOptions.paths;
const alias = {};
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
  plugins: [react(), LightningCSS()],
  clearScreen: false,
  server: {
    strictPort: true,
    host: HOST || false,
    port: Number(PORT),
    watch: {
      ignored: ['**/src-tauri/**'],
    },
    warmup: {
      clientFiles: [
        './src/app/components/modalwrapper/ModalWrapper.tsx',
        './src/app/views/components/Table/tablev2.tsx',
        './src/app/components/Show/Show.tsx',
      ],
    },
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    cssMinify: !IS_DEBUG ? ('lightningcss' as 'lightningcss') : ('esbuild' as 'esbuild'),
    target: PLATFORM.startsWith('windows') ? 'chrome105' : 'safari13',
    sourcemap: !!IS_DEBUG,
    minify: !IS_DEBUG ? ('esbuild' as 'esbuild') : false,
  },
}));

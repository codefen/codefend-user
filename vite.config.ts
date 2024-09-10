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

// https://vitejs.dev/config/
export default defineConfig(() => ({
  build: {
    cssMinify: 'lightningcss' as 'lightningcss',
  },
  resolve: {
    alias,
  },
  plugins: [react(), LightningCSS()],
  clearScreen: false,
  server: {
    port: 3000,
    strictPort: false,
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
}));

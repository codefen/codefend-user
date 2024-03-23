import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig(async () => ({
	plugins: [react()],

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

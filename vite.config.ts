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
	},
}));

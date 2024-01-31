import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(async () => ({
	plugins: [react()],

	clearScreen: false,
	server: {
		port: 3000,
		strictPort: true,
		host: true,
		watch: {
			ignored: ['**/src-tauri/**'],
		},
	},
}));

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	// Prevent Vite from pre-bundling the linked local package and React.
	optimizeDeps: {
		exclude: ['fog-ui', 'react', 'react-dom']
	},
	build: {
		rollupOptions: {
			// Ensure consumer build treats React as external as well.
			external: [/^react($|\/)/, /^react-dom($|\/)/]
		}
	}
})

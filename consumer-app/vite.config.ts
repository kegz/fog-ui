import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			react: 'react',
			'react-dom': 'react-dom',
			'react-router-dom': 'react-router-dom'
		}
	},
	optimizeDeps: {
		include: ['react', 'react-dom', 'react-router-dom'],
		exclude: ['fog-ui']
	}
})

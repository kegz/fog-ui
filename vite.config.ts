import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
	plugins: [react()],
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "SharedUI",
			formats: ["es", "cjs"],
			fileName: (format) => (format === "es" ? "index.mjs" : "index.cjs"),
		},
		rollupOptions: {
			// Ensure React and all React subpath imports (jsx runtime, dev runtime)
			// are treated as externals so they are not bundled into the library.
			external: [/^react($|\/)/, /^react-dom($|\/)/],
			output: {
				exports: "named",
			},
		},
		sourcemap: true,
		emptyOutDir: true,
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: 'src/setupTests.ts',
		include: ['src/**/*.test.{ts,tsx}'],
	}
});

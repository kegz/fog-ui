import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
	{
		ignores: [
			"dist/**",
			"coverage/**",
			"node_modules/**",
			"*.min.*",
			"**/*.d.ts",
			"src/**/vendor/**",
			"src/**/generated/**"
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["src/**/*.{ts,tsx}"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.es2021,
			},
		},
		plugins: {
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			/* 			"react-refresh/only-export-components": [
							"warn",
							{ allowConstantExport: true },
						], */
			// TEMP: allow `any` while you migrate types
			"@typescript-eslint/no-explicit-any": "off",

			// TEMP: allow unused imports/vars while refactoring
			"@typescript-eslint/no-unused-vars": "off",

			// TEMP: stop fast-refresh noise in a library repo
			"react-refresh/only-export-components": "off",

			"react-hooks/exhaustive-deps": "off",
			"@typescript-eslint/ban-ts-comment": "off",
		},
	},
	{
		files: ["scripts/**/*.{js,cjs,mjs}", "eslint.config.{js,mjs}"],
		languageOptions: {
			globals: {
				...globals.node,
				...globals.es2021,
			},
		},
		rules: {
			"no-undef": "off",
		},
	},
	{
		files: ["**/__tests__/**/*.{ts,tsx}", "**/*.{test,spec}.{ts,tsx}"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021,
				test: "readonly",
				expect: "readonly",
				describe: "readonly",
				it: "readonly",
				beforeEach: "readonly",
				afterEach: "readonly",
				beforeAll: "readonly",
				afterAll: "readonly",
			},
		},
		rules: {
			"@typescript-eslint/no-unused-expressions": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-vars": "off",
		},
	},
];

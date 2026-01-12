# fog-ui

fog-ui is a small React + TypeScript component library built on Material UI (MUI).
It provides shared UI primitives and a centralized theming system that can be
reused across multiple React applications.

## Key points

- Bundled with Vite in library mode (ESM + CJS)
- Generates TypeScript declaration files
- `react` and `react-dom` are peerDependencies (not bundled)
- Exposes a centralized theme and `ThemeContextProvider`
- Components are exported as named exports from the package entry

## Install

Install `fog-ui` and ensure React 18+ is available in the consuming app.

```bash
npm install fog-ui
# or
yarn add fog-ui
```

Peer dependencies (install in your app):

```bash
npm install react react-dom @mui/material @emotion/react @emotion/styled
```

## Usage

Wrap your application with the provider and use components by name:

```tsx
import React from 'react';
import { ThemeContextProvider, createFogTheme } from 'fog-ui';
import { PageWrapper, DataTable } from 'fog-ui';

const App = () => (
	<ThemeContextProvider>
		<PageWrapper menuItems={{}}>
			<DataTable />
		</PageWrapper>
	</ThemeContextProvider>
);

export default App;
```

Override or extend the theme using MUI's theming APIs:

```tsx
import { createFogTheme } from 'fog-ui';
import { ThemeProvider } from '@mui/material/styles';

const theme = createFogTheme({ palette: { primary: { main: '#ff5722' } } });

// Wrap with MUI ThemeProvider if you want to apply custom theme
<ThemeProvider theme={theme}>{/* App */}</ThemeProvider>;
```

## Building locally

To build the package locally (produces `dist/`):

```bash
npm install
npm run build
```

## Publishing

The package is configured to publish `dist/` with `main`, `module`, and `types` fields.
Before publishing, ensure:

- `package.json` version is bumped
- `peerDependencies` are correct
- `dist/` contains the built bundles and declaration files

Publish with:

```bash
npm publish --access public
```

## Contributing

Please open issues or pull requests. Follow repository linting rules and run `npm run build` before creating a PR.

---

For more examples and API details, consult the source files under `src/components` and `src/theme`.

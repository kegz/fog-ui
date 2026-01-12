# fog-ui

fog-ui is an open-source React component library built on top of Material UI (MUI).
It provides reusable UI components and a shared theming system intended for teams
that build and maintain multiple React applications.

This project is community-driven and welcomes contributions of all kinds:
code, documentation, tests, ideas, and constructive feedback.

---

## Why fog-ui exists

Many teams use MUI successfully but end up duplicating:
- the same card patterns
- the same table layouts
- the same form abstractions
- the same theme logic

fog-ui exists to centralize those patterns into a **tested, typed, reusable library**
without locking consumers into a rigid design system.

Core goals:
- Consistency across applications
- Explicit, predictable APIs
- Strong test coverage
- Minimal magic

---

## Project values

We try to optimize for the following:

- **Clarity over cleverness**  
  Code should be readable first, impressive second.

- **Composition over inheritance**  
  Prefer composing MUI primitives instead of deep abstractions.

- **Stability over novelty**  
  This is a UI foundation, not a playground for trends.

- **Respect for contributors’ time**  
  Clear structure, tests, and documentation matter.

---

## Who this project is for

fog-ui is a good fit if you:
- already use MUI
- want shared UI foundations across apps
- care about test coverage and type safety
- prefer explicit APIs over hidden behavior

fog-ui is *not* intended to:
- replace MUI
- provide a full design system with opinions on branding
- support multiple styling frameworks

---

# Implementation Guide (Getting Started)

This page explains how to integrate `fog-ui` into a React application, including required dependencies, theming setup, and common integration patterns.

---

## 1) Install

### Install fog-ui
```bash
npm install fog-ui
```

### Install required peer dependencies (MUI + Emotion)
fog-ui is built on Material UI (MUI) and uses Emotion styling. Your application must include:
```bash
npm install @mui/material @emotion/react @emotion/styled
```
If your application uses additional MUI packages (icons, date pickers, etc.), install them separately as needed.

## 2) Minimal integration (recommended)
fog-ui provides a theming system via its Theme Context / Provider. Wrap your app once at the root.

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeContextProvider } from "fog-ui";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
  </React.StrictMode>
);

```
This establishes a consistent MUI theme for all fog-ui components used by the app.

## 3) Using components
Once installed, import components directly from the package:
### Install fog-ui
```tsx
import { PermissionCard, DataTable, TrendAnalyticsChart } from "fog-ui";
```
If a component requires routing (for example, template/navigation components), make sure your application is wrapped with a router.


## 1) 4) Router integration (required for some components)
Some fog-ui components rely on react-router-dom. If you use Template components like PageWrapper / Topbar or list components that render links, wrap the app with BrowserRouter:
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeContextProvider } from "fog-ui";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeContextProvider>
        <App />
      </ThemeContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

```
Install routing if you do not already have it:
```bash
npm install react-router-dom
```

## 5) Theme customization
fog-ui supports theme customization in two common ways:

Option A: Use fog-ui’s ThemeContext API (runtime changes)
Use this if you want fog-ui to manage theme mode and primary color switching via context (best for apps that want runtime toggles).
```tsx
import React from "react";
import { ThemeContext } from "fog-ui";
import { Button } from "@mui/material";

export function ThemeToggle() {
  const { toggleTheme } = React.useContext(ThemeContext);
  return <Button onClick={toggleTheme}>Toggle Theme</Button>;
}

```
Option B: Provide your own MUI ThemeProvider (advanced)
Use this if your app already owns the theme, and you want fog-ui to follow it.
```tsx
import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createFogTheme } from "fog-ui";

const theme = createFogTheme({
  palette: { primary: { main: "#123456" } },
});

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
```

## 6) TypeScript usage
fog-ui is designed for TypeScript. In most projects, no additional setup is required.

If you see type resolution issues:

- Ensure your TypeScript version is modern (TS 5+ recommended)
- Ensure your bundler supports ESM packages correctly


### Types — how to import
fog-ui exposes TypeScript types from the package root so you can import them directly from `fog-ui`.

Examples:

- Import a type-only symbol:

```ts
import type { TableRowData } from 'fog-ui';

function handleRow(row: TableRowData) { /* ... */ }
```

- Import types alongside runtime values (use `import type` when possible to avoid pulling runtime code):

```ts
import { DataTable } from 'fog-ui';
import type { DataTableProps } from 'fog-ui';

const props: DataTableProps = { /* ... */ };
<DataTable {...props} />
```

- If you only need several types, prefer named type imports to keep imports minimal:

```ts
import type { TabsProps, TabItem } from 'fog-ui';
```

Notes:

- The package publishes `.d.ts` declarations under `dist/` and `package.json` `types` points to `./dist/index.d.ts`.
- When using `tsc` or IDEs like VS Code, TypeScript will resolve types from the installed package automatically.
- Prefer `import type { ... } from 'fog-ui'` to ensure imports are erased at compile time and do not pull runtime code into your bundle.



## 7) Common pitfalls
Components render but styles look wrong

fog-ui relies on MUI/Emotion theming. Ensure:
- you installed Emotion packages
- the app is wrapped in a theme provider (ThemeContextProvider or your own ThemeProvider)

Navigation components do not work
Ensure you have react-router-dom installed and BrowserRouter configured.

Bundle size looks too large
In consumer apps, MUI/Emotion are expected to be installed once and shared. Ensure your dependency graph does not include multiple versions of:
 - react
- @mui/material
- @emotion/react


## 8) Quick verification checklist
After integration, verify:

[] npm run dev renders at least one fog-ui component
[] Theme styles apply correctly
[] If using template/navigation: routing works (links, page wrapper)
[] No duplicate React or Emotion versions installed


## Local development and installing from local source
If you are testing `fog-ui` from a local checkout (for example using a `file:..` dependency in a consumer), the consumer bundler can accidentally pre-bundle the library and include React internals. To avoid duplicate React runtimes in the consumer app, follow one of these recommended workflows.

- Build before installing (recommended when using `file:`):

```powershell
cd path/to/fog-ui
npm run build
cd path/to/consumer-app
npm install ../fog-ui
```

- Use `npm pack` to create a tarball and install that in the consumer (reproducible and closer to how npm publishes):

```powershell
cd path/to/fog-ui
npm pack
cd path/to/consumer-app
npm install ../fog-ui-<version>.tgz
```

- If you prefer to keep a live link to your local package during development, instruct consumer Vite to avoid pre-bundling the package and to treat React as external. Add or update `consumer-app/vite.config.ts` with:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Prevent Vite from pre-bundling the local package and React
    exclude: ['fog-ui', 'react', 'react-dom']
  },
  build: {
    rollupOptions: {
      // Ensure React and react-dom (and their subpaths) remain external
      external: [/^react($|\/)/, /^react-dom($|\/)/]
    }
  }
})
```

Notes:
- Installing via `file:..` does not automatically run a library build for you — run `npm run build` in the library first or use `npm pack`.
- Adding a `prepare` script in `fog-ui` (for example, `"prepare": "npm run build"`) helps ensure builds run for some install scenarios (notably git-based installs), but it may not run for plain `file:` installs; the explicit build or pack workflows above are more reliable for local testing.




## 9) Where to go next
- Components: Cards
- Components: Forms
- Components: Tables
- Components: Charts
- Components: Template
- Components: Theming System
- FAQ
---

### If you want, I can tailor this page to your exact exports
If you tell me **which provider name you want to standardize on publicly** (e.g., `FogThemeProvider` vs `ThemeContextProvider`), I’ll align the wiki wording and examples so your docs look consistent and professional across all pages.
::contentReference[oaicite:0]{index=0}

import React, { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeContextProvider } from '../context/ThemeContext';
import { MemoryRouter } from 'react-router-dom';

const Providers = ({ children }: { children?: ReactNode }) => (
	<ThemeContextProvider>
		<MemoryRouter>{children}</MemoryRouter>
	</ThemeContextProvider>
);

const renderWithProviders = (ui: React.ReactElement, options?: RenderOptions) =>
	render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react';
export { renderWithProviders };

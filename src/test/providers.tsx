import React, { ReactNode } from 'react';
import { ThemeContextProvider } from '../context/ThemeContext';
import { MemoryRouter } from 'react-router-dom';

export const Providers = ({ children }: { children?: ReactNode }) => (
	<ThemeContextProvider>
		<MemoryRouter>{children}</MemoryRouter>
	</ThemeContextProvider>
);

export default Providers;

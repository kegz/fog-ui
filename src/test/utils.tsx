import React from 'react';
import { render, RenderOptions, screen, within, act, waitFor } from '@testing-library/react';
import Providers from './providers';

const renderWithProviders = (ui: React.ReactElement, options?: RenderOptions) =>
	render(ui, { wrapper: Providers as any, ...options });

export { renderWithProviders, render, screen, within, act, waitFor };

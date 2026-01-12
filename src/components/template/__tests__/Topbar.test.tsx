import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { Topbar } from '../Topbar';

test('Topbar renders title', () => {
	renderWithProviders(<Topbar pageTitle="My Page" />);
	expect(screen.getByText('My Page')).toBeInTheDocument();
});

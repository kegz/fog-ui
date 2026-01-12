import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { CardView } from '../CardView';

test('CardView renders title and button', () => {
	renderWithProviders(<CardView title="T" description="d" onViewClick={() => { }} />);
	expect(screen.getByText('T')).toBeInTheDocument();
	expect(screen.getByText('View')).toBeInTheDocument();
});

import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { CircularProgressList } from '../CircularProgressList';

test('CircularProgressList renders item title', () => {
	const items = [{ id: 1, value: 50, title: 'Progress' }];
	renderWithProviders(<CircularProgressList items={items} />);
	expect(screen.getByText('Progress')).toBeInTheDocument();
});

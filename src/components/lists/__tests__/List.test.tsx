import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { GenericList } from '../List';

test('List renders items', () => {
	const items = [
		{ id: 1, title: 'one' },
		{ id: 2, title: 'two' },
	];
	renderWithProviders(<GenericList items={items} />);
	expect(screen.getByText('one')).toBeInTheDocument();
});

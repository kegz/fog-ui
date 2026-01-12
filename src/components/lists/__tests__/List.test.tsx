import React from 'react';
import { renderWithProviders, screen } from '../../../../test/utils';
import { GenericList } from '../../List';

test('GenericList renders items and handles links', () => {
	const items = [
		{ id: 1, title: 'Linked', link: '/x' },
		{ id: 2, title: 'Plain' },
	];

	renderWithProviders(<GenericList items={items as any} />);

	expect(screen.getByText(/Linked/)).toBeInTheDocument();
	expect(screen.getByText(/Plain/)).toBeInTheDocument();
});
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

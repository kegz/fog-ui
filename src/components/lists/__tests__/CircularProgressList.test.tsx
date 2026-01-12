import React from 'react';
import { renderWithProviders, screen } from '../../../../test/utils';
import { CircularProgressList } from '../../CircularProgressList';

test('CircularProgressList renders items and dividers', () => {
	const items = [
		{ id: 1, value: 30, title: 'A' },
		{ id: 2, value: 70, title: 'B' },
	];

	renderWithProviders(<CircularProgressList items={items} />);

	expect(screen.getByText(/A/)).toBeInTheDocument();
	expect(screen.getByText(/B/)).toBeInTheDocument();
	expect(screen.getAllByText(/%/).length).toBeGreaterThanOrEqual(2);
});
import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { CircularProgressList } from '../CircularProgressList';

test('CircularProgressList renders item title', () => {
	const items = [{ id: 1, value: 50, title: 'Progress' }];
	renderWithProviders(<CircularProgressList items={items} />);
	expect(screen.getByText('Progress')).toBeInTheDocument();
});

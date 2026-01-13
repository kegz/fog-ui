import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { GenericList } from '../List';

describe('GenericList - No Data Scenarios', () => {
	test('renders empty list when items array is empty', () => {
		renderWithProviders(<GenericList items={[]} />);

		const list = screen.getByRole('list');
		expect(list).toBeInTheDocument();
		expect(list.children).toHaveLength(0);
	});

	test('handles undefined items array gracefully', () => {
		renderWithProviders(<GenericList items={undefined as any} />);

		const list = screen.getByRole('list');
		expect(list).toBeInTheDocument();
	});

	test('renders nothing when items is null', () => {
		renderWithProviders(<GenericList items={null as any} />);

		const list = screen.getByRole('list');
		expect(list).toBeInTheDocument();
		expect(list.children).toHaveLength(0);
	});

	test('transitions from empty to populated list', () => {
		const { rerender } = renderWithProviders(<GenericList items={[]} />);

		let list = screen.getByRole('list');
		expect(list.children).toHaveLength(0);

		// Simulate API data arrival
		const items = [
			{ id: 1, title: 'Item 1', link: '/item1' },
			{ id: 2, title: 'Item 2', link: '/item2' },
		];

		rerender(<GenericList items={items} />);

		list = screen.getByRole('list');
		expect(list.children).toHaveLength(2);
		expect(screen.getByText('Item 1')).toBeInTheDocument();
		expect(screen.getByText('Item 2')).toBeInTheDocument();
	});
});

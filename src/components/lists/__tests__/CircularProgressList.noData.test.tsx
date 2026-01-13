import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { CircularProgressList } from '../CircularProgressList';

describe('CircularProgressList - No Data Scenarios', () => {
	test('renders empty list when items array is empty', () => {
		renderWithProviders(<CircularProgressList items={[]} />);

		const list = screen.getByRole('list');
		expect(list).toBeInTheDocument();
		expect(screen.queryAllByRole('listitem')).toHaveLength(0);
	});

	test('handles undefined items array', () => {
		renderWithProviders(<CircularProgressList items={undefined as any} />);

		const list = screen.getByRole('list');
		expect(list).toBeInTheDocument();
	});

	test('handles null items array', () => {
		renderWithProviders(<CircularProgressList items={null as any} />);

		const list = screen.getByRole('list');
		expect(list).toBeInTheDocument();
		expect(screen.queryAllByRole('listitem')).toHaveLength(0);
	});

	test('transitions from empty to populated progress list', () => {
		const { rerender } = renderWithProviders(<CircularProgressList items={[]} />);

		expect(screen.queryAllByRole('progressbar')).toHaveLength(0);

		// Simulate API data arrival
		const items = [
			{ id: 1, value: 75, title: 'Task 1' },
			{ id: 2, value: 50, title: 'Task 2' },
		];

		rerender(<CircularProgressList items={items} />);

		expect(screen.getAllByRole('progressbar')).toHaveLength(2);
		expect(screen.getByText('Task 1')).toBeInTheDocument();
		expect(screen.getByText('Task 2')).toBeInTheDocument();
	});

	test('handles items with zero value progress', () => {
		const items = [
			{ id: 1, value: 0, title: 'Not Started' },
		];

		renderWithProviders(<CircularProgressList items={items} />);

		const progressBar = screen.getByRole('progressbar');
		expect(progressBar).toHaveAttribute('aria-valuenow', '0');
		expect(screen.getByText('0%')).toBeInTheDocument();
	});
});

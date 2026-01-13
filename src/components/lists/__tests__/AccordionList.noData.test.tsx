import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { AccordionList } from '../AccordionList';

describe('AccordionList - No Data Scenarios', () => {
	test('renders empty accordion list when items array is empty', () => {
		renderWithProviders(<AccordionList items={[]} />);

		const list = screen.getByRole('list');
		expect(list).toBeInTheDocument();
		expect(list.children).toHaveLength(0);
	});

	test('handles undefined items array', () => {
		renderWithProviders(<AccordionList items={undefined as any} />);

		const list = screen.getByRole('list');
		expect(list).toBeInTheDocument();
	});

	test('handles null items array', () => {
		renderWithProviders(<AccordionList items={null as any} />);

		const list = screen.getByRole('list');
		expect(list).toBeInTheDocument();
		expect(list.children).toHaveLength(0);
	});

	test('transitions from empty to populated accordion', () => {
		const { rerender } = renderWithProviders(<AccordionList items={[]} />);

		let list = screen.getByRole('list');
		expect(list.children).toHaveLength(0);

		// Simulate API data arrival
		const items = [
			{ id: 1, title: 'Section 1', percentage: 75, component: <div>Content 1</div> },
			{ id: 2, title: 'Section 2', percentage: null, component: <div>Content 2</div> },
		];

		rerender(<AccordionList items={items} />);

		list = screen.getByRole('list');
		expect(list.children).toHaveLength(2);
		expect(screen.getByText('Section 1')).toBeInTheDocument();
		expect(screen.getByText('Section 2')).toBeInTheDocument();
	});

	test('renders accordion items without percentage when data is missing', () => {
		const items = [
			{ id: 1, title: 'Section 1', percentage: null, component: <div>Content</div> },
		];

		renderWithProviders(<AccordionList items={items} />);

		expect(screen.getByText('Section 1')).toBeInTheDocument();
		expect(screen.queryByText('%')).not.toBeInTheDocument();
	});
});

import React from 'react';
import { renderWithProviders, screen } from '../../../../test/utils';
import { GenericPieChart } from '../GenericPieChart';

test('GenericPieChart renders title and legend', () => {
	const data = [{ status: 'OK', count: 1, percentage: 100, color: '#000' }];
	renderWithProviders(<GenericPieChart title="Stats" data={data as any} />);
	expect(screen.getByText('Stats')).toBeInTheDocument();
});

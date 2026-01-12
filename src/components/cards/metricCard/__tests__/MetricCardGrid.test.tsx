import React from 'react';
import { renderWithProviders, screen } from '../../../../test/utils';
import { MetricCardGrid } from '../MetricCardGrid';

test('MetricCardGrid renders items', () => {
	const data = [{ title: 'm', value: 1, color: 'red', icon: <div /> } as any];
	renderWithProviders(<MetricCardGrid data={data} />);
	expect(screen.getByText('m')).toBeInTheDocument();
});

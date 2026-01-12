import React from 'react';
import { renderWithProviders, screen } from '../../../../test/utils';
import { TrendAnalyticsChart } from '../TrendAnalyticsChart';

test('TrendAnalyticsChart renders title and metrics when provided', () => {
	const chartData = {
		title: 'Trend',
		xAxisKey: 'day',
		data: [{ day: 'Mon', val: 1 }],
		series: [{ dataKey: 'val', name: 'Value', color: '#123' }],
		metrics: [{ label: 'Total', value: '3' }],
	} as any;

	renderWithProviders(<TrendAnalyticsChart chartData={chartData} />);
	expect(screen.getByText('Trend')).toBeInTheDocument();
	expect(screen.getByText('Total')).toBeInTheDocument();
	expect(screen.getByText('3')).toBeInTheDocument();
});

test('TrendAnalyticsChart renders title even without metrics', () => {
	const chartData = { title: 'Trend', xAxisKey: 'x', data: [], series: [], metrics: [] } as any;
	renderWithProviders(<TrendAnalyticsChart chartData={chartData} />);
	expect(screen.getByText('Trend')).toBeInTheDocument();
});

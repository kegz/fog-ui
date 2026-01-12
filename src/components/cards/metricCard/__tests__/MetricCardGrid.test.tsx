import React from 'react';
import { renderWithProviders, screen } from '../../../../test/utils';
import { MetricCardGrid } from '../MetricCardGrid';

const Icon = () => <svg data-testid="icon" />;

test('MetricCardGrid renders items without trend and with percentage', () => {
	const data = [
		{ value: 42, title: 'T1', color: 'blue', icon: <Icon />, isPercentage: true },
	];

	renderWithProviders(<MetricCardGrid data={data as any} />);

	expect(screen.getByText(/42%/)).toBeInTheDocument();
	expect(screen.getByText('T1')).toBeInTheDocument();
});

test('MetricCardGrid renders positive and negative trends with correct signs', () => {
	const data = [
		{ value: 10, title: 'Inc', color: 'green', icon: <Icon />, isPercentage: false, trend: { current: 15, original: 10, desiredOutcome: 'incline' } },
		{ value: 5, title: 'Dec', color: 'red', icon: <Icon />, isPercentage: false, trend: { current: 2, original: 5, desiredOutcome: 'decline' } },
	];

	renderWithProviders(<MetricCardGrid data={data as any} />);

	// expects + and - signage in trend text
	expect(screen.getByText(/\+5.0%/)).toBeInTheDocument();
	expect(screen.getByText(/-3.0%/)).toBeInTheDocument();
});
import React from 'react';
import { renderWithProviders, screen } from '../../../../test/utils';
import { MetricCardGrid } from '../MetricCardGrid';

test('MetricCardGrid renders items', () => {
	const data = [{ title: 'm', value: 1, color: 'red', icon: <div /> } as any];
	renderWithProviders(<MetricCardGrid data={data} />);
	expect(screen.getByText('m')).toBeInTheDocument();
});

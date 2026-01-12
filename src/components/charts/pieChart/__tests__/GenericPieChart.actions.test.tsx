import React from 'react';
import { renderWithProviders, screen } from '../../../../test/utils';
import userEvent from '@testing-library/user-event';
import { GenericPieChart } from '../GenericPieChart';

test('GenericPieChart calls onRefresh and onExportCsv when buttons present', async () => {
	const data = [
		{ status: 'OK', count: 2, color: '#0f0', percentage: 50 },
	];

	const onRefresh = vi.fn();
	const onExportCsv = vi.fn();

	renderWithProviders(
		<GenericPieChart title="Stats" data={data as any} onRefresh={onRefresh} onExportCsv={onExportCsv} />
	);

	// Buttons are icon buttons; find by role and click
	const refreshBtn = screen.getAllByRole('button')[0];
	await userEvent.click(refreshBtn);
	expect(onRefresh).toHaveBeenCalled();

	const exportBtn = screen.getAllByRole('button')[1];
	await userEvent.click(exportBtn);
	expect(onExportCsv).toHaveBeenCalled();
});

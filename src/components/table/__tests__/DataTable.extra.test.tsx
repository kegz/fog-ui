import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { DataTable } from '../DataTable';

const columns = [{ key: 'name', label: 'Name' }];

test('DataTable renders rowExtraComponent and onRowExpand only called once', async () => {
	const data = [{ _id: '1', name: 'Parent' }];
	const nestedConfig = {
		getNestedData: () => [{ _id: 'n1', name: 'Child' }],
		nestedColumns: columns,
		loading: false,
	} as any;

	const onRowExpand = vi.fn();

	renderWithProviders(
		<DataTable
			title="Users"
			data={data}
			columns={columns as any}
			nestedConfig={nestedConfig}
			onRowExpand={onRowExpand}
			rowExtraComponent={(item: any) => <div>Extra for {item.name}</div>}
		/>
	);

	// open
	await userEvent.click(screen.getByText('Parent'));
	expect(await screen.findByText('Child')).toBeInTheDocument();
	expect(onRowExpand).toHaveBeenCalledTimes(1);

	// close then open again - onRowExpand should NOT be called a second time
	await userEvent.click(screen.getByText('Parent'));
	await userEvent.click(screen.getByText('Parent'));
	expect(onRowExpand).toHaveBeenCalledTimes(1);

	// extra component shows
	expect(screen.getByText('Extra for Parent')).toBeInTheDocument();
});

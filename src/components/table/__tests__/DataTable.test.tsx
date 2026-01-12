import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { DataTable } from '../DataTable';

const columns = [{ key: 'name', label: 'Name' }];

test('DataTable renders title and rows', () => {
	const data = [{ _id: '1', name: 'Alice' }];
	renderWithProviders(
		<DataTable title="Users" data={data} columns={columns as any} />
	);

	expect(screen.getByText('Users')).toBeInTheDocument();
	expect(screen.getByText('Alice')).toBeInTheDocument();
});

test('DataTable shows loading state', () => {
	const data: any[] = [];
	renderWithProviders(
		<DataTable title="Users" data={data} columns={columns as any} loading={true} />
	);

	expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

test('DataTable shows empty message', () => {
	renderWithProviders(
		<DataTable title="Users" data={[]} columns={columns as any} emptyMessage="Empty" />
	);

	expect(screen.getByText('Empty')).toBeInTheDocument();
});

test('DataTable nested opens and calls onRowExpand', async () => {
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
		/>
	);

	// click the row to open nested
	await userEvent.click(screen.getByText('Parent'));

	expect(await screen.findByText('Child')).toBeInTheDocument();
	expect(onRowExpand).toHaveBeenCalled();
});

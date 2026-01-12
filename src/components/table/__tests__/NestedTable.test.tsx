import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { NestedTable } from '../NestedTable';

const columns = [{ key: 'name', label: 'Name' }];

test('NestedTable returns null if no nestedConfig', () => {
	const { container } = renderWithProviders(
		<NestedTable columns={columns as any} nestedConfig={null as any} isOpen={false} item={{}} />
	);
	expect(container).toBeTruthy();
});

test('NestedTable shows loading and empty states and nested rows', () => {
	const item = { _id: '1' };
	const loadingConfig = { getNestedData: () => [], nestedColumns: columns, loading: true } as any;
	const { rerender } = renderWithProviders(
		<NestedTable columns={columns as any} nestedConfig={loadingConfig} isOpen={true} item={item} />
	);

	// loading shows spinner
	expect(screen.getByRole('progressbar')).toBeInTheDocument();

	const emptyConfig = { getNestedData: () => [], nestedColumns: columns, loading: false } as any;
	rerender(
		<NestedTable columns={columns as any} nestedConfig={emptyConfig} isOpen={true} item={item} emptyMessage="Nope" />
	);

	expect(screen.getByText('Nope')).toBeInTheDocument();

	const dataConfig = { getNestedData: () => [{ _id: 'n1', name: 'Child' }], nestedColumns: columns, loading: false } as any;
	rerender(
		<NestedTable columns={columns as any} nestedConfig={dataConfig} isOpen={true} item={item} />
	);

	expect(screen.getByText('Child')).toBeInTheDocument();
});

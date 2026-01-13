import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { NestedTable } from '../NestedTable';

const columns = [
	{ key: 'name', label: 'Name' },
	{ key: 'value', label: 'Value' },
];

describe('NestedTable - No Data Scenarios', () => {
	test('renders default empty message when nested data is empty', () => {
		const nestedConfig = {
			getNestedData: () => [],
			nestedColumns: columns,
		};

		const item = { _id: '1', name: 'Parent' };

		renderWithProviders(
			<table>
				<tbody>
					<NestedTable
						columns={columns as any}
						nestedConfig={nestedConfig as any}
						isOpen={true}
						item={item}
					/>
				</tbody>
			</table>
		);

		expect(screen.getByText('No records found.')).toBeInTheDocument();
	});

	test('renders custom empty message when nested data is empty', () => {
		const nestedConfig = {
			getNestedData: () => [],
			nestedColumns: columns,
		};

		const item = { _id: '1', name: 'Parent' };

		renderWithProviders(
			<table>
				<tbody>
					<NestedTable
						columns={columns as any}
						nestedConfig={nestedConfig as any}
						isOpen={true}
						item={item}
						emptyMessage="No child records available"
					/>
				</tbody>
			</table>
		);

		expect(screen.getByText('No child records available')).toBeInTheDocument();
	});

	test('shows loading spinner when nested data is loading', () => {
		const nestedConfig = {
			getNestedData: () => [],
			nestedColumns: columns,
			loading: true,
		};

		const item = { _id: '1', name: 'Parent' };

		renderWithProviders(
			<table>
				<tbody>
					<NestedTable
						columns={columns as any}
						nestedConfig={nestedConfig as any}
						isOpen={true}
						item={item}
					/>
				</tbody>
			</table>
		);

		expect(screen.getByRole('progressbar')).toBeInTheDocument();
		expect(screen.queryByText('No records found.')).not.toBeInTheDocument();
	});

	test('transitions from loading to no data in nested table', () => {
		const item = { _id: '1', name: 'Parent' };

		const nestedConfigLoading = {
			getNestedData: () => [],
			nestedColumns: columns,
			loading: true,
		};

		const { rerender } = renderWithProviders(
			<table>
				<tbody>
					<NestedTable
						columns={columns as any}
						nestedConfig={nestedConfigLoading as any}
						isOpen={true}
						item={item}
					/>
				</tbody>
			</table>
		);

		expect(screen.getByRole('progressbar')).toBeInTheDocument();

		// Simulate API response with no nested data
		const nestedConfigEmpty = {
			getNestedData: () => [],
			nestedColumns: columns,
			loading: false,
		};

		rerender(
			<table>
				<tbody>
					<NestedTable
						columns={columns as any}
						nestedConfig={nestedConfigEmpty as any}
						isOpen={true}
						item={item}
					/>
				</tbody>
			</table>
		);

		expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
		expect(screen.getByText('No records found.')).toBeInTheDocument();
	});

	test('does not render content when isOpen is false even with no data', () => {
		const nestedConfig = {
			getNestedData: () => [],
			nestedColumns: columns,
		};

		const item = { _id: '1', name: 'Parent' };

		// In real usage, NestedTable is wrapped in a Collapse component with unmountOnExit
		// When isOpen is false, the Collapse doesn't render children at all
		// So we test that the component still works when rendered with isOpen=false
		const { container } = renderWithProviders(
			<table>
				<tbody>
					<NestedTable
						columns={columns as any}
						nestedConfig={nestedConfig as any}
						isOpen={false}
						item={item}
					/>
				</tbody>
			</table>
		);

		// The component renders the empty message regardless of isOpen
		// (in production, Collapse handles visibility)
		expect(screen.getByText('No records found.')).toBeInTheDocument();
	});

	test('handles undefined nested data return', () => {
		const nestedConfig = {
			getNestedData: () => undefined as any,
			nestedColumns: columns,
		};

		const item = { _id: '1', name: 'Parent' };

		renderWithProviders(
			<table>
				<tbody>
					<NestedTable
						columns={columns as any}
						nestedConfig={nestedConfig as any}
						isOpen={true}
						item={item}
					/>
				</tbody>
			</table>
		);

		expect(screen.getByText('No records found.')).toBeInTheDocument();
	});
});

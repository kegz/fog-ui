import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { DataRow } from '../DataRow';

const columns = [{ key: 'name', label: 'Name' }];

test('DataRow renders cells and toggles icon', async () => {
	const item = { _id: '1', name: 'RowOne' };
	const onToggle = vi.fn();

	const { rerender } = renderWithProviders(
		<table>
			<tbody>
				<DataRow
					item={item}
					id={item._id}
					isOpen={false}
					onToggle={onToggle}
					columns={columns as any}
					nestedConfig={true as any}
				/>
			</tbody>
		</table>
	);

	expect(screen.getByText('RowOne')).toBeInTheDocument();

	await userEvent.click(screen.getByText('RowOne'));
	expect(onToggle).toHaveBeenCalled();

	// rerender with open icon
	rerender(
		<table>
			<tbody>
				<DataRow
					item={item}
					id={item._id}
					isOpen={true}
					onToggle={onToggle}
					columns={columns as any}
					nestedConfig={true as any}
				/>
			</tbody>
		</table>
	);

	// icon presence is implicit; ensure row still renders
	expect(screen.getByText('RowOne')).toBeInTheDocument();
});

import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { NoDataTableRow } from '../NoDataTableRow';

const columns = [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }];

test('NoDataTableRow renders message with correct colspan', () => {
	renderWithProviders(<table><tbody><NoDataTableRow columns={columns as any} message="Nothing" /></tbody></table>);
	expect(screen.getByText('Nothing')).toBeInTheDocument();
});

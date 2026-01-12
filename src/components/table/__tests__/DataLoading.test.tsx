import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { DataLoading } from '../DataLoading';

const columns = [{ key: 'a', label: 'A' }];

test('DataLoading shows progress', () => {
	renderWithProviders(<table><tbody><DataLoading columns={columns as any} /></tbody></table>);
	expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

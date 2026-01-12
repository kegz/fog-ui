import React from 'react';
import { renderWithProviders, screen } from '../../test/utils';
import userEvent from '@testing-library/user-event';
import { PermissionCard } from '../PermissionCard';

const data = { _id: 'p1', name: 'read_write', actions: ['read', 'write'], __v: 0 };

test('PermissionCard shows name and renders form switches when expanded', async () => {
	renderWithProviders(<PermissionCard data={data} />);
	// Summary text present
	expect(screen.getByText('read write')).toBeInTheDocument();

	// Expand accordion by clicking summary
	await userEvent.click(screen.getByText('read write'));

	// Form switches with labels "Read" and "Write" should appear
	expect(await screen.findByLabelText('Read')).toBeInTheDocument();
	expect(await screen.findByLabelText('Write')).toBeInTheDocument();
});
import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { PermissionCard } from '../PermissionCard';

test('PermissionCard renders name', () => {
	const data = { _id: '1', name: 'perm', actions: ['a'], __v: 0 };
	renderWithProviders(<PermissionCard data={data} />);
	expect(screen.getByText('perm')).toBeInTheDocument();
});

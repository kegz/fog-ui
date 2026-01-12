import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { UserGroupCard } from '../UserGroupCard';

test('UserGroupCard shows delete/update icons when allowed and handles empty permissions', async () => {
	const props = { _id: '1', name: 'group_one', description: 'desc', permissionsList: [], allowDelete: true, allowUpdate: true } as any;
	renderWithProviders(<UserGroupCard {...props} />);

	// name rendered
	expect(screen.getByText('group one')).toBeInTheDocument();

	// icons should be present (two buttons)
	const buttons = screen.getAllByRole('button');
	expect(buttons.length).toBeGreaterThanOrEqual(2);

	// permissions empty branch
	expect(screen.getByText('No Permissions Assigned.')).toBeInTheDocument();
});

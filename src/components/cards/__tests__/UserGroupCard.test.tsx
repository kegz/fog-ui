import React from 'react';
import { renderWithProviders, screen } from '../../../../test/utils';
import userEvent from '@testing-library/user-event';
import { UserGroupCard } from '../../UserGroupCard';

test('UserGroupCard renders update and delete icons when allowed', async () => {
	renderWithProviders(
		<UserGroupCard
			_id={'g1'}
			name={'group_one'}
			description={'desc'}
			permissionsList={['p1', 'p2']}
			allowDelete
			allowUpdate
		/>
	);

	const summary = screen.getByRole('button', { name: /group one/i });
	await userEvent.click(summary);

	// icons present in summary text
	expect(screen.getByText(/group one/i)).toBeInTheDocument();
	// click the delete and update buttons to exercise handlers
	const del = screen.getByLabelText('Delete group_one');
	const upd = screen.getByLabelText('Edit group_one');
	await userEvent.click(del);
	await userEvent.click(upd);
});

test('UserGroupCard shows no permissions message', async () => {
	renderWithProviders(
		<UserGroupCard _id={'g2'} name={'no_perms'} description={'desc'} permissionsList={[]} />
	);

	const summary = screen.getByRole('button', { name: /no perms/i });
	await userEvent.click(summary);

	expect(screen.getByText(/No Permissions Assigned/i)).toBeInTheDocument();
});
import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { UserGroupCard } from '../UserGroupCard';

test('UserGroupCard renders name', () => {
	renderWithProviders(<UserGroupCard _id={'1'} name={'grp'} description={''} permissionsList={[]} />);
	expect(screen.getByText('grp')).toBeInTheDocument();
});

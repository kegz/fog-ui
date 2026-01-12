import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { UserGroupCard } from '../UserGroupCard';

test('UserGroupCard renders name', () => {
	renderWithProviders(<UserGroupCard _id={'1'} name={'grp'} description={''} permissionsList={[]} />);
	expect(screen.getByText('grp')).toBeInTheDocument();
});

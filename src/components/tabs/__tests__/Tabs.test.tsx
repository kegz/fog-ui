import React from 'react';
import { renderWithProviders, screen } from '../../../../src/test/utils';
import { GenericTabs } from '../Tabs';

test('Tabs renders labels', () => {
	const tabs = [{ label: 'A', content: 'A content' }, { label: 'B', content: 'B content' }];
	renderWithProviders(<GenericTabs tabsData={tabs} />);
	expect(screen.getByText('A')).toBeInTheDocument();
});

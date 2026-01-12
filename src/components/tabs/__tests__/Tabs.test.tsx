import React from 'react';
import { renderWithProviders, screen } from '../../../../test/utils';
import userEvent from '@testing-library/user-event';
import { GenericTabs } from '../../Tabs';

test('GenericTabs shows active tab content on click', async () => {
	const tabs = [
		{ label: 'A', content: 'Content A' },
		{ label: 'B', content: 'Content B' },
	];

	renderWithProviders(<GenericTabs tabsData={tabs as any} />);

	// initially first tab content
	expect(screen.getByText(/Content A/)).toBeInTheDocument();

	// click second tab and assert content switches
	const tabB = screen.getByText('B');
	await userEvent.click(tabB);
	expect(await screen.findByText(/Content B/)).toBeInTheDocument();
});
import React from 'react';
import { renderWithProviders, screen } from '../../../../src/test/utils';
import { GenericTabs } from '../Tabs';

test('Tabs renders labels', () => {
	const tabs = [{ label: 'A', content: 'A content' }, { label: 'B', content: 'B content' }];
	renderWithProviders(<GenericTabs tabsData={tabs} />);
	expect(screen.getByText('A')).toBeInTheDocument();
});

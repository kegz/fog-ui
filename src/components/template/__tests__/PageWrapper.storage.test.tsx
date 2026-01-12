import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { PageWrapper } from '../PageWrapper';
import { act } from 'react-dom/test-utils';

test('PageWrapper listens to storage events and updates title', async () => {
	const menuItems = { main: [{ label: 'Goto', path: '/goto' }] };

	renderWithProviders(
		<PageWrapper menuItems={menuItems}>
			<div>Child</div>
		</PageWrapper>
	);

	// simulate another window updating pageTitle and dispatch storage event
	act(() => {
		localStorage.setItem('pageTitle', 'FromStorage');
		const ev = new StorageEvent('storage', { key: 'pageTitle', newValue: 'FromStorage' } as any);
		window.dispatchEvent(ev);
	});

	expect(await screen.findByText('FromStorage')).toBeInTheDocument();
});

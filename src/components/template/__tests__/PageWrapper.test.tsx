import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { PageWrapper } from '../PageWrapper';

test('PageWrapper renders children and topbar', () => {
	renderWithProviders(
		<PageWrapper menuItems={{}}>
			<div>Child Content</div>
		</PageWrapper>
	);

	expect(screen.getByText('Child Content')).toBeInTheDocument();
});

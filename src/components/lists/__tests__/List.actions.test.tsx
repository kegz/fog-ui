import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import userEvent from '@testing-library/user-event';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useNavigate: () => navigateMock,
	};
});

import { GenericList } from '../List';

test('clicking link item navigates', async () => {
	const items = [
		{ id: 1, title: 'one', link: '/one' },
	];

	renderWithProviders(<GenericList items={items as any} />);
	await userEvent.click(screen.getByText('one'));
	expect(navigateMock).toHaveBeenCalledWith('/one');
});

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

import { Topbar } from '../Topbar';

test('Topbar buttons call navigate handlers', async () => {
	renderWithProviders(<Topbar pageTitle="Hello" />);
	expect(screen.getByText('Hello')).toBeInTheDocument();
	await userEvent.click(screen.getByRole('button', { name: /admin/i }));
	expect(navigateMock).toHaveBeenCalledWith('/configuration');
	await userEvent.click(screen.getByRole('button', { name: /log out/i }));
	expect(navigateMock).toHaveBeenCalledWith('/');
});

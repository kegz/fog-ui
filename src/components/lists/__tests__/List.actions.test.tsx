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

test('keyboard navigation with Enter key', async () => {
	const items = [
		{ id: 1, title: 'Dashboard', link: '/dashboard' },
	];

	renderWithProviders(<GenericList items={items as any} />);

	const listItem = screen.getByTestId('list-item-button-1');
	listItem.focus();

	await userEvent.keyboard('{Enter}');
	expect(navigateMock).toHaveBeenCalledWith('/dashboard');
});

test('keyboard navigation with Space key', async () => {
	navigateMock.mockClear();
	const items = [
		{ id: 2, title: 'Settings', link: '/settings' },
	];

	renderWithProviders(<GenericList items={items as any} />);

	const listItem = screen.getByTestId('list-item-button-2');
	listItem.focus();

	await userEvent.keyboard(' ');
	expect(navigateMock).toHaveBeenCalledWith('/settings');
});

test('does not navigate when item has no link', async () => {
	navigateMock.mockClear();
	const items = [
		{ id: 3, title: 'No Link' }, // No link property
	];

	renderWithProviders(<GenericList items={items as any} />);

	// Button should be disabled when there's no link (uses div with aria-disabled)
	const listItem = screen.getByTestId('list-item-button-3');
	expect(listItem).toHaveAttribute('aria-disabled', 'true');

	// Navigate should not have been called
	expect(navigateMock).not.toHaveBeenCalled();
});

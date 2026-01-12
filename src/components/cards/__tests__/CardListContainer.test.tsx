import React from 'react';
import { renderWithProviders, screen } from '../../../../test/utils';
import userEvent from '@testing-library/user-event';
import { CardListContainer } from '../../CardListContainer';

test('CardListContainer renders multiple cards and delegates onView', async () => {
	const a = vi.fn();
	const b = vi.fn();

	const cards = [
		{ id: 'a', title: 'A', description: 'one', onViewClick: a },
		{ id: 'b', title: 'B', description: 'two', onViewClick: b },
	];

	renderWithProviders(<CardListContainer cards={cards as any} />);

	expect(screen.getByText('A')).toBeInTheDocument();
	expect(screen.getByText('B')).toBeInTheDocument();

	const buttons = screen.getAllByRole('button', { name: /view/i });
	await userEvent.click(buttons[0]);
	await userEvent.click(buttons[1]);

	expect(a).toHaveBeenCalled();
	expect(b).toHaveBeenCalled();
});

test('CardListContainer handles empty list', () => {
	renderWithProviders(<CardListContainer cards={[]} />);
	// nothing should render, but render shouldn't crash
	expect(document.body).toBeTruthy();
});
import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { CardListContainer } from '../CardListContainer';

test('CardListContainer renders child card', () => {
	const cards = [{ id: 1, description: 'd', onViewClick: () => { } } as any];
	renderWithProviders(<CardListContainer cards={cards} />);
	expect(screen.getByText('View')).toBeInTheDocument();
});

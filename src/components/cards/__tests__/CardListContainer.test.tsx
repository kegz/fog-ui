import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { CardListContainer } from '../CardListContainer';

test('CardListContainer renders child card', () => {
	const cards = [{ id: 1, description: 'd', onViewClick: () => { } } as any];
	renderWithProviders(<CardListContainer cards={cards} />);
	expect(screen.getByText('View')).toBeInTheDocument();
});

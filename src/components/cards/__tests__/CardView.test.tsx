import React from 'react';
import { renderWithProviders, screen } from '../../../../test/utils';
import userEvent from '@testing-library/user-event';
import { CardView } from '../../CardView';

test('CardView renders title, description, component and handles view click', async () => {
	const onView = vi.fn();
	renderWithProviders(
		<CardView
			title="My Title"
			description="Desc"
			component={<div data-testid="inner">Inner</div>}
			onViewClick={onView}
		/>
	);

	expect(screen.getByText('My Title')).toBeInTheDocument();
	expect(screen.getByText('Desc')).toBeInTheDocument();
	expect(screen.getByTestId('inner')).toBeInTheDocument();

	const btn = screen.getByRole('button', { name: /view/i });
	await userEvent.click(btn);
	expect(onView).toHaveBeenCalled();
});

test('CardView renders without optional fields', () => {
	const onView = vi.fn();
	renderWithProviders(<CardView description="Only Desc" onViewClick={onView} />);

	expect(screen.queryByText('Only Desc')).toBeInTheDocument();
	expect(screen.queryByRole('heading')).not.toBeInTheDocument();
});
import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { CardView } from '../CardView';

test('CardView renders title and button', () => {
	renderWithProviders(<CardView title="T" description="d" onViewClick={() => { }} />);
	expect(screen.getByText('T')).toBeInTheDocument();
	expect(screen.getByText('View')).toBeInTheDocument();
});

import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { SearchForm } from '../SearchForm';

test('SearchForm renders title', () => {
	renderWithProviders(<SearchForm title="Search" data={[]} handleFormSubmit={() => { }} />);
	expect(screen.getByText('Search')).toBeInTheDocument();
});

test('SearchForm expands and collapses accordion', async () => {
	const handleSubmit = vi.fn();
	const fields = [{ name: 'q', label: 'Query', type: 'text' as const }];

	renderWithProviders(<SearchForm title="Search Filters" data={fields} handleFormSubmit={handleSubmit} />);

	// Get the accordion summary button
	const summary = screen.getByTestId('search-form-accordion-summary');

	// Initially collapsed
	expect(summary).toHaveAttribute('aria-expanded', 'false');

	// Click to expand
	await userEvent.click(summary);

	// Now expanded
	expect(summary).toHaveAttribute('aria-expanded', 'true');

	// Should be able to see form content
	expect(screen.getByTestId('search-form-accordion-details')).toBeInTheDocument();
});

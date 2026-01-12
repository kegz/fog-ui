import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { SearchForm } from '../SearchForm';

test('SearchForm renders title', () => {
	renderWithProviders(<SearchForm title="Search" data={[]} handleFormSubmit={() => { }} />);
	expect(screen.getByText('Search')).toBeInTheDocument();
});

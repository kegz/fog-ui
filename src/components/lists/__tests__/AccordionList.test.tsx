import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { AccordionList } from '../AccordionList';

test('AccordionList renders item title', () => {
	const items = [{ id: '1', title: 'T', percentage: null, component: <div>inner</div> }];
	renderWithProviders(<AccordionList items={items} />);
	expect(screen.getByText('T')).toBeInTheDocument();
});

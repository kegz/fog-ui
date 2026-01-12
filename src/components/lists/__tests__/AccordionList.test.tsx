import React from 'react';
import { renderWithProviders, screen } from '../../../../test/utils';
import { AccordionList } from '../../AccordionList';

test('AccordionList shows percentage when present and hides when null', () => {
	const items = [
		{ id: 1, title: 'One', percentage: 50, component: <div>c</div> },
		{ id: 2, title: 'Two', percentage: null, component: <div>d</div> },
	];

	renderWithProviders(<AccordionList items={items} />);

	expect(screen.getByText(/One/)).toBeInTheDocument();
	expect(screen.getByText(/50%/)).toBeInTheDocument();
	expect(screen.getByText(/Two/)).toBeInTheDocument();
});
import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { AccordionList } from '../AccordionList';

test('AccordionList renders item title', () => {
	const items = [{ id: '1', title: 'T', percentage: null, component: <div>inner</div> }];
	renderWithProviders(<AccordionList items={items} />);
	expect(screen.getByText('T')).toBeInTheDocument();
});

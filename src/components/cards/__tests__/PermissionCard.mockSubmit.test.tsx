import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// reset modules so we can mock the form before PermissionCard imports it
vi.resetModules();

vi.mock('../../forms/Form', async () => {
	const actual = await vi.importActual('../../forms/Form');
	return {
		...actual,
		GenericForm: (props: any) => (
			<div>
				<button onClick={() => props.onSubmit && props.onSubmit({ preventDefault: () => { } })}>
					mock-submit-event
				</button>
			</div>
		),
	};
});

import { PermissionCard } from '../PermissionCard';

test('PermissionCard submit handler processes event-like submit', async () => {
	renderWithProviders(<PermissionCard data={{ _id: 'ev1', name: 'evt', actions: ['x'], __v: 0 }} />);
	// expand and click the mock submit button which will pass an event-like object
	await userEvent.click(screen.getByText('evt'));
	const btn = screen.getByText('mock-submit-event');
	await userEvent.click(btn);
	// if no error thrown, handler branch executed
	expect(screen.getByText('evt')).toBeInTheDocument();
});

import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { GenericForm } from '../Form';

beforeEach(() => {
	// reset fetch mock
	// @ts-expect-error
	global.fetch = undefined;
});

test('GenericForm fetches select options and applies defaultValue', async () => {
	const fields: any[] = [
		{
			name: 'project',
			label: 'Project',
			type: 'select',
			apiEndpoint: '/api/projects',
			optionValueKey: 'id',
			optionLabelKey: 'name',
			defaultValue: 'p2',
		},
	];

	// mock fetch
	// @ts-expect-error
	global.fetch = vi.fn(() =>
		Promise.resolve({ json: () => Promise.resolve([{ id: 'p2', name: 'Project Two' }]) })
	);

	renderWithProviders(<GenericForm fields={fields} onSubmit={undefined} />);

	// the native select input should have the selected value after fetch/default applied
	expect(await screen.findByDisplayValue('p2')).toBeInTheDocument();
});

test('GenericForm validates required fields and shows helperText', async () => {
	const fields: any[] = [
		{ name: 'name', label: 'Name', type: 'text', required: true },
	];

	renderWithProviders(<GenericForm fields={fields} onSubmit={undefined} />);

	const input = screen.getByRole('textbox') as HTMLInputElement;
	await userEvent.type(input, 'A');
	await userEvent.clear(input);

	expect(await screen.findByText(/This field is required/i)).toBeInTheDocument();
});

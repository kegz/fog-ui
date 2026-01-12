import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { GenericForm } from '../Form';

test('GenericForm supports defaults for various field types and submits those values', async () => {
	const fields = [
		{ name: 't', label: 'Text', type: 'text', defaultValue: 'hello' },
		{
			name: 's',
			label: 'Select',
			type: 'select',
			defaultValue: 'a',
			options: [
				{ value: 'a', label: 'A' },
				{ value: 'b', label: 'B' },
			],
		},
		{
			name: 'm',
			label: 'Multi',
			type: 'multiselect',
			defaultValue: ['x'],
			options: [
				{ value: 'x', label: 'X' },
				{ value: 'y', label: 'Y' },
			],
		},
		{ name: 'sw', label: 'Switch', type: 'switch', defaultValue: true },
		{ name: 'r', label: 'Rating', type: 'rating', defaultValue: 4 },
	];

	const onSubmit = vi.fn();
	renderWithProviders(<GenericForm fields={fields as any} onSubmit={onSubmit} />);

	// Submit immediately and expect defaults to be present in payload
	const submit = screen.getByRole('button', { name: /submit/i });
	await userEvent.click(submit);

	expect(onSubmit).toHaveBeenCalled();
	const payload = onSubmit.mock.calls[0][0];
	expect(payload.t).toBe('hello');
	expect(payload.s).toBe('a');
	expect(payload.m).toEqual(['x']);
	expect(payload.sw).toBe(true);
	expect(payload.r).toBe(4);
});

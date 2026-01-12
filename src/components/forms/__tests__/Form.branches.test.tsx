import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { GenericForm } from '../Form';

test('GenericForm handles multiselect default and renderValue mapping', async () => {
	const fields: any[] = [
		{
			name: 'tags',
			label: 'Tags',
			type: 'multiselect',
			options: [
				{ value: 'a', label: 'Alpha' },
				{ value: 'b', label: 'Beta' },
			],
			defaultValue: ['a'],
		},
	];

	renderWithProviders(<GenericForm fields={fields} onSubmit={undefined} />);

	// selected native input value should reflect default
	expect(await screen.findByDisplayValue('a')).toBeInTheDocument();
});

test('GenericForm switch and rating fields call onChange', async () => {
	const switchChange = vi.fn();
	const ratingChange = vi.fn();

	const fields: any[] = [
		{ name: 'active', label: 'Active', type: 'switch', onChange: switchChange },
		{ name: 'rate', label: 'Rate', type: 'rating', onChange: ratingChange },
		{ name: 'unknown', label: 'Unknown', type: 'mystery' },
	];

	renderWithProviders(<GenericForm fields={fields} onSubmit={undefined} />);

	const checkbox = screen.getByRole('switch');
	await userEvent.click(checkbox);
	expect(switchChange).toHaveBeenCalled();

	// rating renders with role 'radio' items; click first star
	const stars = screen.getAllByRole('radio');
	if (stars.length) {
		await userEvent.click(stars[0]);
		expect(ratingChange).toHaveBeenCalled();
	}
});

test('GenericForm logs error when fetch fails for apiEndpoint', async () => {

	const fields: any[] = [
		{
			name: 'remote',
			label: 'Remote',
			type: 'text',
			apiEndpoint: '/api/bad',
			defaultValue: 'X',
		},
	];

	const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

	// mock fetch to reject

	// @ts-expect-error
	global.fetch = vi.fn(() => Promise.reject(new Error('network')));

	renderWithProviders(<GenericForm fields={fields} onSubmit={undefined} />);

	// wait for effect to run and error to be logged
	await new Promise((r) => setTimeout(r, 0));

	expect(consoleSpy).toHaveBeenCalled();

	consoleSpy.mockRestore();
});

test('GenericForm applies static default when fields change (else branch)', async () => {
	const baseField: any = { name: 'dyn', label: 'Dyn', type: 'text' };

	const { rerender } = renderWithProviders(<GenericForm fields={[baseField]} onSubmit={undefined} />);

	// now update fields to include defaultValue and rerender to trigger effect
	rerender(<GenericForm fields={[{ ...baseField, defaultValue: 'hello' }]} onSubmit={undefined} />);

	expect(await screen.findByDisplayValue('hello')).toBeInTheDocument();
});

test('GenericForm shows minLength validation message', async () => {
	const fields: any[] = [
		{
			name: 'short',
			label: 'Short',
			type: 'text',
			validations: [{ rule: 'minLength', args: [3] }],
		},
	];

	renderWithProviders(<GenericForm fields={fields} onSubmit={undefined} />);

	const input = screen.getByLabelText('Short') as HTMLInputElement;

	await userEvent.type(input, 'ab');

	expect(await screen.findByText(/Must be at least 3 characters/i)).toBeInTheDocument();
});

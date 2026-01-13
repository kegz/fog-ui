import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { FilterFormCard } from '../FilterFormCard';

test('FilterFormCard calls onChange and handles errors', async () => {
	const onChange = vi.fn();
	const fields: any[] = [{ name: 'q', label: 'Q', type: 'text' }];

	renderWithProviders(<FilterFormCard name={'filter_one'} filterFormFields={fields} onChange={onChange} />);

	// open accordion then submit
	const summary = screen.getByRole('button', { name: /filter one/i });
	await userEvent.click(summary);
	const btn = await screen.findByText('Search');
	await userEvent.click(btn);

	expect(onChange).toHaveBeenCalled();
});

test('FilterFormCard logs when onChange throws', async () => {
	const onChange = () => { throw new Error('boom'); };
	const fields: any[] = [{ name: 'q', label: 'Q', type: 'text' }];
	const spy = vi.spyOn(console, 'error').mockImplementation(() => { });

	renderWithProviders(<FilterFormCard name={'filter_two'} filterFormFields={fields} onChange={onChange as any} />);

	const summary = screen.getByRole('button', { name: /filter two/i });
	await userEvent.click(summary);
	const btn = await screen.findByText('Search');
	await userEvent.click(btn);

	expect(spy).toHaveBeenCalled();
	spy.mockRestore();
});

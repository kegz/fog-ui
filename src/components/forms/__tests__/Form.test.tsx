import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { GenericForm } from '../Form';

test('GenericForm renders and submits', async () => {
	const fields = [{ name: 'a', label: 'A', type: 'text' }];
	const onSubmit = vi.fn();
	renderWithProviders(<GenericForm fields={fields as any} onSubmit={onSubmit} />);
	const input = screen.getByLabelText('A') as HTMLInputElement;
	await userEvent.type(input, 'hello');
	const submit = screen.getByRole('button', { name: /submit/i });
	await userEvent.click(submit);
	expect(onSubmit).toHaveBeenCalled();
});

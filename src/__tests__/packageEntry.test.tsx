import React from 'react';
import { renderWithProviders, screen } from '../test/utils';
import userEvent from '@testing-library/user-event';
import * as pkg from '../index';

test('package root exports expected symbols', () => {
	expect(pkg.Form).toBeDefined();
	expect(pkg.CardView).toBeDefined();
	expect(pkg.createFogTheme).toBeDefined();
	expect(pkg.ThemeContextProvider).toBeDefined();
});

test('consumer can render Form from package and submit', async () => {
	const fields = [{ name: 'a', label: 'A', type: 'text' }];
	const onSubmit = vi.fn();

	renderWithProviders(<pkg.Form fields={fields as any} onSubmit={onSubmit} />);

	const input = screen.getByLabelText('A') as HTMLInputElement;
	await userEvent.type(input, 'hello');
	const submit = screen.getByRole('button', { name: /submit/i });
	await userEvent.click(submit);

	expect(onSubmit).toHaveBeenCalled();
});

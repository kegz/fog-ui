import React from 'react';
import { renderWithProviders, screen, waitFor } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { PopUpForm } from '../PopUpForm';

test('PopUpForm opens and closes on successful submit', async () => {
	const onSubmit = vi.fn(() => Promise.resolve(true));
	renderWithProviders(<PopUpForm suitesFormFields={[{ name: 'a', label: 'A', type: 'text' }]} onSubmit={onSubmit} />);

	const openBtn = screen.getByRole('button', { name: /create suite/i });
	await userEvent.click(openBtn);

	const submit = await screen.findByRole('button', { name: /submit/i });
	await userEvent.click(submit);

	await waitFor(() => {
		// dialog should be closed (submit resolved true triggers close)
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});
});

test('PopUpForm warns when onSubmit returns falsy and logs on error', async () => {
	const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
	const errSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

	const onSubmitFalsy = vi.fn(() => undefined);
	renderWithProviders(<PopUpForm suitesFormFields={[{ name: 'a', label: 'A', type: 'text' }]} onSubmit={onSubmitFalsy} />);

	await userEvent.click(screen.getByRole('button', { name: /create suite/i }));
	const submit = await screen.findByRole('button', { name: /submit/i });
	await userEvent.click(submit);

	expect(warnSpy).toHaveBeenCalled();

	// error branch
	const onSubmitErr = vi.fn(() => { throw new Error('bad'); });
	renderWithProviders(<PopUpForm suitesFormFields={[{ name: 'a', label: 'A', type: 'text' }]} onSubmit={onSubmitErr as any} />);
	await userEvent.click(screen.getAllByRole('button', { name: /create suite/i })[1]);
	const submit2 = await screen.findAllByRole('button', { name: /submit/i });
	await userEvent.click(submit2[1]);

	expect(errSpy).toHaveBeenCalled();

	warnSpy.mockRestore();
	errSpy.mockRestore();
});

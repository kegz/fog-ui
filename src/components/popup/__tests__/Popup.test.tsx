import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { Popup } from '../popup';

test('Popup renders title when open', () => {
	renderWithProviders(<Popup title="Hi" open={true} onClose={() => { }} component={<div>c</div>} />);
	expect(screen.getByText('Hi')).toBeInTheDocument();
});

test('Popup buttons render and callbacks fire; close icon calls onClose', async () => {
	const onClose = vi.fn();
	const btn1 = vi.fn();

	renderWithProviders(
		<Popup
			title="Actions"
			open={true}
			onClose={onClose}
			component={<div>body</div>}
			buttons={[{ text: 'OK', onClick: btn1 }]}
		/>
	);

	expect(screen.getByText('Actions')).toBeInTheDocument();
	expect(screen.getByText('OK')).toBeInTheDocument();

	await userEvent.click(screen.getByText('OK'));
	expect(btn1).toHaveBeenCalled();

	// close button
	await userEvent.click(screen.getByLabelText('Close dialog'));
	expect(onClose).toHaveBeenCalled();
});

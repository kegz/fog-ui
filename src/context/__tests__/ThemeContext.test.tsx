import React, { useContext } from 'react';
import { renderWithProviders, screen } from '../../test/utils';
import userEvent from '@testing-library/user-event';
import { ThemeContext } from '../ThemeContext';

const Consumer = () => {
	const { mode, toggleTheme } = useContext(ThemeContext as any);
	return (
		<div>
			<span>{mode}</span>
			<button onClick={toggleTheme}>toggle</button>
		</div>
	);
};

test('ThemeContext toggles mode', async () => {
	renderWithProviders(<Consumer />);
	expect(screen.getByText('light')).toBeInTheDocument();
	const btn = screen.getByText('toggle');
	await userEvent.click(btn);
	expect(await screen.findByText('dark')).toBeInTheDocument();
});

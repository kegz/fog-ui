import React, { useContext } from 'react';
import { renderWithProviders, screen } from '../../test/utils';
import userEvent from '@testing-library/user-event';
import { render, fireEvent } from '@testing-library/react';
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

const ColorConsumer = () => {
	const { primaryColor, changePrimaryColor } = useContext(ThemeContext as any);
	return (
		<div>
			<span>{primaryColor}</span>
			<button onClick={() => changePrimaryColor('#000')}>change</button>
		</div>
	);
};

test('ThemeContext toggles and changes color', async () => {
	renderWithProviders(<ColorConsumer />);
	expect(screen.getByText('#1976D2')).toBeInTheDocument();
	const btn = screen.getByText('change');
	await userEvent.click(btn);
	expect(await screen.findByText('#000')).toBeInTheDocument();
});

test('ThemeContext toggles mode', async () => {
	renderWithProviders(<Consumer />);
	expect(screen.getByText('light')).toBeInTheDocument();
	const btn = screen.getByText('toggle');
	await userEvent.click(btn);
	expect(await screen.findByText('dark')).toBeInTheDocument();
});

test('ThemeContext persists to localStorage', async () => {
	// clear storage and render provider with a consumer that invokes changes
	localStorage.clear();

	const LocalTester = () => {
		const { toggleTheme, changePrimaryColor } = React.useContext(ThemeContext as any);
		return (
			<div>
				<button onClick={() => toggleTheme()}>t</button>
				<button onClick={() => changePrimaryColor('#123456')}>c</button>
			</div>
		);
	};

	renderWithProviders(<LocalTester />);
	// toggle theme -> should write themeMode
	await userEvent.click(screen.getByText('t'));
	expect(localStorage.getItem('themeMode')).toBeTruthy();

	// change color -> should write primaryColor
	await userEvent.click(screen.getByText('c'));
	expect(localStorage.getItem('primaryColor')).toBe('#123456');
});

test('ThemeContext default functions are callable without provider', () => {
	// render a consumer without ThemeContextProvider to use default context value
	const NoProviderConsumer = () => {
		const ctx = React.useContext(ThemeContext as any);
		return (
			<div>
				<span>{ctx.primaryColor}</span>
				<button onClick={() => { ctx.toggleTheme(); ctx.changePrimaryColor('#111111'); }}>call</button>
			</div>
		);
	};

	// use testing-library's render directly so we do NOT get the provider wrapper
	const utils = render(<NoProviderConsumer />);
	expect(utils.getByText('#1976D2')).toBeInTheDocument();
	fireEvent.click(utils.getByText('call'));
	// default primaryColor remains unchanged because default changePrimaryColor is noop
	expect(utils.getByText('#1976D2')).toBeInTheDocument();
});

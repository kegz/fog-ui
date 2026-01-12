import { createTheme, ThemeOptions } from '@mui/material/styles';

export function createFogTheme(options?: ThemeOptions) {
	const base: ThemeOptions = {
		palette: {
			primary: { main: '#1976D2' },
			secondary: { main: '#9c27b0' },
			mode: 'light',
		},
		typography: {
			fontFamily: ['Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
		},
	};

	return createTheme({ ...base, ...(options || {}) });
}

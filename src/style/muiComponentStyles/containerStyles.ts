import { Theme } from '@mui/material';

export const pageContainer = (theme: Theme) => ({
	root: {
		display: 'flex',
		minHeight: '100vh',
		background: theme.palette.background.default,
	},
});

export const DrawerContainer = () => ({
	root: {
		width: 300,
		flexShrink: 0,
		'& .MuiDrawer-paper': {
			width: 300,
			boxSizing: 'border-box',
		},
	},
});

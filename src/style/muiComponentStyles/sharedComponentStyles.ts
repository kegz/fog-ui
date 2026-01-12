import { Theme } from '@mui/material';

export const metricCardComponentStyle = (theme: Theme) => ({
	root: {
		padding: theme.spacing(2),
		display: 'flex',
		gap: theme.spacing(1),
	},
	card: {
		padding: theme.spacing(2),
		borderRadius: 12,
		backgroundColor: theme.palette.background.paper,
	},
});

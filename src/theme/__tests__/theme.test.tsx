import { createFogTheme } from '../theme';

test('createFogTheme accepts overrides and returns theme with primary color', () => {
	const theme = createFogTheme({ palette: { primary: { main: '#123456' } } } as any);
	expect(theme.palette?.primary?.main).toBe('#123456');
});

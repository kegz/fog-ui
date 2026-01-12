import { createFogTheme } from '../theme';

test('createFogTheme returns a theme with defaults and overrides', () => {
	const t = createFogTheme();
	expect(t.palette?.primary?.main).toBeDefined();
	const t2 = createFogTheme({ palette: { mode: 'dark' } as any });
	expect(t2.palette?.mode).toBe('dark');
});

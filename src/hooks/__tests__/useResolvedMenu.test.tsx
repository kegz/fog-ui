import React from 'react';
import { renderWithProviders, screen } from '../../test/utils';
import { useResolvedMenu } from '../useResolvedMenu';

const Consumer = ({ menu }: { menu: Record<string, any[]> }) => {
	const resolved = useResolvedMenu(menu as any);
	return <div data-testid="keys">{Object.keys(resolved).join(',')}</div>;
};

test('useResolvedMenu returns provided menu structure', () => {
	const menu = { primary: [{ id: 1, title: 'One' }], secondary: [] };
	renderWithProviders(<Consumer menu={menu} />);
	expect(screen.getByTestId('keys').textContent).toContain('primary');
});

import { MenuItem } from '../components/template/types';

// A tiny utility hook that currently returns the menuItems as-is.
// Consumers can replace or enhance this to resolve route params.
export function useResolvedMenu(menuItems: Record<string, MenuItem[]>) {
	return menuItems as Record<string, MenuItem[]>;
}

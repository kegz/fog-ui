import React from 'react';
import { renderWithProviders, screen } from '../../../../test/utils';
import userEvent from '@testing-library/user-event';
import { PermissionCard } from '../../PermissionCard';

test('PermissionCard renders actions as switches and submits', async () => {
	const data = { _id: '1', name: 'perm_one', actions: ['read', 'write'], __v: 0 };
	renderWithProviders(<PermissionCard data={data} />);

	const summary = screen.getByRole('button', { name: /perm one/i });
	await userEvent.click(summary);

	expect(screen.getByLabelText(/Read/i)).toBeInTheDocument();
	expect(screen.getByLabelText(/Write/i)).toBeInTheDocument();
	// submit the form to exercise submit handler
	const submit = screen.getByRole('button', { name: /submit/i });
	await userEvent.click(submit);
});
import React from 'react';
import { renderWithProviders, screen } from '../../test/utils';
import userEvent from '@testing-library/user-event';
import { PermissionCard } from '../PermissionCard';

const data = { _id: 'p1', name: 'read_write', actions: ['read', 'write'], __v: 0 };

test('PermissionCard shows name and renders form switches when expanded', async () => {
	renderWithProviders(<PermissionCard data={data} />);
	// Summary text present
	expect(screen.getByText('read write')).toBeInTheDocument();

	// Expand accordion by clicking summary
	await userEvent.click(screen.getByText('read write'));

	// Form switches with labels "Read" and "Write" should appear
	expect(await screen.findByLabelText('Read')).toBeInTheDocument();
	expect(await screen.findByLabelText('Write')).toBeInTheDocument();
	// submit to exercise handler
	const submitBtn = await screen.findByRole('button', { name: /submit/i });
	await userEvent.click(submitBtn);
});

test('PermissionCard handles empty actions gracefully and can submit', async () => {
	const data = { _id: 'e1', name: 'empty_actions', actions: [], __v: 0 };
	renderWithProviders(<PermissionCard data={data} />);

	// summary shows name
	expect(screen.getByText('empty actions')).toBeInTheDocument();

	// expand and ensure no switches
	await userEvent.click(screen.getByText('empty actions'));
	expect(screen.queryByRole('checkbox')).toBeNull();

	// still able to submit form (no-op)
	const submitBtn = screen.queryByRole('button', { name: /submit/i });
	if (submitBtn) await userEvent.click(submitBtn);
	expect(screen.getByText('empty actions')).toBeInTheDocument();
});

test('PermissionCard single action label capitalization', async () => {
	const data = { _id: 's1', name: 'single_act', actions: ['approve'], __v: 0 };
	renderWithProviders(<PermissionCard data={data} />);
	await userEvent.click(screen.getByText('single act'));
	expect(await screen.findByLabelText('Approve')).toBeInTheDocument();
});
import React from 'react';
import { renderWithProviders, screen } from '../../../test/utils';
import { PermissionCard } from '../PermissionCard';

test('PermissionCard renders name', () => {
	const data = { _id: '1', name: 'perm', actions: ['a'], __v: 0 };
	renderWithProviders(<PermissionCard data={data} />);
	expect(screen.getByText('perm')).toBeInTheDocument();
});

import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { GenericForm as Form } from '../Form'
import { FieldConfigWithOptions } from '../types'
import { renderWithProviders } from '../../../test/utils'

/**
 * Tests for potential state management issues in Form component
 * Focus: Prevent infinite loops, unnecessary re-renders, and state update cycles
 */
describe('Form State Management Issues', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should not cause infinite loop when fields array reference changes', async () => {
		const mockOnSubmit = vi.fn()
		let renderCount = 0

		const TestWrapper = () => {
			renderCount++
			// Create new fields array on every render (common pattern)
			const fields: FieldConfigWithOptions[] = [
				{ name: 'username', label: 'Username', type: 'text' },
			]

			return <Form fields={fields} onSubmit={mockOnSubmit} submitButtonText="Submit" />
		}

		const { rerender } = renderWithProviders(<TestWrapper />)

		await waitFor(() => {
			expect(screen.getByLabelText('Username')).toBeInTheDocument()
		})

		const initialRenderCount = renderCount

		// Force a rerender
		rerender(<TestWrapper />)

		await waitFor(() => {
			expect(screen.getByLabelText('Username')).toBeInTheDocument()
		})

		// Should have rendered a reasonable number of times (not 100+)
		expect(renderCount).toBeLessThan(initialRenderCount + 10)
	})

	it('should not reset form data when fields array reference changes', async () => {
		const mockOnSubmit = vi.fn()

		const TestWrapper = ({ count }: { count: number }) => {
			// New fields array on every render
			const fields: FieldConfigWithOptions[] = [
				{ name: 'username', label: 'Username', type: 'text' },
			]

			return <Form fields={fields} onSubmit={mockOnSubmit} submitButtonText="Submit" />
		}

		const { rerender } = renderWithProviders(<TestWrapper count={1} />)

		await waitFor(() => {
			expect(screen.getByLabelText('Username')).toBeInTheDocument()
		})

		// User types something
		const input = screen.getByLabelText('Username') as HTMLInputElement
		fireEvent.change(input, { target: { value: 'test_user' } })

		// Parent rerenders with new fields array reference
		rerender(<TestWrapper count={2} />)

		await waitFor(() => {
			const newInput = screen.getByLabelText('Username') as HTMLInputElement
			// Value should be preserved
			expect(newInput.value).toBe('test_user')
		})
	})

	it('should handle initialValues updates without losing user input', async () => {
		const mockOnSubmit = vi.fn()
		const fields: FieldConfigWithOptions[] = [
			{ name: 'username', label: 'Username', type: 'text' },
		]

		const { rerender } = renderWithProviders(
			<Form fields={fields} initialValues={{}} onSubmit={mockOnSubmit} submitButtonText="Submit" />
		)

		await waitFor(() => {
			expect(screen.getByLabelText('Username')).toBeInTheDocument()
		})

		const input = screen.getByLabelText('Username') as HTMLInputElement
		fireEvent.change(input, { target: { value: 'user_typed_value' } })

		// Parent updates initialValues (common in async data loading)
		rerender(
			<Form
				fields={fields}
				initialValues={{ username: 'server_value' }}
				onSubmit={mockOnSubmit}
				submitButtonText="Submit"
			/>
		)

		await waitFor(() => {
			const updatedInput = screen.getByLabelText('Username') as HTMLInputElement
			// Should update to new initial value
			expect(updatedInput.value).toBe('server_value')
		})
	})

	it('should not cause infinite fetches with dynamic select fields', async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			json: async () => [
				{ _id: '1', name: 'Option 1' },
				{ _id: '2', name: 'Option 2' },
			],
		})
		global.fetch = mockFetch

		const fields: FieldConfigWithOptions[] = [
			{
				name: 'category',
				label: 'Category',
				type: 'select',
				apiEndpoint: '/api/categories',
			},
		]

		const mockOnSubmit = vi.fn()

		renderWithProviders(<Form fields={fields} onSubmit={mockOnSubmit} submitButtonText="Submit" />)

		// Wait for initial render
		await waitFor(() => {
			expect(screen.getByRole('combobox')).toBeInTheDocument()
		})

		// Wait a bit to see if multiple fetches happen
		await new Promise((resolve) => setTimeout(resolve, 100))

		// Should only fetch once, not continuously
		expect(mockFetch).toHaveBeenCalledTimes(1)
	})

	it('should handle multiple fields with defaultValue without state conflicts', async () => {
		const mockOnSubmit = vi.fn()
		const fields: FieldConfigWithOptions[] = [
			{ name: 'field1', label: 'Field 1', type: 'text', defaultValue: 'default1' },
			{ name: 'field2', label: 'Field 2', type: 'text', defaultValue: 'default2' },
			{ name: 'field3', label: 'Field 3', type: 'text', defaultValue: 'default3' },
		]

		renderWithProviders(<Form fields={fields} onSubmit={mockOnSubmit} submitButtonText="Submit" />)

		await waitFor(() => {
			expect(screen.getByLabelText('Field 1')).toBeInTheDocument()
		})

		const input1 = screen.getByLabelText('Field 1') as HTMLInputElement
		const input2 = screen.getByLabelText('Field 2') as HTMLInputElement
		const input3 = screen.getByLabelText('Field 3') as HTMLInputElement

		// All should have their default values
		expect(input1.value).toBe('default1')
		expect(input2.value).toBe('default2')
		expect(input3.value).toBe('default3')
	})

	it('should not lose state when fields are reordered', async () => {
		const mockOnSubmit = vi.fn()

		const TestWrapper = ({ reverse }: { reverse: boolean }) => {
			const fields: FieldConfigWithOptions[] = reverse
				? [
					{ name: 'email', label: 'Email', type: 'email' },
					{ name: 'username', label: 'Username', type: 'text' },
				]
				: [
					{ name: 'username', label: 'Username', type: 'text' },
					{ name: 'email', label: 'Email', type: 'email' },
				]

			return <Form fields={fields} onSubmit={mockOnSubmit} submitButtonText="Submit" />
		}

		const { rerender } = renderWithProviders(<TestWrapper reverse={false} />)

		await waitFor(() => {
			expect(screen.getByLabelText('Username')).toBeInTheDocument()
		})

		const usernameInput = screen.getByLabelText('Username') as HTMLInputElement
		const emailInput = screen.getByLabelText('Email') as HTMLInputElement

		fireEvent.change(usernameInput, { target: { value: 'john' } })
		fireEvent.change(emailInput, { target: { value: 'john@example.com' } })

		// Reorder fields
		rerender(<TestWrapper reverse={true} />)

		await waitFor(() => {
			const newUsernameInput = screen.getByLabelText('Username') as HTMLInputElement
			const newEmailInput = screen.getByLabelText('Email') as HTMLInputElement

			// Values should be preserved despite reordering
			expect(newUsernameInput.value).toBe('john')
			expect(newEmailInput.value).toBe('john@example.com')
		})
	})

	it('should handle rapid prop changes without breaking', async () => {
		const mockOnSubmit = vi.fn()
		const fields: FieldConfigWithOptions[] = [
			{ name: 'username', label: 'Username', type: 'text' },
		]

		const { rerender } = renderWithProviders(
			<Form fields={fields} initialValues={{}} onSubmit={mockOnSubmit} submitButtonText="Submit" />
		)

		// Simulate rapid prop updates
		for (let i = 0; i < 5; i++) {
			rerender(
				<Form
					fields={fields}
					initialValues={{ username: `value${i}` }}
					onSubmit={mockOnSubmit}
					submitButtonText="Submit"
				/>
			)
		}

		await waitFor(() => {
			const input = screen.getByLabelText('Username') as HTMLInputElement
			expect(input.value).toBe('value4')
		})
	})

	it('should not accumulate state updates', async () => {
		const mockOnSubmit = vi.fn()
		let stateUpdateCount = 0

		const fields: FieldConfigWithOptions[] = [
			{
				name: 'monitored',
				label: 'Monitored Field',
				type: 'text',
				onChange: () => {
					stateUpdateCount++
				},
			},
		]

		renderWithProviders(<Form fields={fields} onSubmit={mockOnSubmit} submitButtonText="Submit" />)

		await waitFor(() => {
			expect(screen.getByLabelText('Monitored Field')).toBeInTheDocument()
		})

		const input = screen.getByLabelText('Monitored Field') as HTMLInputElement

		// Type one character
		input.value = 'a'
		input.dispatchEvent(new Event('input', { bubbles: true }))

		await new Promise((resolve) => setTimeout(resolve, 100))

		// Should have called onChange once, not multiple times
		expect(stateUpdateCount).toBeLessThanOrEqual(2) // Allow for 1 initial + 1 update
	})
})

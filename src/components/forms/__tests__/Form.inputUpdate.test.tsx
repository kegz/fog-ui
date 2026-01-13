import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { GenericForm as Form } from '../Form'
import { FieldConfigWithOptions } from '../types'
import { renderWithProviders } from '../../../test/utils'

/**
 * Tests to verify that form inputs properly accept and display user input
 * This addresses the issue where text entered into a field was not updating the input value
 */
describe('Form Input Value Updates', () => {
	it('should update text input value', () => {
		const mockOnSubmit = vi.fn()
		const fields: FieldConfigWithOptions[] = [
			{ name: 'username', label: 'Username', type: 'text' },
		]

		renderWithProviders(
			<Form fields={fields} onSubmit={mockOnSubmit} submitButtonText="Submit" />
		)

		const input = screen.getByLabelText('Username') as HTMLInputElement
		expect(input.value).toBe('')

		fireEvent.change(input, { target: { value: 'john_doe' } })
		expect(input.value).toBe('john_doe')
	})

	it('should update email input value', () => {
		const mockOnSubmit = vi.fn()
		const fields: FieldConfigWithOptions[] = [
			{ name: 'email', label: 'Email', type: 'email' },
		]

		renderWithProviders(
			<Form fields={fields} onSubmit={mockOnSubmit} submitButtonText="Submit" />
		)

		const input = screen.getByLabelText('Email') as HTMLInputElement
		expect(input.value).toBe('')

		fireEvent.change(input, { target: { value: 'test@example.com' } })
		expect(input.value).toBe('test@example.com')
	})

	it('should update password input value', () => {
		const mockOnSubmit = vi.fn()
		const fields: FieldConfigWithOptions[] = [
			{ name: 'password', label: 'Password', type: 'password' },
		]

		renderWithProviders(
			<Form fields={fields} onSubmit={mockOnSubmit} submitButtonText="Submit" />
		)

		const input = screen.getByLabelText('Password') as HTMLInputElement
		expect(input.value).toBe('')

		fireEvent.change(input, { target: { value: 'secret123' } })
		expect(input.value).toBe('secret123')
	})

	it('should update number input value', () => {
		const mockOnSubmit = vi.fn()
		const fields: FieldConfigWithOptions[] = [
			{ name: 'age', label: 'Age', type: 'number' },
		]

		renderWithProviders(
			<Form fields={fields} onSubmit={mockOnSubmit} submitButtonText="Submit" />
		)

		const input = screen.getByLabelText('Age') as HTMLInputElement
		expect(input.value).toBe('')

		fireEvent.change(input, { target: { value: '25' } })
		expect(input.value).toBe('25')
	})

	it('should update textarea value', () => {
		const mockOnSubmit = vi.fn()
		const fields: FieldConfigWithOptions[] = [
			{ name: 'description', label: 'Description', type: 'textarea' },
		]

		renderWithProviders(
			<Form fields={fields} onSubmit={mockOnSubmit} submitButtonText="Submit" />
		)

		const textarea = screen.getByLabelText('Description') as HTMLTextAreaElement
		expect(textarea.value).toBe('')

		fireEvent.change(textarea, { target: { value: 'A long description' } })
		expect(textarea.value).toBe('A long description')
	})

	it('should update multiple inputs independently', () => {
		const mockOnSubmit = vi.fn()
		const fields: FieldConfigWithOptions[] = [
			{ name: 'firstName', label: 'First Name', type: 'text' },
			{ name: 'lastName', label: 'Last Name', type: 'text' },
		]

		renderWithProviders(
			<Form fields={fields} onSubmit={mockOnSubmit} submitButtonText="Submit" />
		)

		const firstNameInput = screen.getByLabelText('First Name') as HTMLInputElement
		const lastNameInput = screen.getByLabelText('Last Name') as HTMLInputElement

		fireEvent.change(firstNameInput, { target: { value: 'John' } })
		expect(firstNameInput.value).toBe('John')
		expect(lastNameInput.value).toBe('')

		fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
		expect(firstNameInput.value).toBe('John')
		expect(lastNameInput.value).toBe('Doe')
	})

	it('should handle initial values and allow updates', () => {
		const mockOnSubmit = vi.fn()
		const fields: FieldConfigWithOptions[] = [
			{ name: 'username', label: 'Username', type: 'text' },
		]

		renderWithProviders(
			<Form
				fields={fields}
				initialValues={{ username: 'initial_user' }}
				onSubmit={mockOnSubmit}
				submitButtonText="Submit"
			/>
		)

		const input = screen.getByLabelText('Username') as HTMLInputElement
		expect(input.value).toBe('initial_user')

		fireEvent.change(input, { target: { value: 'new_user' } })
		expect(input.value).toBe('new_user')
	})

	it('should submit form with entered values', () => {
		const mockOnSubmit = vi.fn()
		const fields: FieldConfigWithOptions[] = [
			{ name: 'username', label: 'Username', type: 'text' },
			{ name: 'email', label: 'Email', type: 'email' },
		]

		renderWithProviders(
			<Form fields={fields} onSubmit={mockOnSubmit} submitButtonText="Submit" />
		)

		const usernameInput = screen.getByLabelText('Username')
		const emailInput = screen.getByLabelText('Email')

		fireEvent.change(usernameInput, { target: { value: 'testuser' } })
		fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

		const submitButton = screen.getByRole('button', { name: /submit/i })
		fireEvent.click(submitButton)

		expect(mockOnSubmit).toHaveBeenCalledWith({
			username: 'testuser',
			email: 'test@example.com',
		})
	})

	it('should update switch input value', () => {
		const mockOnSubmit = vi.fn()
		const fields: FieldConfigWithOptions[] = [
			{ name: 'subscribe', label: 'Subscribe', type: 'switch' },
		]

		renderWithProviders(
			<Form fields={fields} onSubmit={mockOnSubmit} submitButtonText="Submit" />
		)

		const switchInput = screen.getByRole('switch') as HTMLInputElement
		expect(switchInput.checked).toBe(false)

		fireEvent.click(switchInput)
		expect(switchInput.checked).toBe(true)

		fireEvent.click(switchInput)
		expect(switchInput.checked).toBe(false)
	})
})

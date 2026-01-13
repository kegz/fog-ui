import React, { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FieldConfigWithOptions } from '../types'

/**
 * Example test demonstrating state management patterns for consumer apps
 * These tests show best practices for testing components with mocked data updates
 */
describe('Consumer App State Management Patterns', () => {
	it('should initialize component with default state', () => {
		const TestComponent = () => {
			const [data, setData] = useState('initial')
			return <div data-testid="test">{data}</div>
		}

		render(<TestComponent />)
		expect(screen.getByTestId('test')).toHaveTextContent('initial')
	})

	it('should update component state on user interaction', () => {
		const TestComponent = () => {
			const [count, setCount] = useState(0)
			return (
				<div>
					<div data-testid="count">{count}</div>
					<button onClick={() => setCount(count + 1)}>Increment</button>
				</div>
			)
		}

		render(<TestComponent />)

		expect(screen.getByTestId('count')).toHaveTextContent('0')

		fireEvent.click(screen.getByRole('button', { name: /increment/i }))
		expect(screen.getByTestId('count')).toHaveTextContent('1')
	})

	it('should handle parent component data updates', () => {
		const ParentComponent = ({ initialData }: { initialData: string }) => {
			// Use effect to sync prop to state
			const [data, setData] = React.useState(initialData)

			React.useEffect(() => {
				setData(initialData)
			}, [initialData])

			return (
				<div>
					<div data-testid="data">{data}</div>
					<button onClick={() => setData('updated')}>Update</button>
				</div>
			)
		}

		const { rerender } = render(<ParentComponent initialData="initial" />)

		expect(screen.getByTestId('data')).toHaveTextContent('initial')

		rerender(<ParentComponent initialData="changed" />)

		// After prop change, component should update
		expect(screen.getByTestId('data')).toHaveTextContent('changed')
	})

	it('should manage async data loading state', async () => {
		const AsyncComponent = () => {
			const [loading, setLoading] = useState(false)
			const [data, setData] = useState('')

			const fetchData = async () => {
				setLoading(true)
				await new Promise((resolve) => setTimeout(resolve, 50))
				setData('fetched data')
				setLoading(false)
			}

			return (
				<div>
					<button onClick={fetchData}>Fetch</button>
					<div data-testid="status">{loading ? 'Loading...' : 'Ready'}</div>
					<div data-testid="data">{data}</div>
				</div>
			)
		}

		render(<AsyncComponent />)

		expect(screen.getByTestId('status')).toHaveTextContent('Ready')

		fireEvent.click(screen.getByRole('button', { name: /fetch/i }))

		// Should show loading state
		await waitFor(() => {
			expect(screen.getByTestId('status')).toHaveTextContent('Loading...')
		})

		// Should show fetched data
		await waitFor(() => {
			expect(screen.getByTestId('data')).toHaveTextContent('fetched data')
		})
	})

	it('should handle complex state updates with multiple dependencies', () => {
		const ComplexComponent = () => {
			const [form, setForm] = useState({ username: '', email: '' })
			const [isValid, setIsValid] = useState(false)

			const handleChange = (field: string, value: string) => {
				const updated = { ...form, [field]: value }
				setForm(updated)
				// Validate: both fields must be filled
				setIsValid(updated.username.length > 0 && updated.email.length > 0)
			}

			return (
				<div>
					<input
						data-testid="username"
						value={form.username}
						onChange={(e) => handleChange('username', e.target.value)}
					/>
					<input
						data-testid="email"
						value={form.email}
						onChange={(e) => handleChange('email', e.target.value)}
					/>
					<div data-testid="valid">{isValid ? 'Valid' : 'Invalid'}</div>
				</div>
			)
		}

		render(<ComplexComponent />)

		expect(screen.getByTestId('valid')).toHaveTextContent('Invalid')

		// Fill username
		fireEvent.change(screen.getByTestId('username'), { target: { value: 'john' } })
		expect(screen.getByTestId('valid')).toHaveTextContent('Invalid')

		// Fill email
		fireEvent.change(screen.getByTestId('email'), { target: { value: 'john@test.com' } })
		expect(screen.getByTestId('valid')).toHaveTextContent('Valid')
	})

	it('should propagate state changes to child components', () => {
		const ChildComponent = ({ data }: { data: string }) => (
			<div data-testid="child">{data}</div>
		)

		const ParentComponent = () => {
			const [data, setData] = useState('parent data')

			return (
				<div>
					<ChildComponent data={data} />
					<button onClick={() => setData('updated data')}>Update</button>
				</div>
			)
		}

		render(<ParentComponent />)

		expect(screen.getByTestId('child')).toHaveTextContent('parent data')

		fireEvent.click(screen.getByRole('button', { name: /update/i }))

		expect(screen.getByTestId('child')).toHaveTextContent('updated data')
	})

	it('should handle controlled form inputs', () => {
		const ControlledFormComponent = () => {
			const [values, setValues] = useState({ text: '', number: 0 })

			return (
				<form>
					<input
						data-testid="text-input"
						value={values.text}
						onChange={(e) => setValues({ ...values, text: e.target.value })}
					/>
					<input
						data-testid="number-input"
						type="number"
						value={values.number}
						onChange={(e) => setValues({ ...values, number: parseInt(e.target.value) || 0 })}
					/>
					<div data-testid="text-value">{values.text}</div>
					<div data-testid="number-value">{values.number}</div>
				</form>
			)
		}

		render(<ControlledFormComponent />)

		// Update text
		fireEvent.change(screen.getByTestId('text-input'), { target: { value: 'hello' } })
		expect(screen.getByTestId('text-value')).toHaveTextContent('hello')

		// Update number
		fireEvent.change(screen.getByTestId('number-input'), { target: { value: '42' } })
		expect(screen.getByTestId('number-value')).toHaveTextContent('42')
	})
})

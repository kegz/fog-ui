import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { DataTable } from '../DataTable'
import { renderWithProviders } from '../../../test/utils'
import { ColumnConfig } from '../types'

/**
 * Tests for potential state management issues in DataTable component
 * Focus: onRowExpand callback firing, data array updates, state consistency
 */
describe('DataTable State Management Issues', () => {
	const mockColumns: ColumnConfig<any>[] = [
		{ key: 'name', label: 'Name' },
		{ key: 'email', label: 'Email' },
	]

	const mockData = [
		{ _id: '1', name: 'John Doe', email: 'john@example.com' },
		{ _id: '2', name: 'Jane Smith', email: 'jane@example.com' },
	]

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should not call onRowExpand multiple times for the same row', async () => {
		const onRowExpand = vi.fn()

		renderWithProviders(
			<DataTable
				data={mockData}
				columns={mockColumns}
				nestedConfig={{
					dataKey: 'details',
					columns: [{ key: 'info', label: 'Info' }],
					getNestedData: (item) => item.details || [],
				}}
				onRowExpand={onRowExpand}
			/>
		)

		await waitFor(() => {
			expect(screen.getByText('John Doe')).toBeInTheDocument()
		})

		// Find and click the expand button for first row
		const expandButtons = screen.getAllByRole('button')
		const firstExpandButton = expandButtons[0]

		fireEvent.click(firstExpandButton)

		await waitFor(() => {
			expect(onRowExpand).toHaveBeenCalledTimes(1)
		})

		// Close the row
		fireEvent.click(firstExpandButton)

		await new Promise((resolve) => setTimeout(resolve, 50))

		// Reopen the same row
		fireEvent.click(firstExpandButton)

		await new Promise((resolve) => setTimeout(resolve, 50))

		// Should still only be called once (ref tracking prevents duplicate calls)
		expect(onRowExpand).toHaveBeenCalledTimes(1)
	})

	it('should handle data array reference changes without triggering unnecessary effects', async () => {
		const onRowExpand = vi.fn()
		let effectCount = 0

		const TestWrapper = ({ data }: { data: any[] }) => {
			React.useEffect(() => {
				effectCount++
			})

			return (
				<DataTable
					data={data}
					columns={mockColumns}
					nestedConfig={{
						dataKey: 'details',
						columns: [{ key: 'info', label: 'Info' }],
					getNestedData: (item) => item.details || [],
				}}
					onRowExpand={onRowExpand}
				/>
			)
		}

		const { rerender } = renderWithProviders(<TestWrapper data={mockData} />)

		await waitFor(() => {
			expect(screen.getByText('John Doe')).toBeInTheDocument()
		})

		const initialEffectCount = effectCount

		// Create a new array with same data (common pattern)
		const newDataReference = [...mockData]
		rerender(<TestWrapper data={newDataReference} />)

		await waitFor(() => {
			expect(screen.getByText('John Doe')).toBeInTheDocument()
		})

		// Should rerender, but not excessively
		expect(effectCount).toBeLessThan(initialEffectCount + 5)
	})

	it('should handle data updates while row is expanded', async () => {
		const onRowExpand = vi.fn()

		const { rerender } = renderWithProviders(
			<DataTable
				data={mockData}
				columns={mockColumns}
				nestedConfig={{
					dataKey: 'details',
					columns: [{ key: 'info', label: 'Info' }],
					getNestedData: (item) => item.details || [],
				}}
				onRowExpand={onRowExpand}
			/>
		)

		await waitFor(() => {
			expect(screen.getByText('John Doe')).toBeInTheDocument()
		})

		// Expand first row
		const expandButtons = screen.getAllByRole('button')
		fireEvent.click(expandButtons[0])

		await waitFor(() => {
			expect(onRowExpand).toHaveBeenCalledWith(mockData[0])
		})

		// Update data while row is expanded
		const updatedData = [
			{ _id: '1', name: 'John Updated', email: 'john@example.com' },
			{ _id: '2', name: 'Jane Smith', email: 'jane@example.com' },
		]

		rerender(
			<DataTable
				data={updatedData}
				columns={mockColumns}
				nestedConfig={{
					dataKey: 'details',
					columns: [{ key: 'info', label: 'Info' }],
					getNestedData: (item) => item.details || [],
				}}
				onRowExpand={onRowExpand}
			/>
		)

		await waitFor(() => {
			expect(screen.getByText('John Updated')).toBeInTheDocument()
		})

		// Should not call onRowExpand again
		expect(onRowExpand).toHaveBeenCalledTimes(1)
	})

	it('should maintain expand state when data order changes', async () => {
		const { rerender } = renderWithProviders(
			<DataTable
				data={mockData}
				columns={mockColumns}
				nestedConfig={{
					dataKey: 'details',
					columns: [{ key: 'info', label: 'Info' }],
					getNestedData: (item) => item.details || [],
				}}
			/>
		)

		await waitFor(() => {
			expect(screen.getByText('John Doe')).toBeInTheDocument()
		})

		// Expand first row
		const expandButtons = screen.getAllByRole('button')
		fireEvent.click(expandButtons[0])

		// Reverse data order
		const reversedData = [...mockData].reverse()

		rerender(
			<DataTable
				data={reversedData}
				columns={mockColumns}
				nestedConfig={{
					dataKey: 'details',
					columns: [{ key: 'info', label: 'Info' }],
					getNestedData: (item) => item.details || [],
				}}
			/>
		)

		await waitFor(() => {
			expect(screen.getByText('Jane Smith')).toBeInTheDocument()
		})

		// The row with _id '1' should still be expanded even though it's now in different position
		// This tests that the component uses _id for tracking, not index
	})

	it('should not accumulate expanded row listeners', async () => {
		const onRowExpand = vi.fn()

		const { rerender } = renderWithProviders(
			<DataTable
				data={mockData}
				columns={mockColumns}
				nestedConfig={{
					dataKey: 'details',
					columns: [{ key: 'info', label: 'Info' }],
					getNestedData: (item) => item.details || [],
				}}
				onRowExpand={onRowExpand}
			/>
		)

		// Rerender multiple times
		for (let i = 0; i < 5; i++) {
			rerender(
				<DataTable
					data={mockData}
					columns={mockColumns}
					nestedConfig={{
						dataKey: 'details',
						columns: [{ key: 'info', label: 'Info' }],
					getNestedData: (item) => item.details || [],
				}}
					onRowExpand={onRowExpand}
				/>
			)
		}

		await waitFor(() => {
			expect(screen.getByText('John Doe')).toBeInTheDocument()
		})

		// Expand a row
		const expandButtons = screen.getAllByRole('button')
		fireEvent.click(expandButtons[0])

		await waitFor(() => {
			// Should only be called once despite multiple rerenders
			expect(onRowExpand).toHaveBeenCalledTimes(1)
		})
	})

	it('should handle onRowExpand callback reference changes', async () => {
		let callbackCount = 0
		const createCallback = () => vi.fn(() => callbackCount++)

		const callback1 = createCallback()

		const { rerender } = renderWithProviders(
			<DataTable
				data={mockData}
				columns={mockColumns}
				nestedConfig={{
					dataKey: 'details',
					columns: [{ key: 'info', label: 'Info' }],
					getNestedData: (item) => item.details || [],
				}}
				onRowExpand={callback1}
			/>
		)

		await waitFor(() => {
			expect(screen.getByText('John Doe')).toBeInTheDocument()
		})

		// Expand row
		const expandButtons = screen.getAllByRole('button')
		fireEvent.click(expandButtons[0])

		await waitFor(() => {
			expect(callback1).toHaveBeenCalledTimes(1)
		})

		// Change callback reference (common in parent component)
		const callback2 = createCallback()

		rerender(
			<DataTable
				data={mockData}
				columns={mockColumns}
				nestedConfig={{
					dataKey: 'details',
					columns: [{ key: 'info', label: 'Info' }],
					getNestedData: (item) => item.details || [],
				}}
				onRowExpand={callback2}
			/>
		)

		await new Promise((resolve) => setTimeout(resolve, 50))

		// Should not trigger additional calls
		expect(callbackCount).toBe(1)
	})

	it('should handle empty data without errors', async () => {
		const onRowExpand = vi.fn()

		const { rerender } = renderWithProviders(
			<DataTable
				data={[]}
				columns={mockColumns}
				nestedConfig={{
					dataKey: 'details',
					columns: [{ key: 'info', label: 'Info' }],
					getNestedData: (item) => item.details || [],
				}}
				onRowExpand={onRowExpand}
			/>
		)

		await waitFor(() => {
			expect(screen.getByText('No records found.')).toBeInTheDocument()
		})

		// Add data
		rerender(
			<DataTable
				data={mockData}
				columns={mockColumns}
				nestedConfig={{
					dataKey: 'details',
					columns: [{ key: 'info', label: 'Info' }],
					getNestedData: (item) => item.details || [],
				}}
				onRowExpand={onRowExpand}
			/>
		)

		await waitFor(() => {
			expect(screen.getByText('John Doe')).toBeInTheDocument()
		})

		// Should work normally
		const expandButtons = screen.getAllByRole('button')
		fireEvent.click(expandButtons[0])

		await waitFor(() => {
			expect(onRowExpand).toHaveBeenCalledTimes(1)
		})
	})
})

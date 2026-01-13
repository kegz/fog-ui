import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { PageWrapper } from '../PageWrapper'
import { renderWithProviders } from '../../../test/utils'

/**
 * Tests for potential state management issues in PageWrapper component
 * Focus: localStorage sync, storage events, memory leaks
 */
describe('PageWrapper State Management Issues', () => {
	const mockMenuItems = {
		main: [
			{ label: 'Dashboard', path: '/dashboard' },
			{ label: 'Projects', path: '/projects' },
		],
	}

	beforeEach(() => {
		// Clear localStorage before each test
		localStorage.clear()
		vi.clearAllMocks()
	})

	afterEach(() => {
		// Clean up any lingering event listeners
		localStorage.clear()
	})

	it('should sync pageTitle with localStorage', async () => {
		localStorage.setItem('pageTitle', 'Initial Title')

		renderWithProviders(
			<PageWrapper menuItems={mockMenuItems}>
				<div>Content</div>
			</PageWrapper>
		)

		await waitFor(() => {
			expect(screen.getByText('Initial Title')).toBeInTheDocument()
		})
	})

	it('should handle localStorage updates from other tabs', async () => {
		renderWithProviders(
			<PageWrapper menuItems={mockMenuItems}>
				<div>Content</div>
			</PageWrapper>
		)

		await waitFor(() => {
			expect(screen.getByText('Projects Overview')).toBeInTheDocument()
		})

		// Simulate storage event from another tab
		const storageEvent = new StorageEvent('storage', {
			key: 'pageTitle',
			newValue: 'Updated from Another Tab',
			oldValue: 'Projects Overview',
			storageArea: localStorage,
		})

		window.dispatchEvent(storageEvent)

		await waitFor(() => {
			expect(screen.getByText('Updated from Another Tab')).toBeInTheDocument()
		})
	})

	it('should not cause memory leaks with multiple mounts/unmounts', async () => {
		const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
		const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

		const { unmount, rerender } = renderWithProviders(
			<PageWrapper menuItems={mockMenuItems}>
				<div>Content 1</div>
			</PageWrapper>
		)

		await waitFor(() => {
			expect(screen.getByText('Content 1')).toBeInTheDocument()
		})

		const initialAddCount = addEventListenerSpy.mock.calls.filter(
			([event]) => event === 'storage'
		).length

		// Remount multiple times
		for (let i = 0; i < 3; i++) {
			rerender(
				<PageWrapper menuItems={mockMenuItems}>
					<div>Content {i + 2}</div>
				</PageWrapper>
			)
			await new Promise((resolve) => setTimeout(resolve, 10))
		}

		unmount()

		const addCount = addEventListenerSpy.mock.calls.filter(([event]) => event === 'storage').length
		const removeCount = removeEventListenerSpy.mock.calls.filter(
			([event]) => event === 'storage'
		).length

		// Should clean up all listeners
		expect(removeCount).toBeGreaterThanOrEqual(addCount - initialAddCount)

		addEventListenerSpy.mockRestore()
		removeEventListenerSpy.mockRestore()
	})

	it('should ignore storage events for non-pageTitle keys', async () => {
		renderWithProviders(
			<PageWrapper menuItems={mockMenuItems}>
				<div>Content</div>
			</PageWrapper>
		)

		await waitFor(() => {
			expect(screen.getByText('Projects Overview')).toBeInTheDocument()
		})

		// Simulate storage event for different key
		const storageEvent = new StorageEvent('storage', {
			key: 'otherKey',
			newValue: 'Some Value',
			oldValue: null,
			storageArea: localStorage,
		})

		window.dispatchEvent(storageEvent)

		await new Promise((resolve) => setTimeout(resolve, 50))

		// Title should remain unchanged
		expect(screen.getByText('Projects Overview')).toBeInTheDocument()
		expect(screen.queryByText('Some Value')).not.toBeInTheDocument()
	})

	it('should handle null or undefined storage values', async () => {
		renderWithProviders(
			<PageWrapper menuItems={mockMenuItems}>
				<div>Content</div>
			</PageWrapper>
		)

		await waitFor(() => {
			expect(screen.getByText('Projects Overview')).toBeInTheDocument()
		})

		// Simulate storage event with null newValue
		const storageEvent = new StorageEvent('storage', {
			key: 'pageTitle',
			newValue: null,
			oldValue: 'Projects Overview',
			storageArea: localStorage,
		})

		window.dispatchEvent(storageEvent)

		await new Promise((resolve) => setTimeout(resolve, 50))

		// Should not crash and maintain current title
		expect(screen.getByText('Projects Overview')).toBeInTheDocument()
	})

	it('should not cause infinite updates when setting pageTitle', async () => {
		let updateCount = 0
		const originalSetItem = localStorage.setItem
		localStorage.setItem = vi.fn((...args) => {
			updateCount++
			return originalSetItem.apply(localStorage, args)
		})

		renderWithProviders(
			<PageWrapper menuItems={mockMenuItems}>
				<div>Content</div>
			</PageWrapper>
		)

		await waitFor(() => {
			expect(screen.getByText('Projects Overview')).toBeInTheDocument()
		})

		const initialUpdateCount = updateCount

		// Wait to see if updates keep happening
		await new Promise((resolve) => setTimeout(resolve, 200))

		// Should not have continuous updates
		expect(updateCount).toBeLessThan(initialUpdateCount + 5)

		localStorage.setItem = originalSetItem
	})

	it('should handle rapid navigation clicks without state conflicts', async () => {
		renderWithProviders(
			<PageWrapper menuItems={mockMenuItems}>
				<div>Content</div>
			</PageWrapper>
		)

		await waitFor(() => {
			expect(screen.getByText('Dashboard')).toBeInTheDocument()
		})

		const dashboardLink = screen.getByText('Dashboard')
		const projectsLink = screen.getByText('Projects')

		// Rapid clicks
		for (let i = 0; i < 5; i++) {
			dashboardLink.click()
			await new Promise((resolve) => setTimeout(resolve, 10))
			projectsLink.click()
			await new Promise((resolve) => setTimeout(resolve, 10))
		}

		// Should handle without errors
		expect(screen.getAllByText('Projects').length).toBeGreaterThan(0)
	})

	it('should handle concurrent storage updates', async () => {
		renderWithProviders(
			<PageWrapper menuItems={mockMenuItems}>
				<div>Content</div>
			</PageWrapper>
		)

		await waitFor(() => {
			expect(screen.getByText('Projects Overview')).toBeInTheDocument()
		})

		// Dispatch multiple storage events rapidly
		for (let i = 0; i < 5; i++) {
			const storageEvent = new StorageEvent('storage', {
				key: 'pageTitle',
				newValue: `Title ${i}`,
				oldValue: i > 0 ? `Title ${i - 1}` : 'Projects Overview',
				storageArea: localStorage,
			})
			window.dispatchEvent(storageEvent)
		}

		await waitFor(() => {
			expect(screen.getByText('Title 4')).toBeInTheDocument()
		})
	})
})

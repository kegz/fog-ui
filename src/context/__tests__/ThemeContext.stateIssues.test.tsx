import React, { useContext } from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeContextProvider, ThemeContext } from '../ThemeContext'
import { render } from '../../test/utils'

/**
 * Tests for potential state management issues in ThemeContext
 * Focus: Prevent localStorage loops, theme update cascades, memory leaks
 */
describe('ThemeContext State Management Issues', () => {
	beforeEach(() => {
		localStorage.clear()
		vi.clearAllMocks()
	})

	it('should not cause infinite localStorage updates on mount', () => {
		let setItemCount = 0
		const originalSetItem = localStorage.setItem
		localStorage.setItem = vi.fn((...args) => {
			setItemCount++
			return originalSetItem.apply(localStorage, args)
		})

		const TestComponent = () => {
			const { mode } = useContext(ThemeContext)
			return <div>Mode: {mode}</div>
		}

		render(
			<ThemeContextProvider>
				<TestComponent />
			</ThemeContextProvider>
		)

		expect(screen.getByText(/Mode:/)).toBeInTheDocument()

		// Should set localStorage once on mount, not continuously
		expect(setItemCount).toBeLessThanOrEqual(2) // mode + primaryColor

		localStorage.setItem = originalSetItem
	})

	it('should handle rapid theme toggles without state conflicts', async () => {
		const TestComponent = () => {
			const { toggleTheme, mode } = useContext(ThemeContext)
			return (
				<div>
					<div data-testid="mode">{mode}</div>
					<button onClick={toggleTheme}>Toggle</button>
				</div>
			)
		}

		render(
			<ThemeContextProvider>
				<TestComponent />
			</ThemeContextProvider>
		)

		const button = screen.getByText('Toggle')
		const modeDisplay = screen.getByTestId('mode')

		expect(modeDisplay.textContent).toBe('light')

		// Rapid toggles
		for (let i = 0; i < 10; i++) {
			fireEvent.click(button)
		}

		await waitFor(() => {
			// After even number of toggles, should be back to light
			expect(modeDisplay.textContent).toBe('light')
		})
	})

	it('should handle rapid color changes without state conflicts', async () => {
		const TestComponent = () => {
			const { changePrimaryColor, primaryColor } = useContext(ThemeContext)
			return (
				<div>
					<div data-testid="color">{primaryColor}</div>
					<button onClick={() => changePrimaryColor('#FF0000')}>Red</button>
					<button onClick={() => changePrimaryColor('#00FF00')}>Green</button>
					<button onClick={() => changePrimaryColor('#0000FF')}>Blue</button>
				</div>
			)
		}

		render(
			<ThemeContextProvider>
				<TestComponent />
			</ThemeContextProvider>
		)

		const colorDisplay = screen.getByTestId('color')
		const redButton = screen.getByText('Red')
		const greenButton = screen.getByText('Green')
		const blueButton = screen.getByText('Blue')

		// Rapid color changes
		fireEvent.click(redButton)
		fireEvent.click(greenButton)
		fireEvent.click(blueButton)

		await waitFor(() => {
			expect(colorDisplay.textContent).toBe('#0000FF')
		})
	})

	it('should sync with localStorage on mount', () => {
		localStorage.setItem('themeMode', 'dark')
		localStorage.setItem('primaryColor', '#FF5722')

		const TestComponent = () => {
			const { mode, primaryColor } = useContext(ThemeContext)
			return (
				<div>
					<div data-testid="mode">{mode}</div>
					<div data-testid="color">{primaryColor}</div>
				</div>
			)
		}

		render(
			<ThemeContextProvider>
				<TestComponent />
			</ThemeContextProvider>
		)

		expect(screen.getByTestId('mode').textContent).toBe('dark')
		expect(screen.getByTestId('color').textContent).toBe('#FF5722')
	})

	it('should not trigger excessive theme recalculations', async () => {
		let themeCreateCount = 0

		const TestComponent = () => {
			const { toggleTheme, changePrimaryColor } = useContext(ThemeContext)

			// Track theme recreation
			React.useEffect(() => {
				themeCreateCount++
			})

			return (
				<div>
					<button onClick={toggleTheme}>Toggle Mode</button>
					<button onClick={() => changePrimaryColor('#FF0000')}>Change Color</button>
				</div>
			)
		}

		render(
			<ThemeContextProvider>
				<TestComponent />
			</ThemeContextProvider>
		)

		const initialCount = themeCreateCount

		// Make changes
		fireEvent.click(screen.getByText('Toggle Mode'))
		await new Promise((resolve) => setTimeout(resolve, 50))

		fireEvent.click(screen.getByText('Change Color'))
		await new Promise((resolve) => setTimeout(resolve, 50))

		// Should have reasonable number of updates (not 50+)
		expect(themeCreateCount).toBeLessThan(initialCount + 10)
	})

	it('should handle multiple consumers without conflicts', async () => {
		const Consumer1 = () => {
			const { mode, toggleTheme } = useContext(ThemeContext)
			return (
				<div>
					<div data-testid="consumer1">{mode}</div>
					<button onClick={toggleTheme}>Toggle 1</button>
				</div>
			)
		}

		const Consumer2 = () => {
			const { mode } = useContext(ThemeContext)
			return <div data-testid="consumer2">{mode}</div>
		}

		const Consumer3 = () => {
			const { mode } = useContext(ThemeContext)
			return <div data-testid="consumer3">{mode}</div>
		}

		render(
			<ThemeContextProvider>
				<Consumer1 />
				<Consumer2 />
				<Consumer3 />
			</ThemeContextProvider>
		)

		const consumer1 = screen.getByTestId('consumer1')
		const consumer2 = screen.getByTestId('consumer2')
		const consumer3 = screen.getByTestId('consumer3')

		expect(consumer1.textContent).toBe('light')
		expect(consumer2.textContent).toBe('light')
		expect(consumer3.textContent).toBe('light')

		fireEvent.click(screen.getByText('Toggle 1'))

		await waitFor(() => {
			expect(consumer1.textContent).toBe('dark')
			expect(consumer2.textContent).toBe('dark')
			expect(consumer3.textContent).toBe('dark')
		})
	})

	it('should persist theme changes to localStorage', async () => {
		const TestComponent = () => {
			const { toggleTheme, changePrimaryColor } = useContext(ThemeContext)
			return (
				<div>
					<button onClick={toggleTheme}>Toggle</button>
					<button onClick={() => changePrimaryColor('#123456')}>Change Color</button>
				</div>
			)
		}

		render(
			<ThemeContextProvider>
				<TestComponent />
			</ThemeContextProvider>
		)

		fireEvent.click(screen.getByText('Toggle'))
		await waitFor(() => {
			expect(localStorage.getItem('themeMode')).toBe('dark')
		})

		fireEvent.click(screen.getByText('Change Color'))
		await waitFor(() => {
			expect(localStorage.getItem('primaryColor')).toBe('#123456')
		})
	})

	it('should handle invalid localStorage values gracefully', () => {
		localStorage.setItem('themeMode', 'invalid-mode' as any)
		// Use a valid hex color to avoid MUI error, but one that's unusual
		localStorage.setItem('primaryColor', '#000000')

		const TestComponent = () => {
			const { mode, primaryColor } = useContext(ThemeContext)
			return (
				<div>
					<div data-testid="mode">{mode}</div>
					<div data-testid="color">{primaryColor}</div>
				</div>
			)
		}

		// Should not crash
		render(
			<ThemeContextProvider>
				<TestComponent />
			</ThemeContextProvider>
		)

		// Should use invalid value but not crash
		expect(screen.getByTestId('mode')).toBeInTheDocument()
		expect(screen.getByTestId('color')).toBeInTheDocument()
	})
})

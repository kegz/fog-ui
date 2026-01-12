import React from 'react'
import { createRoot } from 'react-dom/client'
import { PageWrapper, Tabs } from 'fog-ui'

function App() {
	return (
		<div>
			<h1>Consumer Test</h1>
			<PageWrapper menuItems={{}}>
				<p>Test content</p>
			</PageWrapper>
		</div>
	)
}

createRoot(document.getElementById('root')!).render(<App />)

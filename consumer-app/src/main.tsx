import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { PageWrapper } from 'fog-ui'
import { Container, Typography, Paper } from '@mui/material'

function App() {
	return (
		<HashRouter>
			<PageWrapper menuItems={{}}>
				<Container maxWidth="lg" sx={{ py: 4 }}>
					<Typography variant="h3" component="h1" gutterBottom>
						Fog UI Component Test Suite
					</Typography>
					<Paper sx={{ p: 3 }}>
						<Typography variant="body1">
							✅ Setup is working! The consumer app is rendering successfully.
						</Typography>
					</Paper>
				</Container>
			</PageWrapper>
		</HashRouter>
	)
}

createRoot(document.getElementById('root')!).render(<App />)

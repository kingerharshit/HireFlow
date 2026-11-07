import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/globals.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { JobsProvider } from './context/JobsContext.jsx'
import { AppRoutes } from './routes/AppRoutes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <JobsProvider>
          <AppRoutes />
        </JobsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)

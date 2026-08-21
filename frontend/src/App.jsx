import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import ErrorBoundary from './components/ErrorBoundary'

const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </ErrorBoundary>
)

export default App

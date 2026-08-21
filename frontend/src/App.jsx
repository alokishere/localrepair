import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import ErrorBoundary from "./components/ErrorBoundary"
import { AuthProvider } from "./context/AuthContext"
import { ToastProvider } from "./context/ToastContext"

const App = () => (
  <ErrorBoundary>
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  </ErrorBoundary>
)

export default App

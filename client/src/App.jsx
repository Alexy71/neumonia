import AuthProvider from "./provider/authProvider";
import AppRouter from './router/AppRouter'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App

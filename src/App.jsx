import { useState } from 'react'
import Home from './pages/Home'
import AuthPage from './components/AuthPage'

const authStorageKey = 'smartspend-auth-user'

function getStoredUser() {
  try {
    const stored = localStorage.getItem(authStorageKey)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function App() {
  const [user, setUser] = useState(getStoredUser)

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem(authStorageKey)
    setUser(null)
  }

  if (!user) {
    return <AuthPage onLogin={handleLogin} />
  }

  return <Home onLogout={handleLogout} />
}

export default App

import { useState } from 'react'

const authStorageKey = 'smartspend-auth-user'

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setErrorMessage('')
    setForgotPasswordVisible(false)
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setErrorMessage('')
    setForgotPasswordVisible(false)
    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
  }

  const saveUser = (user) => {
    localStorage.setItem(authStorageKey, JSON.stringify(user))
    onLogin(user)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (mode === 'register' && !formData.name.trim()) {
      setErrorMessage('Please enter your full name.')
      return
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (!formData.password || formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.')
      return
    }

    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    if (mode === 'login') {
      saveUser({
        name: 'SmartSpend User',
        email: formData.email.trim(),
        provider: 'email',
      })
    } else {
      saveUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        provider: 'email',
      })
    }
  }

  const handleGoogleLogin = () => {
    saveUser({
      name: 'Google Demo User',
      email: 'demo@google.com',
      provider: 'google-demo',
    })
  }

  const handleForgotPassword = () => {
    setForgotPasswordVisible(true)
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-card__header">
          <span className="auth-card__logo">SmartSpend AI</span>
          <p className="auth-card__tagline">Personal Finance Dashboard</p>
        </div>

        <div className="auth-card__tabs" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            className={`auth-card__tab ${mode === 'login' ? 'auth-card__tab--active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            className={`auth-card__tab ${mode === 'register' ? 'auth-card__tab--active' : ''}`}
            onClick={() => switchMode('register')}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {errorMessage ? (
            <p className="auth-form__error" role="alert">{errorMessage}</p>
          ) : null}

          {mode === 'register' && (
            <input
              className="auth-form__input"
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
          )}

          <input
            className="auth-form__input"
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />

          <input
            className="auth-form__input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />

          {mode === 'register' && (
            <input
              className="auth-form__input"
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          )}

          {mode === 'login' && (
            <div className="auth-form__forgot">
              <button
                type="button"
                className="auth-form__forgot-link"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>
              {forgotPasswordVisible && (
                <p className="auth-form__forgot-message" role="status">
                  Password reset feature will be available in a future version.
                </p>
              )}
            </div>
          )}

          <button className="auth-form__submit" type="submit">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-card__divider" aria-hidden="true">
          <span>or</span>
        </div>

        <button
          type="button"
          className="auth-card__google-button"
          onClick={handleGoogleLogin}
        >
          <span className="auth-card__google-icon" aria-hidden="true">G</span>
          Continue with Google
          <span className="auth-card__google-demo-badge">demo</span>
        </button>

        <p className="auth-card__disclaimer">
          This is a frontend demo. No real authentication or data is transmitted.
        </p>
      </div>
    </div>
  )
}

export default AuthPage

import { useEffect, useState } from 'react'
import { Chart as ChartJS } from 'chart.js'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import BalanceCard from '../components/BalanceCard'
import ExpenseForm from '../components/ExpenseForm'
import TransactionList from '../components/TransactionList'
import AIRecommendation from '../components/AIRecommendation'
import ChartSection from '../components/ChartSection'

const storageKey = 'smartspend-transactions'
const themeStorageKey = 'smartspend-theme'

const initialTransactions = [
  {
    id: 1,
    title: 'Salary',
    amount: 25000,
    category: 'Salary',
    type: 'income',
    date: '2026-05-08',
  },
  {
    id: 2,
    title: 'Groceries',
    amount: 3200,
    category: 'Food',
    type: 'expense',
    date: '2026-05-07',
  },
  {
    id: 3,
    title: 'Internet Bill',
    amount: 1450,
    category: 'Other',
    type: 'expense',
    date: '2026-05-06',
  },
]

function getInitialTransactions() {
  try {
    const savedTransactions = localStorage.getItem(storageKey)

    if (!savedTransactions) {
      return initialTransactions
    }

    const parsedTransactions = JSON.parse(savedTransactions)

    return Array.isArray(parsedTransactions) ? parsedTransactions : initialTransactions
  } catch {
    return initialTransactions
  }
}

function getStoredAuthUser() {
  try {
    const storedUser = localStorage.getItem('smartspend-auth-user')

    if (!storedUser) {
      return null
    }

    const parsedUser = JSON.parse(storedUser)

    return parsedUser && typeof parsedUser === 'object' ? parsedUser : null
  } catch {
    return null
  }
}

function getInitialTheme() {
  try {
    const storedTheme = localStorage.getItem(themeStorageKey)

    return storedTheme === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function Home({ onLogout }) {
  const [transactions, setTransactions] = useState(getInitialTransactions)
  const [authUser, setAuthUser] = useState(getStoredAuthUser)
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    setAuthUser(getStoredAuthUser())
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark')
    localStorage.setItem(themeStorageKey, theme)

    const css = getComputedStyle(document.body)
    const chartText = css.getPropertyValue('--chart-text').trim() || '#334155'
    const chartGrid = css.getPropertyValue('--chart-grid').trim() || 'rgba(148, 163, 184, 0.24)'

    ChartJS.defaults.color = chartText
    ChartJS.defaults.borderColor = chartGrid
  }, [theme])

  const addTransaction = (transaction) => {
    setTransactions((currentTransactions) => [transaction, ...currentTransactions])
  }

  const deleteTransaction = (transactionId) => {
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== transactionId),
    )
  }

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <Sidebar onLogout={onLogout} theme={theme} onToggleTheme={toggleTheme} />

        <div className="dashboard-content">
          <header className="dashboard-header">
            <nav className="dashboard-nav" aria-label="Primary navigation">
              <Navbar />
            </nav>
          </header>

          <main className="dashboard-main" aria-label="SmartSpend AI dashboard">
            <section
              id="dashboard"
              className="dashboard-overview dashboard-section"
              aria-labelledby="overview-heading"
            >
              <h2 id="overview-heading" className="section-title">
                Financial Overview
              </h2>
              <div className="dashboard-overview-grid">
                <BalanceCard transactions={transactions} />
                <ExpenseForm addTransaction={addTransaction} />
              </div>
            </section>

            <section
              id="transactions"
              className="dashboard-transactions transactions-section"
              aria-labelledby="transactions-heading"
            >
              <h2 id="transactions-heading" className="section-title">
                Recent Activity
              </h2>
              <TransactionList
                transactions={transactions}
                deleteTransaction={deleteTransaction}
              />
            </section>

            <section className="dashboard-insights" aria-labelledby="insights-heading">
              <h2 id="insights-heading" className="section-title">
                Insights and Recommendations
              </h2>
              <div className="dashboard-insights-stack">
                <div id="reports" className="reports-section">
                  <ChartSection key={`chart-section-${theme}`} transactions={transactions} theme={theme} />
                </div>
                <div id="ai-advice" className="ai-advice-section">
                  <AIRecommendation transactions={transactions} />
                </div>
              </div>
            </section>

            <section id="account-section" className="dashboard-meta-section" aria-labelledby="account-heading">
              <h2 id="account-heading" className="section-title">
                Account
              </h2>
              <article className="card dashboard-meta-card">
                <h3 className="dashboard-meta-card__title">Demo Profile</h3>
                <p className="dashboard-meta-card__line">
                  <strong>User profile:</strong> {authUser?.name || 'Demo User'}
                </p>
                <p className="dashboard-meta-card__line">
                  <strong>Email:</strong> {authUser?.email || 'demo@smartspend.ai'}
                </p>
                <p className="dashboard-meta-card__line">
                  <strong>Account type:</strong> Demo Account
                </p>
              </article>
            </section>

            <section id="settings-section" className="dashboard-meta-section" aria-labelledby="settings-heading">
              <h2 id="settings-heading" className="section-title">
                Settings
              </h2>
              <article className="card dashboard-meta-card">
                <h3 className="dashboard-meta-card__title">Demo Settings</h3>
                <p className="dashboard-meta-card__line">
                  <strong>Currency:</strong> Turkish Lira
                </p>
                <p className="dashboard-meta-card__line">
                  <strong>Data Storage:</strong> LocalStorage
                </p>
                <p className="dashboard-meta-card__line">
                  <strong>Theme:</strong> {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className="dashboard-meta-card__note">
                  Settings are demo-only in this version.
                </p>
              </article>
            </section>
          </main>

          <footer className="dashboard-footer">
            <p>SmartSpend AI dashboard layout placeholder.</p>
          </footer>
          </div>
      </div>
    </div>
  )
}

export default Home

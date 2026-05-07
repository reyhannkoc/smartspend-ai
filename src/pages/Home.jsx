import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import BalanceCard from '../components/BalanceCard'
import ExpenseForm from '../components/ExpenseForm'
import TransactionList from '../components/TransactionList'
import AIRecommendation from '../components/AIRecommendation'
import ChartSection from '../components/ChartSection'

const storageKey = 'smartspend-transactions'

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

function Home() {
  const [transactions, setTransactions] = useState(getInitialTransactions)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = (transaction) => {
    setTransactions((currentTransactions) => [transaction, ...currentTransactions])
  }

  const deleteTransaction = (transactionId) => {
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== transactionId),
    )
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <nav className="dashboard-nav" aria-label="Primary navigation">
          <Navbar />
        </nav>
      </header>

      <main className="dashboard-main" aria-label="SmartSpend AI dashboard">
        <section className="dashboard-overview" aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="section-title">
            Financial Overview
          </h2>
          <div className="dashboard-overview-grid">
            <BalanceCard transactions={transactions} />
            <ExpenseForm addTransaction={addTransaction} />
          </div>
        </section>

        <section className="dashboard-transactions" aria-labelledby="transactions-heading">
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
          <div className="dashboard-insights-grid">
            <AIRecommendation transactions={transactions} />
            <ChartSection transactions={transactions} />
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>SmartSpend AI dashboard layout placeholder.</p>
      </footer>
    </div>
  )
}

export default Home

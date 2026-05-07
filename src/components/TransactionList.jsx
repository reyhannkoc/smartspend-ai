import { useState } from 'react'
import TransactionItem from './TransactionItem'

function TransactionList({ transactions, deleteTransaction }) {
  const [selectedFilter, setSelectedFilter] = useState('all')

  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedFilter === 'all') {
      return true
    }

    return transaction.type === selectedFilter
  })

  return (
    <section className="card transaction-list">
      <div className="transaction-list__header">
        <h2>Transaction List</h2>
        <p>{filteredTransactions.length} records</p>
      </div>

      <div className="transaction-list__filters" aria-label="Transaction filters">
        <button
          className={`transaction-list__filter-button ${selectedFilter === 'all' ? 'transaction-list__filter-button--active' : ''}`}
          type="button"
          onClick={() => setSelectedFilter('all')}
        >
          All
        </button>
        <button
          className={`transaction-list__filter-button ${selectedFilter === 'income' ? 'transaction-list__filter-button--active' : ''}`}
          type="button"
          onClick={() => setSelectedFilter('income')}
        >
          Income
        </button>
        <button
          className={`transaction-list__filter-button ${selectedFilter === 'expense' ? 'transaction-list__filter-button--active' : ''}`}
          type="button"
          onClick={() => setSelectedFilter('expense')}
        >
          Expense
        </button>
      </div>

      <div className="transaction-list__items">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              deleteTransaction={deleteTransaction}
            />
          ))
        ) : (
          <p className="transaction-list__empty">No transactions found.</p>
        )}
      </div>
    </section>
  )
}

export default TransactionList

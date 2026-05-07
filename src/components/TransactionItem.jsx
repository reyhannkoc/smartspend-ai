function TransactionItem({ transaction, deleteTransaction }) {
  const amountPrefix = transaction.type === 'income' ? '+' : '-'
  const formattedType = transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)

  return (
    <article className={`transaction-item transaction-item--${transaction.type}`}>
      <div className="transaction-item__details">
        <h3 className="transaction-item__title">{transaction.title}</h3>
        <p className="transaction-item__meta">
          {transaction.category} . {formattedType} . {transaction.date}
        </p>
      </div>

      <div className="transaction-item__actions">
        <span className={`transaction-item__amount transaction-item__amount--${transaction.type}`}>
          {amountPrefix} ₺{transaction.amount.toLocaleString('tr-TR')}
        </span>
        <button
          className="transaction-item__button"
          type="button"
          onClick={() => deleteTransaction(transaction.id)}
        >
          Delete
        </button>
      </div>
    </article>
  )
}

export default TransactionItem

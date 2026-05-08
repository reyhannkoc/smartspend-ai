const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

function BalanceCard({ transactions }) {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const totalBalance = totalIncome - totalExpenses
  const remainingBalance = totalIncome - totalExpenses

  // Determine status for Money Left card
  let statusEmoji = '💰'
  let statusMessage = 'Your finances are healthy.'
  let statusClass = 'balance-card__stat--positive'

  if (remainingBalance === 0) {
    statusEmoji = '⚖️'
    statusMessage = 'Your balance is neutral.'
    statusClass = 'balance-card__stat--neutral'
  } else if (remainingBalance < 0) {
    statusEmoji = '⚠️'
    statusMessage = 'Warning: Expenses exceed income.'
    statusClass = 'balance-card__stat--negative'
  }

  return (
    <section className="card balance-card">
      <div className="balance-card__header">
        <div>
          <p className="balance-card__label">Financial Summary</p>
          <h2 className="balance-card__amount">SmartSpend Overview</h2>
        </div>
        <span className="balance-card__badge">{transactions.length} entries</span>
      </div>

      <div className="balance-card__money-left">
        <article className={`balance-card__stat balance-card__stat--money-left ${statusClass}`}>
          <div className="balance-card__money-left-emoji">{statusEmoji}</div>
          <span className="balance-card__stat-label">Money Left</span>
          <strong className="balance-card__stat-value balance-card__money-left-value">
            {currencyFormatter.format(remainingBalance)}
          </strong>
          <p className="balance-card__money-left-status">{statusMessage}</p>
        </article>
      </div>

      <div className="balance-card__stats">
        <article className="balance-card__stat balance-card__stat--balance">
          <span className="balance-card__stat-label">Total Balance</span>
          <strong className="balance-card__stat-value">
            {currencyFormatter.format(totalBalance)}
          </strong>
        </article>
        <article className="balance-card__stat balance-card__stat--income">
          <span className="balance-card__stat-label">Total Income</span>
          <strong className="balance-card__stat-value">
            {currencyFormatter.format(totalIncome)}
          </strong>
        </article>
        <article className="balance-card__stat balance-card__stat--expense">
          <span className="balance-card__stat-label">Total Expenses</span>
          <strong className="balance-card__stat-value">
            {currencyFormatter.format(totalExpenses)}
          </strong>
        </article>
      </div>
    </section>
  )
}

export default BalanceCard

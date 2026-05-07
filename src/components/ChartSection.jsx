import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const chartColors = ['#0f766e', '#10b981', '#38bdf8', '#6366f1', '#f59e0b', '#f97316', '#f43f5e', '#8b5cf6']

function ChartSection({ transactions }) {
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === 'expense',
  )

  const expenseByCategory = expenseTransactions.reduce((categories, transaction) => {
    const currentAmount = categories[transaction.category] ?? 0

    return {
      ...categories,
      [transaction.category]: currentAmount + transaction.amount,
    }
  }, {})

  const categoryLabels = Object.keys(expenseByCategory)
  const categoryValues = Object.values(expenseByCategory)
  const chartData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: chartColors.slice(0, categoryLabels.length),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 14,
          color: '#475569',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.label}: ₺${context.raw.toLocaleString('tr-TR')}`,
        },
      },
    },
    cutout: '62%',
  }

  return (
    <section className="card chart-section">
      <h2>Expense Categories</h2>
      <p className="chart-section__summary">
        Expense totals are grouped by category to highlight where your money is going.
      </p>

      {expenseTransactions.length > 0 ? (
        <div className="chart-section__canvas-wrapper">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      ) : (
        <p className="chart-section__empty">No expense data available for chart.</p>
      )}
    </section>
  )
}

export default ChartSection

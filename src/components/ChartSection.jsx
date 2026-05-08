import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const expenseColors = ['#f43f5e', '#f97316', '#f59e0b', '#6366f1', '#0f766e', '#10b981', '#38bdf8', '#8b5cf6']
const incomeColors  = ['#10b981', '#0f766e', '#34d399', '#6ee7b7', '#059669', '#047857', '#a7f3d0', '#d1fae5']

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const lightThemeColors = {
  centerLabel: '#64748b',
  centerValue: '#0f172a',
  legend: '#475569',
  tooltipBackground: 'rgba(15, 23, 42, 0.96)',
  tooltipTitle: '#f8fafc',
  tooltipBody: '#e2e8f0',
  tooltipBorder: 'rgba(148, 163, 184, 0.45)',
  sliceBorder: '#ffffff',
}

const darkThemeColors = {
  centerLabel: '#cbd5e1',
  centerValue: '#f8fafc',
  legend: '#cbd5e1',
  tooltipBackground: 'rgba(2, 6, 23, 0.96)',
  tooltipTitle: '#f8fafc',
  tooltipBody: '#dbeafe',
  tooltipBorder: 'rgba(148, 163, 184, 0.55)',
  sliceBorder: 'rgba(15, 23, 42, 0.88)',
}

function isDarkMode(theme) {
  if (theme === 'dark') {
    return true
  }

  if (theme === 'light') {
    return false
  }

  if (typeof document === 'undefined') {
    return false
  }

  return document.body.classList.contains('dark-theme')
    || document.documentElement.classList.contains('dark-theme')
}

const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart, _args, pluginOptions) {
    const { ctx } = chart
    const firstArc = chart.getDatasetMeta(0)?.data?.[0]

    if (!firstArc) {
      return
    }

    const label = pluginOptions?.label ?? ''
    const value = pluginOptions?.value ?? ''
    const labelColor = pluginOptions?.labelColor ?? '#64748b'
    const valueColor = pluginOptions?.valueColor ?? '#0f172a'

    // Scale font sizes relative to the inner hole radius so text always fits
    const innerRadius = firstArc.innerRadius ?? chart.width * 0.31
    const labelFontSize = Math.max(13, Math.round(innerRadius * 0.2))
    const valueFontSize = Math.max(22, Math.round(innerRadius * 0.35))

    // Gap between the two lines: half-label above centre, gap, half-value below
    const gap = Math.max(8, Math.round(innerRadius * 0.11))
    const cx = firstArc.x
    const cy = firstArc.y
    const labelY = cy - gap / 2 - labelFontSize * 0.6
    const valueY = cy + gap / 2 + valueFontSize * 0.6

    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.fillStyle = labelColor
    ctx.font = `600 ${labelFontSize}px Manrope, "Segoe UI", sans-serif`
    ctx.fillText(label, cx, labelY)

    ctx.fillStyle = valueColor
    ctx.font = `800 ${valueFontSize}px Manrope, "Segoe UI", sans-serif`
    ctx.fillText(value, cx, valueY)

    ctx.restore()
  },
}

function buildChartData(byCategory, colors, sliceBorderColor) {
  const labels = Object.keys(byCategory)
  const values = Object.values(byCategory)
  return {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: sliceBorderColor,
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  }
}

function buildChartOptions(centerLabel, centerValue, themeColors) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      centerText: {
        label: centerLabel,
        value: centerValue,
        labelColor: themeColors.centerLabel,
        valueColor: themeColors.centerValue,
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 18,
          color: themeColors.legend,
          font: { size: 13, weight: 600 },
        },
      },
      tooltip: {
        backgroundColor: themeColors.tooltipBackground,
        titleColor: themeColors.tooltipTitle,
        bodyColor: themeColors.tooltipBody,
        borderColor: themeColors.tooltipBorder,
        borderWidth: 1,
        callbacks: {
          label: (context) => ` ${context.label}: ₺${context.raw.toLocaleString('tr-TR')}`,
        },
      },
    },
    cutout: '62%',
  }
}

function groupByCategory(txList) {
  return txList.reduce((acc, tx) => {
    const current = acc[tx.category] ?? 0
    return { ...acc, [tx.category]: current + tx.amount }
  }, {})
}

function ChartSection({ transactions, theme }) {
  const themeColors = isDarkMode(theme) ? darkThemeColors : lightThemeColors

  const expenseTransactions = transactions.filter((t) => t.type === 'expense')
  const incomeTransactions  = transactions.filter((t) => t.type === 'income')

  const totalExpenses = expenseTransactions.reduce((s, t) => s + t.amount, 0)
  const totalIncome   = incomeTransactions.reduce((s, t) => s + t.amount, 0)

  const expenseData = buildChartData(groupByCategory(expenseTransactions), expenseColors, themeColors.sliceBorder)
  const incomeData  = buildChartData(groupByCategory(incomeTransactions),  incomeColors, themeColors.sliceBorder)

  const expenseOptions = buildChartOptions('Total Expenses', currencyFormatter.format(totalExpenses), themeColors)
  const incomeOptions  = buildChartOptions('Total Income',   currencyFormatter.format(totalIncome), themeColors)

  return (
    <div className="charts-grid">
      <section className="card chart-card chart-card--income">
        <h2 className="chart-card__title chart-card__title--income">Income Categories</h2>
        <p className="chart-section__summary">Income transactions grouped by category.</p>
        {incomeTransactions.length > 0 ? (
          <div className="chart-section__canvas-wrapper">
            <Doughnut key={`income-doughnut-${theme || 'auto'}`} data={incomeData} options={incomeOptions} plugins={[centerTextPlugin]} />
          </div>
        ) : (
          <p className="chart-section__empty">No income data available for chart.</p>
        )}
      </section>

      <section className="card chart-card chart-card--expense">
        <h2 className="chart-card__title chart-card__title--expense">Expense Categories</h2>
        <p className="chart-section__summary">Expense transactions grouped by category.</p>
        {expenseTransactions.length > 0 ? (
          <div className="chart-section__canvas-wrapper">
            <Doughnut key={`expense-doughnut-${theme || 'auto'}`} data={expenseData} options={expenseOptions} plugins={[centerTextPlugin]} />
          </div>
        ) : (
          <p className="chart-section__empty">No expense data available for chart.</p>
        )}
      </section>
    </div>
  )
}

export default ChartSection

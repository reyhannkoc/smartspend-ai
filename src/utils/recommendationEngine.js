export function generateRecommendations(transactions) {
  if (transactions.length === 0) {
    return ['Add your first transaction to receive financial recommendations.']
  }

  const totals = transactions.reduce(
    (summary, transaction) => {
      if (transaction.type === 'income') {
        summary.totalIncome += transaction.amount
      }

      if (transaction.type === 'expense') {
        summary.totalExpenses += transaction.amount

        if (transaction.category === 'Food') {
          summary.foodExpenses += transaction.amount
        }

        if (transaction.category === 'Entertainment') {
          summary.entertainmentExpenses += transaction.amount
        }
      }

      return summary
    },
    {
      totalIncome: 0,
      totalExpenses: 0,
      foodExpenses: 0,
      entertainmentExpenses: 0,
    },
  )

  const balance = totals.totalIncome - totals.totalExpenses
  const recommendations = []

  if (totals.totalExpenses > totals.totalIncome) {
    recommendations.push('Your expenses are higher than your income. Try reducing unnecessary spending.')
  }

  if (balance > 0) {
    recommendations.push('You are saving money successfully. Keep maintaining your spending habits.')
  }

  if (totals.totalExpenses > 0 && totals.foodExpenses > totals.totalExpenses * 0.4) {
    recommendations.push('Your food expenses are higher than average. Consider planning your meals and reducing unnecessary food spending.')
  }

  if (
    totals.totalExpenses > 0
    && totals.entertainmentExpenses > totals.totalExpenses * 0.25
  ) {
    recommendations.push('Your entertainment expenses are relatively high. Try setting a monthly entertainment budget.')
  }

  if (totals.totalIncome > 0 && totals.totalExpenses <= totals.totalIncome * 0.5) {
    recommendations.push('Your spending level is healthy compared to your income.')
  }

  return recommendations.length > 0
    ? recommendations
    : ['Keep tracking your transactions to receive more personalized recommendations.']
}

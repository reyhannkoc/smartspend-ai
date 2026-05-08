export function generateRecommendations(transactions) {
  if (transactions.length === 0) {
    return {
      score: 0,
      scoreLevel: 'Needs Improvement',
      categories: {
        initial: [
          {
            emoji: '📊',
            priority: 'positive',
            text: 'Add your first transaction to receive comprehensive financial recommendations.'
          }
        ]
      }
    }
  }

  // Calculate comprehensive metrics
  const metrics = calculateMetrics(transactions)
  const categoryAnalysis = analyzeCategorySpending(transactions, metrics)
  const recommendations = generateDetailedRecommendations(metrics, categoryAnalysis, transactions)
  const score = calculateFinancialScore(metrics)

  return {
    score: score.value,
    scoreLevel: score.level,
    categories: recommendations
  }
}

export function getFinancialMetrics(transactions) {
  return calculateMetrics(transactions)
}

function calculateMetrics(transactions) {
  const expenseTransactions = transactions.filter(t => t.type === 'expense')
  const incomeTransactions = transactions.filter(t => t.type === 'income')

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpenses
  const savingsRatio = totalIncome > 0 ? (balance / totalIncome) * 100 : 0
  const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0

  return {
    totalIncome,
    totalExpenses,
    balance,
    savingsRatio,
    expenseRatio,
    transactionCount: transactions.length,
    expenseCount: expenseTransactions.length,
    incomeCount: incomeTransactions.length
  }
}

function analyzeCategorySpending(transactions, metrics) {
  const categoryTotals = {}
  const expenseTransactions = transactions.filter(t => t.type === 'expense')

  expenseTransactions.forEach(transaction => {
    const category = transaction.category || 'Other'
    categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount
  })

  // Calculate percentages and find highest
  const categoryPercentages = {}
  let highestCategory = null
  let highestAmount = 0

  Object.entries(categoryTotals).forEach(([category, amount]) => {
    categoryPercentages[category] = metrics.totalExpenses > 0 ? (amount / metrics.totalExpenses) * 100 : 0
    if (amount > highestAmount) {
      highestAmount = amount
      highestCategory = category
    }
  })

  return {
    totals: categoryTotals,
    percentages: categoryPercentages,
    highestCategory,
    highestAmount
  }
}

function generateDetailedRecommendations(metrics, categoryAnalysis, transactions) {
  const recommendations = {}

  // Spending Analysis
  recommendations.spendingAnalysis = []
  if (metrics.totalExpenses > metrics.totalIncome && metrics.totalIncome > 0) {
    recommendations.spendingAnalysis.push({
      emoji: '🚨',
      priority: 'critical',
      text: 'Your expenses currently exceed your income. This may create long-term financial pressure if continued. Consider reviewing non-essential spending categories such as entertainment or shopping.'
    })
  } else if (metrics.expenseRatio > 80) {
    recommendations.spendingAnalysis.push({
      emoji: '⚠️',
      priority: 'warning',
      text: `You are spending ${metrics.expenseRatio.toFixed(0)}% of your income. Aim to keep expenses below 80% for healthier finances.`
    })
  } else if (metrics.expenseRatio <= 60) {
    recommendations.spendingAnalysis.push({
      emoji: '✅',
      priority: 'positive',
      text: `Your spending level is healthy at ${metrics.expenseRatio.toFixed(0)}% of your income. This leaves room for savings and emergencies.`
    })
  }

  // Savings Analysis
  recommendations.savingsAnalysis = []
  if (metrics.savingsRatio >= 40 && metrics.totalIncome > 0) {
    recommendations.savingsAnalysis.push({
      emoji: '💰',
      priority: 'positive',
      text: 'You are maintaining a strong savings ratio compared to your income. This indicates healthy financial discipline and excellent progress toward your financial goals.'
    })
  } else if (metrics.savingsRatio >= 20 && metrics.totalIncome > 0) {
    recommendations.savingsAnalysis.push({
      emoji: '📈',
      priority: 'positive',
      text: `Your savings rate of ${metrics.savingsRatio.toFixed(0)}% is solid. Continue building this habit for long-term financial security.`
    })
  } else if (metrics.savingsRatio >= 0 && metrics.totalIncome > 0) {
    recommendations.savingsAnalysis.push({
      emoji: '⚠️',
      priority: 'warning',
      text: `Your savings rate is ${metrics.savingsRatio.toFixed(0)}%. Try to aim for at least 10-20% of income as savings to build financial resilience.`
    })
  } else if (metrics.balance < 0) {
    recommendations.savingsAnalysis.push({
      emoji: '🚨',
      priority: 'critical',
      text: 'You are not saving any money this period. Your expenses exceed your income, which may impact your long-term financial stability.'
    })
  }

  // Budget Health
  recommendations.budgetHealth = []
  if (metrics.balance > 0 && metrics.balance < metrics.totalIncome * 0.1) {
    recommendations.budgetHealth.push({
      emoji: '⚠️',
      priority: 'warning',
      text: 'Your remaining balance is becoming limited. Creating a stricter monthly budget may help maintain financial stability.'
    })
  } else if (metrics.balance > metrics.totalIncome * 0.3) {
    recommendations.budgetHealth.push({
      emoji: '✅',
      priority: 'positive',
      text: 'Your financial balance is currently stable. Maintaining consistent saving habits can help you achieve long-term financial goals.'
    })
  } else if (metrics.balance < 0) {
    recommendations.budgetHealth.push({
      emoji: '🚨',
      priority: 'critical',
      text: 'Your balance is negative, indicating overspending. Review your budget immediately and prioritize essential expenses.'
    })
  }

  // Category Warnings
  recommendations.categoryWarnings = []
  
  const foodPercent = categoryAnalysis.percentages['Food'] || 0
  if (foodPercent > 35) {
    recommendations.categoryWarnings.push({
      emoji: '🍽️',
      priority: 'warning',
      text: `Food expenses are ${foodPercent.toFixed(0)}% of your spending. Meal planning and reducing unnecessary delivery expenses may help improve your monthly balance.`
    })
  }

  const entertainmentPercent = categoryAnalysis.percentages['Entertainment'] || 0
  if (entertainmentPercent > 25) {
    recommendations.categoryWarnings.push({
      emoji: '🎬',
      priority: 'warning',
      text: `Entertainment spending is ${entertainmentPercent.toFixed(0)}% of your expenses. Setting a fixed monthly entertainment budget may improve spending control.`
    })
  }

  const shoppingPercent = categoryAnalysis.percentages['Shopping'] || 0
  if (shoppingPercent > 20) {
    recommendations.categoryWarnings.push({
      emoji: '🛍️',
      priority: 'warning',
      text: `Shopping is currently ${shoppingPercent.toFixed(0)}% of your expenses. Consider distinguishing between necessary and impulse purchases.`
    })
  }

  if (categoryAnalysis.highestCategory && recommendations.categoryWarnings.length === 0) {
    const highestPercent = categoryAnalysis.percentages[categoryAnalysis.highestCategory] || 0
    if (highestPercent > 30) {
      recommendations.categoryWarnings.push({
        emoji: '📊',
        priority: 'warning',
        text: `${categoryAnalysis.highestCategory} is your highest spending category at ${highestPercent.toFixed(0)}%. Review if this spending is necessary.`
      })
    }
  }

  // Financial Habits
  recommendations.financialHabits = []
  if (metrics.transactionCount > 30) {
    recommendations.financialHabits.push({
      emoji: '📝',
      priority: 'positive',
      text: `Excellent tracking! You have recorded ${metrics.transactionCount} transactions, showing strong financial awareness and discipline.`
    })
  }

  if (metrics.expenseCount > 20) {
    recommendations.financialHabits.push({
      emoji: '⚠️',
      priority: 'warning',
      text: `You have many small transactions. Small repeated purchases can significantly affect long-term savings. Consider consolidating or batch shopping.`
    })
  }

  if (metrics.transactionCount > 0 && metrics.transactionCount <= 5) {
    recommendations.financialHabits.push({
      emoji: '📌',
      priority: 'positive',
      text: 'You are starting your financial tracking journey. Keep recording transactions consistently to build a comprehensive financial picture.'
    })
  }

  // Positive Insights
  recommendations.positiveInsights = []
  if (metrics.balance > 0) {
    recommendations.positiveInsights.push({
      emoji: '🎯',
      priority: 'positive',
      text: `Great work! Your current balance is positive at ₺${metrics.balance.toLocaleString('tr-TR')}. Keep up your financial discipline.`
    })
  }

  if (metrics.totalIncome > 0 && metrics.expenseRatio < 50) {
    recommendations.positiveInsights.push({
      emoji: '🏆',
      priority: 'positive',
      text: 'Your spending is well-controlled. You are on track for strong financial health and long-term wealth building.'
    })
  }

  return recommendations
}

function calculateFinancialScore(metrics) {
  let score = 50 // Base score

  // Savings ratio (up to 30 points)
  if (metrics.savingsRatio >= 40) score += 30
  else if (metrics.savingsRatio >= 20) score += 20
  else if (metrics.savingsRatio >= 0) score += 10

  // Expense ratio (up to 35 points)
  if (metrics.expenseRatio <= 50) score += 35
  else if (metrics.expenseRatio <= 70) score += 20
  else if (metrics.expenseRatio <= 85) score += 10

  // Balance health (up to 20 points)
  if (metrics.balance > metrics.totalIncome * 0.3) score += 20
  else if (metrics.balance > 0) score += 10
  else if (metrics.balance < 0) score -= 15

  // Transaction tracking (up to 15 points)
  if (metrics.transactionCount >= 30) score += 15
  else if (metrics.transactionCount >= 10) score += 8
  else if (metrics.transactionCount > 0) score += 3

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, score))

  // Determine level
  let level = 'Needs Improvement'
  if (score >= 90) level = 'Excellent'
  else if (score >= 70) level = 'Good'
  else if (score >= 50) level = 'Moderate'

  return { value: Math.round(score), level }
}

export function generateInvestmentSuggestions(metrics) {
  const suggestions = {
    riskProfile: 'conservative',
    title: '',
    suggestions: [],
    educationTips: []
  }

  const balance = metrics.balance

  // No balance scenario
  if (balance <= 0) {
    suggestions.title = 'No Investment Capacity Currently'
    suggestions.suggestions.push({
      emoji: '⚠️',
      title: 'Focus on Budget Stability',
      description: 'Currently there is no available balance for investment. Focus on reducing expenses and stabilizing your budget first.'
    })
    suggestions.educationTips = [
      'Emergency Fund: Start with 3-6 months of essential expenses set aside in a liquid savings account.'
    ]
    return suggestions
  }

  // Low balance scenario (₺1,000 - ₺5,000)
  if (balance > 0 && balance <= 5000) {
    suggestions.riskProfile = 'conservative'
    suggestions.title = 'Building Investment Foundations'
    suggestions.suggestions = [
      {
        emoji: '🏦',
        title: 'Emergency Savings Account',
        description: 'Build a safety net with 3-6 months of expenses in a high-yield savings account.'
      },
      {
        emoji: '💰',
        title: 'Gold or Precious Metals Savings',
        description: 'Consider allocating a small portion to gold savings as a tangible hedge against inflation.'
      },
      {
        emoji: '📈',
        title: 'Small Monthly Investments',
        description: 'Start with consistent monthly investments of ₺500-₺1,000 in low-risk savings products.'
      },
      {
        emoji: '🏦',
        title: 'High-Yield Savings Account',
        description: 'Look for savings accounts offering 8-12% annual returns for safer capital growth.'
      }
    ]
    suggestions.educationTips = [
      'Emergency Fund: Before investing, ensure 3-6 months of expenses are saved for emergencies.',
      'Consistency: Regular small investments build wealth over time through compound growth.',
      'Inflation Protection: Diversifying between cash and inflation-resistant assets helps preserve purchasing power.'
    ]
    return suggestions
  }

  // Medium balance scenario (₺5,000 - ₺20,000)
  if (balance > 5000 && balance <= 20000) {
    suggestions.riskProfile = 'moderate'
    suggestions.title = 'Diversified Investment Strategy'
    suggestions.suggestions = [
      {
        emoji: '📈',
        title: 'Index Funds or ETFs',
        description: 'Invest in diversified index funds tracking stock market indices for balanced growth.'
      },
      {
        emoji: '💰',
        title: 'Dollar-Cost Averaging',
        description: 'Invest fixed amounts monthly rather than lump-sum to reduce market timing risk.'
      },
      {
        emoji: '🏦',
        title: 'Diversified Portfolio Allocation',
        description: `Consider: 60% stocks/ETFs, 30% bonds, 10% cash reserves for flexibility.`
      },
      {
        emoji: '🚀',
        title: 'Long-Term Investment Planning',
        description: 'Focus on 5-10 year horizons to benefit from compound growth and market cycles.'
      }
    ]
    suggestions.educationTips = [
      'Diversification: Spreading investments across asset classes reduces overall portfolio risk.',
      'Time in Market: Long-term investing typically outperforms market timing strategies.',
      'Dollar-Cost Averaging: Investing fixed amounts regularly helps minimize the impact of market volatility.'
    ]
    return suggestions
  }

  // High balance scenario (above ₺20,000)
  if (balance > 20000) {
    suggestions.riskProfile = 'growth'
    suggestions.title = 'Advanced Investment Opportunities'
    suggestions.suggestions = [
      {
        emoji: '📈',
        title: 'Diversified Portfolio Planning',
        description: `Build a diversified portfolio: 50-60% growth assets, 30-40% bonds, 10% alternatives.`
      },
      {
        emoji: '🚀',
        title: 'Long-Term ETF Investing',
        description: 'Consider low-cost, globally diversified ETFs for passive long-term wealth accumulation.'
      },
      {
        emoji: '🏆',
        title: 'Retirement Planning',
        description: 'Maximize retirement contributions and explore tax-advantaged investment vehicles.'
      },
      {
        emoji: '💰',
        title: 'Emergency Fund Growth',
        description: 'Ensure 6-12 months of expenses in liquid reserves, then invest excess funds.'
      },
      {
        emoji: '📊',
        title: 'Passive Income Exploration',
        description: 'Explore dividend-paying stocks, bonds, or real estate investment options for recurring income.'
      }
    ]
    suggestions.educationTips = [
      'Asset Allocation: Your financial position allows more aggressive strategies, but balance remains important.',
      'Emergency Funds: Always maintain 6-12 months of expenses liquid before aggressive investing.',
      'Tax Efficiency: Consider tax-advantaged accounts and timing of investment income for optimal returns.',
      'Rebalancing: Regularly review and rebalance portfolio to maintain target allocations.'
    ]
    return suggestions
  }

  return suggestions
}

export function getRiskProfileColor(profile) {
  switch (profile) {
    case 'conservative':
      return '#059669'
    case 'moderate':
      return '#3b82f6'
    case 'growth':
      return '#dc2626'
    default:
      return '#6b7280'
  }
}

import { useEffect, useState } from 'react'
import { generateRecommendations, generateInvestmentSuggestions, getRiskProfileColor, getFinancialMetrics } from '../utils/recommendationEngine'

const fallbackQuote = 'Smart financial habits are built with small daily decisions.'
const QUOTE_TIMEOUT = 5000 // 5 seconds

function AIRecommendation({ transactions }) {
  const [quote, setQuote] = useState('')
  const [isLoadingQuote, setIsLoadingQuote] = useState(true)
  const analysisData = generateRecommendations(transactions)
  const metrics = getFinancialMetrics(transactions)
  const investmentData = generateInvestmentSuggestions(metrics)

  useEffect(() => {
    let isMounted = true
    let timeoutId = null

    const fetchQuote = async () => {
      try {
        // Create abort controller for fetch timeout
        const controller = new AbortController()
        timeoutId = setTimeout(() => controller.abort(), QUOTE_TIMEOUT)

        const response = await fetch('https://dummyjson.com/quotes/random', {
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error('Failed to fetch quote')
        }

        const data = await response.json()
        const nextQuote = typeof data.quote === 'string' && data.quote.trim()
          ? data.quote.trim()
          : fallbackQuote

        if (isMounted) {
          setQuote(nextQuote)
          setIsLoadingQuote(false)
        }
      } catch {
        // Catches network errors, timeouts, and JSON parse errors
        clearTimeout(timeoutId)
        if (isMounted) {
          setQuote(fallbackQuote)
          setIsLoadingQuote(false)
        }
      }
    }

    fetchQuote()

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [])

  const getScoreColor = (level) => {
    switch (level) {
      case 'Excellent':
        return '#10b981'
      case 'Good':
        return '#3b82f6'
      case 'Moderate':
        return '#f59e0b'
      case 'Needs Improvement':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const getScoreLevelClass = (level) => {
    switch (level) {
      case 'Excellent':
      case 'Harika':
        return 'ai-recommendation__score-level--excellent'
      case 'Good':
        return 'ai-recommendation__score-level--good'
      case 'Moderate':
        return 'ai-recommendation__score-level--moderate'
      case 'Needs Improvement':
        return 'ai-recommendation__score-level--needs-improvement'
      default:
        return 'ai-recommendation__score-level--default'
    }
  }

  const renderCategory = (title, items) => {
    if (!items || items.length === 0) return null

    return (
      <div key={title} className="ai-recommendation__category">
        <h3 className="ai-recommendation__category-title">{title}</h3>
        <div className="ai-recommendation__items">
          {items.map((item, index) => (
            <div
              key={index}
              className={`ai-recommendation__item ai-recommendation__item--${item.priority}`}
            >
              <span className="ai-recommendation__emoji">{item.emoji}</span>
              <p className="ai-recommendation__text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderInvestmentSection = () => {
    if (!investmentData) return null

    return (
      <section id="investment-suggestions" className="card ai-investment">
        <div className="ai-investment__header">
          <h2>💡 Investment Suggestions</h2>
          <span
            className="ai-investment__profile-badge"
            style={{ backgroundColor: getRiskProfileColor(investmentData.riskProfile) }}
          >
            {investmentData.riskProfile.charAt(0).toUpperCase() + investmentData.riskProfile.slice(1)}
          </span>
        </div>

        <div className="ai-investment__title-section">
          <h3 className="ai-investment__title">{investmentData.title}</h3>
        </div>

        <div className="ai-investment__suggestions">
          {investmentData.suggestions.map((suggestion, index) => (
            <div key={index} className="ai-investment__card">
              <div className="ai-investment__card-header">
                <span className="ai-investment__card-emoji">{suggestion.emoji}</span>
                <h4 className="ai-investment__card-title">{suggestion.title}</h4>
              </div>
              <p className="ai-investment__card-description">{suggestion.description}</p>
            </div>
          ))}
        </div>

        {investmentData.educationTips && investmentData.educationTips.length > 0 && (
          <div className="ai-investment__education">
            <h4 className="ai-investment__education-title">📚 Financial Education Tips</h4>
            <ul className="ai-investment__tips-list">
              {investmentData.educationTips.map((tip, index) => (
                <li key={index} className="ai-investment__tip-item">{tip}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="ai-investment__disclaimer">
          <p className="ai-investment__disclaimer-text">
            ⚠️ <strong>Educational Disclaimer:</strong> These suggestions are simulated educational examples and not professional financial advice. 
            Always consult with a qualified financial advisor before making investment decisions.
          </p>
        </div>
      </section>
    )
  }

  const categoryTitles = {
    initial: 'Getting Started',
    spendingAnalysis: 'Spending Analysis',
    savingsAnalysis: 'Savings Analysis',
    budgetHealth: 'Budget Health',
    categoryWarnings: 'Category Insights',
    financialHabits: 'Financial Habits',
    positiveInsights: 'Positive Insights'
  }

  return (
    <>
      <section className="card ai-recommendation">
        <div className="ai-recommendation__header">
          <h2>AI Financial Recommendations</h2>
          <span className="ai-recommendation__badge">{transactions.length} tracked</span>
        </div>

        <p className="ai-recommendation__summary">
          SmartSpend AI reviews your transaction history and highlights practical financial guidance.
        </p>

        {/* Financial Health Score */}
        <div className="ai-recommendation__score-container">
          <div className="ai-recommendation__score-box">
            <div className="ai-recommendation__score-value" style={{ color: getScoreColor(analysisData.scoreLevel) }}>
              {analysisData.score}
              <span className="ai-recommendation__score-max">/100</span>
            </div>
            <div className={`ai-recommendation__score-level ${getScoreLevelClass(analysisData.scoreLevel)}`}>
              {analysisData.scoreLevel}
            </div>
            <p className="ai-recommendation__score-label">Financial Health Score</p>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="ai-recommendation__quote-box">
          <p className="ai-recommendation__quote-label">Motivational Quote</p>
          <p className="ai-recommendation__quote">
            {isLoadingQuote ? 'Loading quote...' : quote}
          </p>
        </div>

        {/* Recommendations by Category */}
        <div className="ai-recommendation__categories">
          {Object.entries(analysisData.categories).map(([categoryKey, items]) => 
            renderCategory(categoryTitles[categoryKey] || categoryKey, items)
          )}
        </div>
      </section>

      {/* Investment Suggestions Section */}
      {renderInvestmentSection()}
    </>
  )
}

export default AIRecommendation

import { useEffect, useState } from 'react'
import { generateRecommendations } from '../utils/recommendationEngine'

const fallbackQuote = 'Smart financial habits are built with small daily decisions.'

function AIRecommendation({ transactions }) {
  const [quote, setQuote] = useState('')
  const [isLoadingQuote, setIsLoadingQuote] = useState(true)
  const [quoteError, setQuoteError] = useState('')
  const recommendations = generateRecommendations(transactions)

  useEffect(() => {
    let isMounted = true

    const fetchQuote = async () => {
      setIsLoadingQuote(true)
      setQuoteError('')

      try {
        const response = await fetch('https://dummyjson.com/quotes/random')

        if (!response.ok) {
          throw new Error('Failed to fetch quote')
        }

        const data = await response.json()
        const nextQuote = typeof data.quote === 'string' && data.quote.trim()
          ? data.quote.trim()
          : fallbackQuote

        if (isMounted) {
          setQuote(nextQuote)
        }
      } catch {
        if (isMounted) {
          setQuote(fallbackQuote)
          setQuoteError('Unable to load a live financial quote right now.')
        }
      } finally {
        if (isMounted) {
          setIsLoadingQuote(false)
        }
      }
    }

    fetchQuote()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="card ai-recommendation">
      <div className="ai-recommendation__header">
        <h2>AI Financial Recommendations</h2>
        <span className="ai-recommendation__badge">{transactions.length} tracked</span>
      </div>

      <p className="ai-recommendation__summary">
        SmartSpend AI reviews your transaction history and highlights practical financial guidance.
      </p>

      <div className="ai-recommendation__quote-box">
        <p className="ai-recommendation__quote-label">Motivational Quote</p>
        <p className="ai-recommendation__quote">
          {isLoadingQuote ? 'Loading quote...' : quote || fallbackQuote}
        </p>
        {quoteError ? (
          <p className="ai-recommendation__quote-status">{quoteError}</p>
        ) : null}
      </div>

      <ul className="ai-recommendation__list">
        {recommendations.map((recommendation) => (
          <li key={recommendation} className="ai-recommendation__item">
            {recommendation}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default AIRecommendation

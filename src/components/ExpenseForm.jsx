import { useState } from 'react'

const categories = [
  'Salary',
  'Food',
  'Rent',
  'Transportation',
  'Entertainment',
  'Education',
  'Shopping',
  'Health',
  'Other',
]

const initialFormState = {
  title: '',
  amount: '',
  category: '',
  type: '',
  date: '',
}

function ExpenseForm({ addTransaction }) {
  const [formData, setFormData] = useState(initialFormState)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setErrorMessage('')
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.title.trim()) {
      setErrorMessage('Please enter a transaction title.')
      return
    }

    if (!formData.amount) {
      setErrorMessage('Please enter an amount.')
      return
    }

    if (Number(formData.amount) <= 0) {
      setErrorMessage('Amount must be greater than 0.')
      return
    }

    if (!formData.category) {
      setErrorMessage('Please select a category.')
      return
    }

    if (!formData.type) {
      setErrorMessage('Please select a transaction type.')
      return
    }

    if (!formData.date) {
      setErrorMessage('Please select a date.')
      return
    }

    addTransaction({
      id: Date.now(),
      ...formData,
      amount: Number(formData.amount),
      title: formData.title.trim(),
    })

    setErrorMessage('')
    setFormData(initialFormState)
  }

  return (
    <section className="card expense-form-card">
      <h2>Add Transaction</h2>
      <p>Quickly add income or expense entries to test dashboard updates.</p>

      <form className="expense-form" onSubmit={handleSubmit}>
        {errorMessage ? <p className="expense-form__error">{errorMessage}</p> : null}

        <input
          className="expense-form__input"
          type="text"
          name="title"
          placeholder="Transaction title"
          value={formData.title}
          onChange={handleChange}
        />

        <div className="expense-form__row">
          <input
            className="expense-form__input"
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            min="0.01"
            step="0.01"
          />
          <select
            className="expense-form__input"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="">Select type</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="expense-form__row">
          <select
            className="expense-form__input"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            className="expense-form__input"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <button className="expense-form__button" type="submit">
          Add Transaction
        </button>
      </form>
    </section>
  )
}

export default ExpenseForm

import { useState } from 'react'
import { getSurveyResults, submitVote } from '../api/client'

export default function QuestionVote({ surveyId, question }) {
  const [selected, setSelected] = useState(question.allow_multiple ? [] : null)
  const [status, setStatus] = useState('idle') // idle | submitting | voted
  const [error, setError] = useState('')
  const [counts, setCounts] = useState(null)

  const toggleChoice = (choiceId) => {
    if (question.allow_multiple) {
      setSelected((prev) =>
        prev.includes(choiceId)
          ? prev.filter((id) => id !== choiceId)
          : [...prev, choiceId],
      )
    } else {
      setSelected(choiceId)
    }
  }

  const hasSelection = question.allow_multiple
    ? selected.length > 0
    : selected !== null

  const handleSubmit = async () => {
    setError('')
    setStatus('submitting')
    try {
      const choiceIds = question.allow_multiple ? selected : [selected]
      await Promise.all(choiceIds.map((choiceId) => submitVote(choiceId)))

      const results = await getSurveyResults(surveyId)
      const questionCounts = {}
      results
        .filter((row) => row.question_id === question.id)
        .forEach((row) => {
          questionCounts[row.id] = row.vote_count
        })
      setCounts(questionCounts)
      setStatus('voted')
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  return (
    <div className="question-card">
      <h2>{question.title}</h2>
      {question.description && <p className="muted">{question.description}</p>}
      {error && <p className="error">{error}</p>}
      <ul className="choice-list">
        {question.choices.map((choice) => (
          <li key={choice.id}>
            <label className="choice-option">
              <input
                type={question.allow_multiple ? 'checkbox' : 'radio'}
                name={`question-${question.id}`}
                disabled={status !== 'idle'}
                checked={
                  question.allow_multiple
                    ? selected.includes(choice.id)
                    : selected === choice.id
                }
                onChange={() => toggleChoice(choice.id)}
              />
              {choice.text}
              {counts && (
                <span className="muted"> — {counts[choice.id] ?? 0} votes</span>
              )}
            </label>
          </li>
        ))}
      </ul>
      {status === 'voted' ? (
        <p className="muted">Thanks for voting!</p>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!hasSelection || status === 'submitting'}
        >
          {status === 'submitting' ? 'Submitting…' : 'Vote'}
        </button>
      )}
    </div>
  )
}

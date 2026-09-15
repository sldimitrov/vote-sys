import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSurvey } from '../api/client'

let uid = 0
const nextId = () => `id-${++uid}`

const makeChoice = () => ({ key: nextId(), text: '' })
const makeQuestion = () => ({
  key: nextId(),
  title: '',
  description: '',
  allow_multiple: false,
  choices: [makeChoice(), makeChoice()],
})

export default function CreateSurvey() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState([makeQuestion()])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const updateQuestion = (qKey, patch) => {
    setQuestions((prev) =>
      prev.map((q) => (q.key === qKey ? { ...q, ...patch } : q)),
    )
  }

  const updateChoice = (qKey, cKey, text) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.key !== qKey
          ? q
          : {
              ...q,
              choices: q.choices.map((c) => (c.key === cKey ? { ...c, text } : c)),
            },
      ),
    )
  }

  const addQuestion = () => setQuestions((prev) => [...prev, makeQuestion()])
  const removeQuestion = (qKey) =>
    setQuestions((prev) => prev.filter((q) => q.key !== qKey))

  const addChoice = (qKey) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q.key === qKey ? { ...q, choices: [...q.choices, makeChoice()] } : q,
      ),
    )

  const removeChoice = (qKey, cKey) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q.key === qKey
          ? { ...q, choices: q.choices.filter((c) => c.key !== cKey) }
          : q,
      ),
    )

  const isValid =
    title.trim() !== '' &&
    questions.length > 0 &&
    questions.every(
      (q) =>
        q.title.trim() !== '' &&
        q.choices.length >= 2 &&
        q.choices.every((c) => c.text.trim() !== ''),
    )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) return

    setError('')
    setSubmitting(true)
    try {
      const payload = {
        title,
        questions: questions.map((q) => ({
          title: q.title,
          description: q.description,
          allow_multiple: q.allow_multiple,
          choices: q.choices.map((c) => ({ text: c.text })),
        })),
      }
      const survey = await createSurvey(payload)
      navigate(`/surveys/${survey.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <h1>New survey</h1>
      {error && <p className="error">{error}</p>}

      <form className="survey-form" onSubmit={handleSubmit}>
        <label>
          Survey title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>

        {questions.map((question, qIndex) => (
          <div className="question-builder" key={question.key}>
            <div className="question-builder-header">
              <h2>Question {qIndex + 1}</h2>
              {questions.length > 1 && (
                <button
                  type="button"
                  className="link-button"
                  onClick={() => removeQuestion(question.key)}
                >
                  Remove
                </button>
              )}
            </div>

            <label>
              Title
              <input
                value={question.title}
                onChange={(e) => updateQuestion(question.key, { title: e.target.value })}
                required
              />
            </label>

            <label>
              Description
              <input
                value={question.description}
                onChange={(e) =>
                  updateQuestion(question.key, { description: e.target.value })
                }
              />
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={question.allow_multiple}
                onChange={(e) =>
                  updateQuestion(question.key, { allow_multiple: e.target.checked })
                }
              />
              Allow multiple choices
            </label>

            <div className="choice-builder-list">
              {question.choices.map((choice, cIndex) => (
                <div className="choice-builder-row" key={choice.key}>
                  <input
                    placeholder={`Choice ${cIndex + 1}`}
                    value={choice.text}
                    onChange={(e) =>
                      updateChoice(question.key, choice.key, e.target.value)
                    }
                    required
                  />
                  {question.choices.length > 2 && (
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => removeChoice(question.key, choice.key)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="link-button"
                onClick={() => addChoice(question.key)}
              >
                + Add choice
              </button>
            </div>
          </div>
        ))}

        <button type="button" onClick={addQuestion}>
          + Add question
        </button>

        <button type="submit" disabled={!isValid || submitting}>
          {submitting ? 'Creating…' : 'Create survey'}
        </button>
      </form>
    </div>
  )
}

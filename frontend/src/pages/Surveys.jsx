import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSurveys } from '../api/client'
import { useAuth } from '../context/useAuth'
import EmptyState from '../components/EmptyState'

export default function Surveys() {
  const { isStaff } = useAuth()
  const [surveys, setSurveys] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSurveys()
      .then(setSurveys)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <div className="page-header">
        <h1>Surveys</h1>
        {isStaff && (
          <Link to="/surveys/new" className="button-link">
            + New survey
          </Link>
        )}
      </div>

      {loading && (
        <ul className="survey-list" aria-hidden="true">
          <li className="skeleton skeleton-row" />
          <li className="skeleton skeleton-row" />
          <li className="skeleton skeleton-row" />
        </ul>
      )}

      {!loading && error && <p className="error">{error}</p>}

      {!loading && !error && surveys.length === 0 && (
        <EmptyState
          title="No surveys yet"
          description={
            isStaff
              ? 'Create the first survey to get people voting.'
              : 'Check back soon — new surveys will show up here.'
          }
          action={
            isStaff && (
              <Link to="/surveys/new" className="button-link">
                Create a survey
              </Link>
            )
          }
        />
      )}

      {!loading && !error && surveys.length > 0 && (
        <ul className="survey-list">
          {surveys.map((survey) => (
            <li key={survey.id}>
              <Link to={`/surveys/${survey.id}`}>{survey.title}</Link>
              <span className="muted">
                {survey.questions.length} question
                {survey.questions.length === 1 ? '' : 's'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

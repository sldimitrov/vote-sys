import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSurveys } from '../api/client'

export default function Surveys() {
  const [surveys, setSurveys] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSurveys()
      .then(setSurveys)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="status">Loading surveys…</p>
  if (error) return <p className="error">{error}</p>

  return (
    <div className="page">
      <h1>Surveys</h1>
      {surveys.length === 0 ? (
        <p className="status">No surveys yet.</p>
      ) : (
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

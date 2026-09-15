import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSurvey } from '../api/client'
import QuestionVote from '../components/QuestionVote'

export default function SurveyDetail() {
  const { id } = useParams()
  const [survey, setSurvey] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSurvey(id)
      .then(setSurvey)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="status">Loading survey…</p>
  if (error) return <p className="error">{error}</p>
  if (!survey) return null

  return (
    <div className="page">
      <Link to="/surveys" className="back-link">
        ← Back to surveys
      </Link>
      <h1>{survey.title}</h1>
      {survey.questions.map((question) => (
        <QuestionVote key={question.id} surveyId={survey.id} question={question} />
      ))}
    </div>
  )
}

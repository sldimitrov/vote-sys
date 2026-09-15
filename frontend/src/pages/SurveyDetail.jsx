import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSurvey } from '../api/client'
import QuestionVote from '../components/QuestionVote'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import SuccessScreen from '../components/SuccessScreen'

export default function SurveyDetail() {
  const { id } = useParams()
  const [survey, setSurvey] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [answeredIds, setAnsweredIds] = useState(() => new Set())
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    getSurvey(id)
      .then(setSurvey)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!survey || survey.questions.length === 0) return undefined
    if (answeredIds.size !== survey.questions.length) return undefined

    const timer = setTimeout(() => setShowSuccess(true), 900)
    return () => clearTimeout(timer)
  }, [answeredIds, survey])

  const handleVoted = (questionId) => {
    setAnsweredIds((prev) => new Set(prev).add(questionId))
  }

  if (loading) {
    return (
      <div className="page">
        <Spinner label="Loading survey…" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <Link to="/surveys" className="back-link">
          ← Back to surveys
        </Link>
        <p className="error">{error}</p>
      </div>
    )
  }

  if (!survey) return null

  if (survey.questions.length === 0) {
    return (
      <div className="page">
        <Link to="/surveys" className="back-link">
          ← Back to surveys
        </Link>
        <EmptyState
          title={survey.title}
          description="This survey doesn't have any questions yet."
        />
      </div>
    )
  }

  if (showSuccess) {
    return (
      <SuccessScreen
        title="All done!"
        description={`Thanks for completing "${survey.title}".`}
      />
    )
  }

  return (
    <div className="page">
      <Link to="/surveys" className="back-link">
        ← Back to surveys
      </Link>
      <h1>{survey.title}</h1>
      {survey.questions.map((question, index) => (
        <QuestionVote
          key={question.id}
          surveyId={survey.id}
          question={question}
          index={index}
          onVoted={handleVoted}
        />
      ))}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SuccessScreen({
  title = 'All done!',
  description = 'Thanks for completing the survey.',
  redirectTo = '/surveys',
  delayMs = 3000,
}) {
  const navigate = useNavigate()
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(delayMs / 1000))

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate(redirectTo, { replace: true })
    }, delayMs)
    const tickTimer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => {
      clearTimeout(redirectTimer)
      clearInterval(tickTimer)
    }
  }, [navigate, redirectTo, delayMs])

  return (
    <div className="success-screen">
      <div className="success-icon" aria-hidden="true">
        ✓
      </div>
      <h1>{title}</h1>
      <p className="muted">{description}</p>
      <p className="muted">Redirecting to surveys in {secondsLeft}s…</p>
      <button type="button" onClick={() => navigate(redirectTo, { replace: true })}>
        Back to surveys now
      </button>
    </div>
  )
}

const API_URL = import.meta.env.VITE_API_URL

function getTokens() {
  return {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
  }
}

function setTokens({ access, refresh }) {
  if (access) localStorage.setItem('access', access)
  if (refresh) localStorage.setItem('refresh', refresh)
}

export function clearTokens() {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
}

async function refreshAccessToken() {
  const { refresh } = getTokens()
  if (!refresh) return null

  const res = await fetch(`${API_URL}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })

  if (!res.ok) {
    clearTokens()
    return null
  }

  const data = await res.json()
  setTokens({ access: data.access })
  return data.access
}

export async function apiRequest(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  if (auth) {
    const { access } = getTokens()
    if (access) headers.Authorization = `Bearer ${access}`
  }

  let res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401 && auth) {
    const newAccess = await refreshAccessToken()
    if (newAccess) {
      res = await fetch(`${API_URL}${path}`, {
        method,
        headers: { ...headers, Authorization: `Bearer ${newAccess}` },
        body: body ? JSON.stringify(body) : undefined,
      })
    }
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message =
      (data && (data.detail || Object.values(data).flat().join(' '))) ||
      `Request failed with status ${res.status}`
    throw new Error(message)
  }

  return data
}

export async function login(username, password) {
  const data = await apiRequest('/token/', {
    method: 'POST',
    body: { username, password },
    auth: false,
  })
  setTokens(data)
  return data
}

export async function register(username, email, password) {
  return apiRequest('/register/', {
    method: 'POST',
    body: { username, email, password },
    auth: false,
  })
}

export function getSurveys() {
  return apiRequest('/surveys/')
}

export function getSurvey(id) {
  return apiRequest(`/surveys/${id}/`)
}

export function submitVote(choiceId) {
  return apiRequest('/votes/', {
    method: 'POST',
    body: { choice: choiceId },
  })
}

export function getSurveyResults(surveyId) {
  return apiRequest(`/surveys/${surveyId}/results/`)
}

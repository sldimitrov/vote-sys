import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/useAuth'
import Login from './pages/Login'
import Register from './pages/Register'
import SurveyDetail from './pages/SurveyDetail'
import Surveys from './pages/Surveys'
import './App.css'

function NavBar() {
  const { isAuthenticated, logout } = useAuth()
  if (!isAuthenticated) return null

  return (
    <nav className="navbar">
      <span className="brand">vote-sys</span>
      <button type="button" onClick={logout}>
        Log out
      </button>
    </nav>
  )
}

function SurveyDetailRoute() {
  const { id } = useParams()
  return <SurveyDetail key={id} />
}

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/surveys" element={<Surveys />} />
          <Route path="/surveys/:id" element={<SurveyDetailRoute />} />
        </Route>
        <Route path="*" element={<Navigate to="/surveys" replace />} />
      </Routes>
    </>
  )
}

export default App

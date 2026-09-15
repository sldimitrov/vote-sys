import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import AdminRoute from './components/AdminRoute'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/useAuth'
import CreateSurvey from './pages/CreateSurvey'
import Login from './pages/Login'
import Register from './pages/Register'
import SurveyDetail from './pages/SurveyDetail'
import Surveys from './pages/Surveys'
import './App.css'

function NavBar() {
  const { isAuthenticated, isStaff, logout } = useAuth()
  if (!isAuthenticated) return null

  return (
    <nav className="navbar">
      <Link to="/surveys" className="brand">
        vote-sys
      </Link>
      <div className="navbar-actions">
        {isStaff && (
          <Link to="/surveys/new" className="nav-link">
            New survey
          </Link>
        )}
        <button type="button" onClick={logout}>
          Log out
        </button>
      </div>
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
          <Route element={<AdminRoute />}>
            <Route path="/surveys/new" element={<CreateSurvey />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/surveys" replace />} />
      </Routes>
    </>
  )
}

export default App

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function AdminRoute() {
  const { isStaff } = useAuth()
  return isStaff ? <Outlet /> : <Navigate to="/surveys" replace />
}

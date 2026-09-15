import { useMemo, useState } from 'react'
import * as api from '../api/client'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('access'),
  )
  const [isStaff, setIsStaff] = useState(() => !!api.getCurrentUser()?.isStaff)

  const login = async (username, password) => {
    await api.login(username, password)
    setIsAuthenticated(true)
    setIsStaff(!!api.getCurrentUser()?.isStaff)
  }

  const register = async (username, email, password) => {
    await api.register(username, email, password)
  }

  const logout = () => {
    api.clearTokens()
    setIsAuthenticated(false)
    setIsStaff(false)
  }

  const value = useMemo(
    () => ({ isAuthenticated, isStaff, login, register, logout }),
    [isAuthenticated, isStaff],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

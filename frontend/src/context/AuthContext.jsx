import { useMemo, useState } from 'react'
import * as api from '../api/client'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('access'),
  )

  const login = async (username, password) => {
    await api.login(username, password)
    setIsAuthenticated(true)
  }

  const register = async (username, email, password) => {
    await api.register(username, email, password)
  }

  const logout = () => {
    api.clearTokens()
    setIsAuthenticated(false)
  }

  const value = useMemo(
    () => ({ isAuthenticated, login, register, logout }),
    [isAuthenticated],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

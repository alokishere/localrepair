import { useCallback, useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import { AuthContext } from './auth-context'

const TOKEN_KEY = 'localrepair_token'
const USER_KEY = 'localrepair_user'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { return null } })
  const [profileComplete, setProfileComplete] = useState(null)
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    if (!token) { setLoading(false); return undefined }
    api.get('/auth/me').then(({ data }) => { setUser(data.data.user); setProfileComplete(data.data.profileComplete); localStorage.setItem(USER_KEY, JSON.stringify(data.data.user)) }).catch(() => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); setToken(null); setUser(null); setProfileComplete(null) }).finally(() => setLoading(false))
    return undefined
  }, [token])

  const login = useCallback(async (credentials) => { const { data } = await api.post('/auth/login', credentials); localStorage.setItem(TOKEN_KEY, data.data.token); localStorage.setItem(USER_KEY, JSON.stringify(data.data.user)); setToken(data.data.token); setUser(data.data.user); return data.data.user }, [])
  const register = useCallback(async (details) => { const { data } = await api.post('/auth/register', details); localStorage.setItem(TOKEN_KEY, data.data.token); localStorage.setItem(USER_KEY, JSON.stringify(data.data.user)); setToken(data.data.token); setUser(data.data.user); return data.data.user }, [])
  const logout = useCallback(async () => { try { if (token) await api.post('/auth/logout') } finally { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); setToken(null); setUser(null); setProfileComplete(null) } }, [token])
  const refreshUser = useCallback(async () => { const { data } = await api.get('/auth/me'); setUser(data.data.user); setProfileComplete(data.data.profileComplete); localStorage.setItem(USER_KEY, JSON.stringify(data.data.user)); return data.data.user }, [])
  const value = useMemo(() => ({ login, register, logout, refreshUser, user, profileComplete, isAuthenticated: Boolean(token && user), loading }), [token, user, profileComplete, loading, login, register, logout, refreshUser])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

import axios from 'axios'

const api = axios.create({
  baseURL: 'https://localrepairapi.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('localrepair_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api

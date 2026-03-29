import { auth } from './firebase'

const getHeaders = async () => {
  const user = auth.currentUser
  if (!user) return {}
  const token = await user.getIdToken()
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const headers = {
    ...await getHeaders(),
    ...(options.headers || {})
  } as HeadersInit

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  })

  // Basic error handling
  if (!response.ok) {
    let errorMsg = 'An error occurred'
    try {
      const errorData = await response.json()
      errorMsg = errorData.error || errorMsg
    } catch (e) {
      // JSON parse failed
    }
    throw new Error(errorMsg)
  }

  return response.json()
}

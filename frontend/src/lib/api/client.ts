import axios, { AxiosResponse } from 'axios'
import { getApiUrl } from '@/lib/config'

type TokenProvider = () => Promise<string | null>

let _getToken: TokenProvider | null = null

/**
 * Register a Clerk getToken function so the axios interceptor
 * can attach a Bearer JWT to every outgoing request.
 */
export function setAuthTokenProvider(provider: TokenProvider) {
  _getToken = provider
}

export async function getAuthToken(): Promise<string | null> {
  if (_getToken) {
    try {
      return await _getToken()
    } catch {
      return null
    }
  }
  return null
}

export const apiClient = axios.create({
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

apiClient.interceptors.request.use(async (config) => {
  if (!config.baseURL) {
    const apiUrl = await getApiUrl()
    config.baseURL = `${apiUrl}/api`
  }

  if (_getToken) {
    try {
      const token = await _getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Error getting auth token:', error)
    }
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  } else if (config.method && ['post', 'put', 'patch'].includes(config.method.toLowerCase())) {
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
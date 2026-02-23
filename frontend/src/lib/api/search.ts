import apiClient, { getAuthToken } from './client'
import { SearchRequest, SearchResponse, AskRequest } from '@/lib/types/search'

export const searchApi = {
  // Standard search (non-streaming)
  search: async (params: SearchRequest) => {
    const response = await apiClient.post<SearchResponse>('/search', params)
    return response.data
  },

  // Ask with streaming (uses relative URL for Docker compatibility)
  askKnowledgeBase: async (params: AskRequest) => {
    const token = await getAuthToken()

    const url = '/api/search/ask'

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify(params)
    })

    if (!response.ok) {
      // Try to extract error message from response
      let errorMessage = `HTTP error! status: ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.detail || errorData.message || errorMessage
      } catch {
        // If response isn't JSON, use status text
        errorMessage = response.statusText || errorMessage
      }
      throw new Error(errorMessage)
    }

    if (!response.body) {
      throw new Error('No response body received')
    }

    return response.body
  }
}

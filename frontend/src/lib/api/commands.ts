import apiClient from './client'

export interface CommandJobListItem {
  job_id: string
  app?: string
  name?: string
  status: string
  error_message?: string
  created?: string
  updated?: string
  args_preview?: string
}

export const commandsApi = {
  listJobs: async (params?: {
    command_filter?: string
    status_filter?: string
    limit?: number
  }) => {
    const response = await apiClient.get<CommandJobListItem[]>(
      '/commands/jobs',
      { params }
    )
    return response.data
  },

  getJobStatus: async (jobId: string) => {
    const response = await apiClient.get<{
      job_id: string
      status: string
      result?: Record<string, unknown>
      error_message?: string
      created?: string
      updated?: string
    }>(`/commands/jobs/${jobId}`)
    return response.data
  },
}

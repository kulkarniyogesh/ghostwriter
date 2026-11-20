import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Intercept errors and normalize them
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ||
      err.response?.data?.detail ||
      err.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

export const fetchRepo = (url) =>
  api.post('/fetch-repo', { url }).then((r) => r.data)

export const shareResult = (migrationResult) =>
  api.post('/share', { migration_result: migrationResult }).then((r) => r.data)

export const pushToGitHub = (token, repoName, files) =>
  api.post('/push-to-github', { token, repo_name: repoName, files }).then((r) => r.data)

export const getSharedResult = (shareId) =>
  api.get(`/share/${shareId}`).then((r) => r.data)

export default api

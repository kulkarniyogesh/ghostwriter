import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

function extractMessage(err) {
  // Log raw error for debugging
  console.error('[API Error]', err.response?.status, err.response?.data)

  if (!err.response?.data) return err.message || 'Request failed'

  const d = err.response.data

  // Plain string
  if (typeof d === 'string') return d

  // FastAPI validation error: { detail: [{ msg, loc, type }] }
  if (Array.isArray(d.detail)) {
    return d.detail.map((e) => e.msg || JSON.stringify(e)).join(', ')
  }

  // FastAPI string detail: { detail: "..." }
  if (typeof d.detail === 'string') return d.detail

  // Our custom HTTPException: { detail: { error: "...", code: "..." } }
  if (typeof d.detail === 'object' && !Array.isArray(d.detail)) {
    return d.detail.error || d.detail.message || JSON.stringify(d.detail)
  }

  // Our custom error: { error: "...", code: "..." }
  if (typeof d.error === 'string') return d.error

  // Object detail (nested)
  if (typeof d.detail === 'object') return JSON.stringify(d.detail)

  // Generic message field
  if (d.message) return String(d.message)

  // Last resort — show something useful not [object Object]
  return JSON.stringify(d)
}

// Intercept errors and normalize them
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(new Error(extractMessage(err)))
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

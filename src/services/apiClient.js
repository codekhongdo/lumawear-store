const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

export async function apiRequest(path, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 2500)
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      signal: controller.signal,
      ...options,
    })
    if (!response.ok) {
      let message = `API error ${response.status}`
      try {
        message = (await response.json()).detail || message
      } catch {
        // ignore JSON parse failure
      }
      throw new Error(message)
    }
    return response.status === 204 ? null : response.json()
  } finally {
    clearTimeout(timeout)
  }
}

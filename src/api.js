const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!response.ok) {
    let message = `API error ${response.status}`
    try { message = (await response.json()).detail || message } catch {}
    throw new Error(message)
  }
  return response.status === 204 ? null : response.json()
}

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== ''))
  const data = await request(`/products${query.toString() ? `?${query}` : ''}`)
  return data.items
}

export function fetchProduct(id) {
  return request(`/products/${id}`)
}

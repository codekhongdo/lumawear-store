import { LOCAL_PRODUCTS } from '../domain/catalog'
import { apiRequest } from './apiClient'

const localById = new Map(LOCAL_PRODUCTS.map((p) => [p.id, p]))
const localByCategory = new Map()
LOCAL_PRODUCTS.forEach((p) => {
  if (!localByCategory.has(p.category)) {
    localByCategory.set(p.category, p)
  }
})

/**
 * Adapter: Chuyển đổi DTO snake_case từ FastAPI sang Domain Model của Frontend.
 */
export function adaptProductDto(dto) {
  const ref =
    localById.get(dto.id) || localByCategory.get(dto.category) || LOCAL_PRODUCTS[0]
  return {
    ...ref,
    ...dto,
    oldPrice: dto.old_price ?? dto.oldPrice ?? ref.oldPrice ?? null,
    badge: dto.badge ?? '',
    swatches: dto.swatches || ref.swatches,
    sizes: dto.sizes || ref.sizes,
    image: dto.image || ref.image,
    fabric: dto.fabric || ref.fabric,
    description: dto.description || ref.description,
  }
}

/**
 * Repository Pattern: Ưu tiên đọc từ FastAPI backend, tự động fallback
 * sang LOCAL_PRODUCTS khi chạy tĩnh (ví dụ GitHub Pages).
 */
export const productRepository = {
  getFallback() {
    return LOCAL_PRODUCTS
  },

  async findAll(params = {}) {
    try {
      const query = new URLSearchParams(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
      )
      const data = await apiRequest(`/products${query.toString() ? `?${query}` : ''}`)
      if (Array.isArray(data?.items) && data.items.length > 0) {
        return data.items.map(adaptProductDto)
      }
      return LOCAL_PRODUCTS
    } catch {
      return LOCAL_PRODUCTS
    }
  },
}

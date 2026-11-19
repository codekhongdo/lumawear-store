/**
 * Strategy Pattern cho sắp xếp & lọc sản phẩm.
 */

const discountRatio = (p) => (p.oldPrice ? (p.oldPrice - p.price) / p.oldPrice : 0)

export const SORT_STRATEGIES = {
  featured: (a, b) => (b.sold || 0) - (a.sold || 0),
  new: (a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)),
  sale: (a, b) => discountRatio(b) - discountRatio(a),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
}

export function filterAndSortProducts(
  products,
  { category = 'Tất cả', query = '', sortBy = 'featured' } = {}
) {
  const q = query.trim().toLowerCase()
  const filtered = products.filter((product) => {
    const matchCategory = category === 'Tất cả' || product.category === category
    const matchQuery =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q) ||
      (product.description || '').toLowerCase().includes(q)
    return matchCategory && matchQuery
  })

  const comparator = SORT_STRATEGIES[sortBy] || SORT_STRATEGIES.featured
  return [...filtered].sort(comparator)
}

import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ProductCard } from '../components/commerce/ProductCard'
import { Button, EmptyState } from '../components/ui'
import { CATEGORIES, categoryPath } from '../domain/catalog'
import { filterAndSortProducts } from '../domain/productFilters'

export function ProductsPage({ products }) {
  const { search } = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(search)
  const rawCat = params.get('category') || 'Tất cả'
  const activeCat = CATEGORIES.includes(rawCat) ? rawCat : 'Tất cả'

  const [query, setQuery] = useState(params.get('q') || '')
  const [sortBy, setSortBy] = useState(params.get('sort') || 'featured')

  useEffect(() => {
    const nextParams = new URLSearchParams(search)
    setQuery(nextParams.get('q') || '')
    setSortBy(nextParams.get('sort') || 'featured')
  }, [search])

  const filtered = useMemo(
    () => filterAndSortProducts(products, { category: activeCat, query, sortBy }),
    [products, activeCat, query, sortBy]
  )

  const resetFilters = () => {
    setQuery('')
    navigate('/products')
  }

  return (
    <>
      <div className="catalog-header">
        <div className="container">
          <p className="eyebrow">LumaWear Collection</p>
          <h1>{activeCat === 'Tất cả' ? 'Tất cả thiết kế' : activeCat}</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
            Tuyển chọn trang phục tối giản, tinh xảo trong từng đường cắt và chất liệu.
          </p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="catalog-toolbar">
            <div className="category-pills">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-pill${
                    activeCat === cat ? ' category-pill--active' : ''
                  }`}
                  onClick={() => navigate(categoryPath(cat))}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="catalog-controls">
              <input
                className="ds-input"
                style={{ width: 210, height: 40 }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Lọc theo tên thiết kế..."
                aria-label="Lọc sản phẩm"
              />
              <select
                className="ds-select"
                style={{ width: 'auto', height: 40 }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sắp xếp sản phẩm"
              >
                <option value="featured">Sắp xếp: Phổ biến nhất</option>
                <option value="new">Hàng mới nhất</option>
                <option value="sale">Ưu đãi nhiều nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          <div className="results-meta">
            <span>Hiển thị {filtered.length} sản phẩm</span>
            {(activeCat !== 'Tất cả' || query) && (
              <button
                type="button"
                className="remove-link"
                style={{ margin: 0 }}
                onClick={resetFilters}
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title="Không tìm thấy thiết kế phù hợp"
              description="Hãy thử từ khóa khác hoặc xem toàn bộ bộ sưu tập của LumaWear."
              action={<Button onClick={resetFilters}>Xem tất cả sản phẩm</Button>}
            />
          ) : (
            <div className="product-grid">
              {filtered.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

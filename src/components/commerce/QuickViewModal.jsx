import React, { useEffect, useState } from 'react'
import { useCart } from '../../state/CartContext'
import { useUI } from '../../state/UIContext'
import { Button, Modal, PriceDisplay, SwatchPicker } from '../ui'

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct } = useUI()
  const { addItem } = useCart()
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedColor(quickViewProduct.swatches?.[0]?.name || 'Mặc định')
      setSelectedSize(quickViewProduct.sizes?.[0] || 'M')
    }
  }, [quickViewProduct])

  if (!quickViewProduct) return null

  return (
    <Modal
      open={Boolean(quickViewProduct)}
      onClose={() => setQuickViewProduct(null)}
      label={`Xem nhanh ${quickViewProduct.name}`}
    >
      <div className="quickview-grid">
        <div className="quickview-media">
          <img src={quickViewProduct.image} alt={quickViewProduct.name} />
        </div>

        <div className="quickview-body">
          <p className="eyebrow">{quickViewProduct.category}</p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              margin: '0 0 8px',
            }}
          >
            {quickViewProduct.name}
          </h2>
          <div style={{ marginBottom: 14 }}>
            <PriceDisplay
              price={quickViewProduct.price}
              oldPrice={quickViewProduct.oldPrice}
              size="lg"
            />
          </div>
          <p
            style={{
              color: 'var(--color-text-muted)',
              fontSize: 13.5,
              marginBottom: 20,
            }}
          >
            {quickViewProduct.description}
          </p>

          {quickViewProduct.swatches?.length > 0 && (
            <div className="option-group">
              <div className="option-label">
                Màu sắc <span>{selectedColor}</span>
              </div>
              <SwatchPicker
                swatches={quickViewProduct.swatches}
                value={selectedColor}
                onChange={setSelectedColor}
                size="md"
              />
            </div>
          )}

          <div className="option-group">
            <div className="option-label">
              Kích thước <span>{selectedSize}</span>
            </div>
            <div className="size-grid">
              {(quickViewProduct.sizes || ['S', 'M', 'L', 'XL']).map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-btn${
                    selectedSize === size ? ' size-btn--active' : ''
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gap: 10, marginTop: 24 }}>
            <Button
              fullWidth
              onClick={() => {
                addItem(quickViewProduct, {
                  color: selectedColor,
                  size: selectedSize,
                })
                setQuickViewProduct(null)
              }}
            >
              Thêm vào giỏ hàng
            </Button>
            <Button
              variant="outline"
              fullWidth
              to={`/product/${quickViewProduct.id}`}
              onClick={() => setQuickViewProduct(null)}
            >
              Xem chi tiết đầy đủ
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

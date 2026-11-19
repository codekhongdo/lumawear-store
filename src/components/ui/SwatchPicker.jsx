import React from 'react'

export function SwatchPicker({
  swatches = [],
  value,
  onChange,
  size = 'sm',
  showLabel = false,
}) {
  if (!swatches.length) return null
  const activeSwatch = swatches.find((s) => s.name === value) || swatches[0]

  return (
    <div className="ds-swatches">
      {swatches.map((swatch) => {
        const isActive = swatch.name === activeSwatch.name
        return (
          <button
            key={swatch.name}
            type="button"
            className={`ds-swatch ds-swatch--${size}${isActive ? ' ds-swatch--active' : ''}`}
            title={swatch.name}
            aria-label={`Chọn màu ${swatch.name}`}
            aria-pressed={isActive}
            onClick={() => onChange(swatch.name)}
          >
            <span className="ds-swatch__fill" style={{ background: swatch.hex }} />
          </button>
        )
      })}
      {showLabel && (
        <span className="ds-swatches__label">{activeSwatch.name}</span>
      )}
    </div>
  )
}

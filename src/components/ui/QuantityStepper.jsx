import React from 'react'

export function QuantityStepper({ value, onChange, min = 0 }) {
  return (
    <div className="ds-stepper">
      <button
        type="button"
        className="ds-stepper__btn"
        aria-label="Giảm số lượng"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        −
      </button>
      <span className="ds-stepper__value">{value}</span>
      <button
        type="button"
        className="ds-stepper__btn"
        aria-label="Tăng số lượng"
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  )
}

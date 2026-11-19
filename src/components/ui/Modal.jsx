import React from 'react'
import { useEscapeKey } from '../../hooks/useEscapeKey'

export function Modal({ open, onClose, label, children }) {
  useEscapeKey(open, onClose)

  if (!open) return null

  return (
    <div
      className="ds-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClose}
    >
      <div className="ds-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="ds-close-btn ds-modal__close"
          aria-label="Đóng"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

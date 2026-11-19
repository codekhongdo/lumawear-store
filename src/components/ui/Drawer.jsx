import React from 'react'
import { useEscapeKey } from '../../hooks/useEscapeKey'

export function Drawer({
  open,
  onClose,
  title,
  side = 'right',
  footer,
  children,
}) {
  useEscapeKey(open, onClose)

  if (!open) return null

  return (
    <div
      className={`ds-overlay ds-overlay--${side}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div className="ds-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="ds-drawer__header">
          <h2 className="ds-drawer__title">{title}</h2>
          <button
            type="button"
            className="ds-close-btn"
            aria-label="Đóng"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="ds-drawer__body">{children}</div>
        {footer && <div className="ds-drawer__footer">{footer}</div>}
      </div>
    </div>
  )
}

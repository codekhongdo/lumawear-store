import React from 'react'
import { useUI } from '../../state/UIContext'

export function ToastViewport() {
  const { toasts } = useUI()
  if (toasts.length === 0) return null

  return (
    <div className="ds-toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="ds-toast">
          {toast.message}
        </div>
      ))}
    </div>
  )
}

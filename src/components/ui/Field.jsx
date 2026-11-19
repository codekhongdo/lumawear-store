import React from 'react'

export function Field({ label, htmlFor, children }) {
  return (
    <div className="ds-field">
      {label && (
        <label className="ds-field__label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
    </div>
  )
}

import React from 'react'

export function Badge({ tone = 'dark', children, className = '' }) {
  return (
    <span className={`ds-badge ds-badge--${tone} ${className}`.trim()}>
      {children}
    </span>
  )
}

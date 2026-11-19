import React from 'react'

export function EmptyState({ title, description, action, compact = false }) {
  return (
    <div className={`ds-empty${compact ? ' ds-empty--compact' : ''}`}>
      <h3 className="ds-empty__title">{title}</h3>
      {description && <p className="ds-empty__desc">{description}</p>}
      {action}
    </div>
  )
}

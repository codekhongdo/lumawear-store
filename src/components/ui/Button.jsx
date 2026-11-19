import React from 'react'
import { Link } from 'react-router-dom'

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  to,
  className = '',
  type = 'button',
  children,
  ...rest
}) {
  const classes = [
    'ds-btn',
    `ds-btn--${variant}`,
    `ds-btn--${size}`,
    fullWidth ? 'ds-btn--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  )
}

export function IconButton({
  badge,
  badgeTone = 'dark',
  to,
  className = '',
  children,
  ...rest
}) {
  const classes = `ds-icon-btn ${className}`.trim()
  const content = (
    <>
      {children}
      {badge > 0 && (
        <span
          className={`ds-icon-btn__count${
            badgeTone === 'accent' ? ' ds-icon-btn__count--accent' : ''
          }`}
        >
          {badge}
        </span>
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  )
}

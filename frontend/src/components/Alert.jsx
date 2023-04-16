import React from 'react';
import Icon from './icons';

export default function Alert({
  variant = 'error',
  title,
  children,
  onRetry,
  retryLabel = 'Try again',
}) {
  const iconByVariant = {
    error: 'alert',
    success: 'checkCircle',
    info: 'info',
  };

  return (
    <div
      className={`alert alert-${variant}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <span className="alert-icon">
        <Icon name={iconByVariant[variant] || 'info'} size={18} />
      </span>
      <div className="alert-content">
        {title && <p className="alert-title">{title}</p>}
        {children && <div className="alert-text">{children}</div>}
      </div>
      {onRetry && (
        <button type="button" className="alert-retry" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  );
}

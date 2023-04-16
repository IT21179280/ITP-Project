import React from 'react';
import Icon from './icons';

export default function EmptyState({
  icon = 'search',
  title = 'No records found',
  message = 'Try changing your search term or filters.',
  children,
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon name={icon} size={24} />
      </div>
      <h4>{title}</h4>
      <p>{message}</p>
      {children && <div className="empty-actions">{children}</div>}
    </div>
  );
}

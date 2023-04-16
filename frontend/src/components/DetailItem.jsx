import React from 'react';
import Icon from './icons';

export default function DetailItem({ icon, label, value, children, full = false }) {
  return (
    <div className={`detail-item${full ? ' full' : ''}`}>
      {icon && (
        <span className="detail-icon">
          <Icon name={icon} size={15} />
        </span>
      )}
      <div className="detail-body">
        <span className="detail-label">{label}</span>
        <span className="detail-value">{children ?? value ?? '—'}</span>
      </div>
    </div>
  );
}

import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from './icons';
import { getPageMeta } from '../utils/pageMeta';

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const meta = getPageMeta(location.pathname);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="topbar">
      <button
        type="button"
        className="menu-button"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Icon name="menu" size={20} />
      </button>

      <div className="topbar-heading">
        <h1>{meta.title}</h1>
        <p>{meta.subtitle}</p>
      </div>

      <div className="topbar-right">
        <span className="topbar-date">{today}</span>
        <div className="topbar-user">
          <div className="avatar" aria-hidden="true">
            A
          </div>
          <div className="topbar-user-text">
            <strong>Administrator</strong>
            <span>System Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

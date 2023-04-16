import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Icon from './icons';
import { MODULES } from '../utils/constants';

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  const isActive = (module) => {
    if (module.path === '/') {
      return location.pathname === '/';
    }

    if (module.path === '/users') {
      return ['/users', '/staff', '/buyers'].some(
        (path) =>
          location.pathname === path || location.pathname.startsWith(`${path}/`)
      );
    }

    return location.pathname === module.path;
  };

  return (
    <aside className={`sidebar${open ? ' open' : ''}`} aria-label="Sidebar navigation">
      <div className="sidebar-brand">
        <div className="brand-mark">
          <Icon name="leaf" size={22} />
        </div>
        <div className="brand-text">
          <strong>Tea Factory</strong>
          <span>Management System</span>
        </div>
        <button
          type="button"
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">Main Menu</p>
        {MODULES.map((module) => (
          <NavLink
            key={module.key}
            to={module.path}
            end={module.path === '/'}
            className={`nav-item${isActive(module) ? ' active' : ''}`}
            onClick={onClose}
          >
            <Icon name={module.icon} size={19} />
            <span className="nav-text">{module.name}</span>
            {!module.available && <span className="nav-soon">Soon</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>Portfolio recreation</p>
        <span>User Management module only</span>
      </div>
    </aside>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/icons';

const MODULE_META = {
  vehicles: {
    name: 'Vehicle Management',
    icon: 'truck',
    summary:
      'The original system included vehicle registration, transport records and maintenance schedules.',
  },
  production: {
    name: 'Production Management',
    icon: 'factory',
    summary:
      'The original system included tea leaf collection, production batches and daily output records.',
  },
  machinery: {
    name: 'Machinery Management',
    icon: 'cog',
    summary:
      'The original system included machine registration, operating status and maintenance schedules.',
  },
  other: {
    name: 'Other Management',
    icon: 'grid',
    summary:
      'Additional factory administration features completed by other members of the group.',
  },
};

export default function Placeholder({ moduleKey }) {
  const meta = MODULE_META[moduleKey] || MODULE_META.other;

  return (
    <div className="placeholder-page">
      <section className="placeholder-card">
        <span className="placeholder-badge">Under Development</span>

        <div className="placeholder-icon">
          <Icon name={meta.icon} size={44} />
        </div>

        <h2>{meta.name}</h2>
        <p className="placeholder-message">
          This module is currently under development.
        </p>
        <p className="placeholder-note">
          {meta.summary} It formed part of the original university group project, but
          this portfolio recreation focuses only on the User Management module. No
          backend API, database collection or CRUD operations have been created for this
          section.
        </p>

        <div className="placeholder-actions">
          <Link to="/" className="btn btn-primary">
            <Icon name="arrowLeft" size={15} />
            Back to Dashboard
          </Link>
          <Link to="/users" className="btn btn-secondary">
            Go to User Management
          </Link>
        </div>
      </section>
    </div>
  );
}

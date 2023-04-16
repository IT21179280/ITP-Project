import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/icons';

export default function NotFound() {
  return (
    <div className="placeholder-page">
      <section className="placeholder-card">
        <div className="placeholder-icon">
          <Icon name="search" size={40} />
        </div>
        <h2>Page Not Found</h2>
        <p className="placeholder-message">
          The page you are looking for does not exist.
        </p>
        <p className="placeholder-note">
          Check the address or return to the dashboard to continue using the Tea Factory
          Management System.
        </p>
        <div className="placeholder-actions">
          <Link to="/" className="btn btn-primary">
            <Icon name="arrowLeft" size={15} />
            Back to Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}

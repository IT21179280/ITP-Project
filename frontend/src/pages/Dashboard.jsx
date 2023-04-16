import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import Icon from '../components/icons';
import StatCard from '../components/StatCard';
import { getDashboardStats } from '../services/dashboardService';
import { MODULE_DESCRIPTIONS, MODULES } from '../utils/constants';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getDashboardStats();
      setStats(result.data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const displayValue = (key) => {
    if (stats) return stats[key];
    return loading ? '...' : '—';
  };

  const systemModules = MODULES.filter((module) => module.key !== 'dashboard');

  return (
    <div className="page-stack">
      <section className="welcome-card">
        <div className="welcome-content">
          <span className="eyebrow">Tea Factory Management System</span>
          <h2>Welcome back, Administrator</h2>
          <p>
            This dashboard presents the complete module structure of the original
            university group project. The system concept covers staff and buyer accounts,
            vehicles, tea production and machinery. In this portfolio recreation, the
            User Management module is fully implemented; the remaining modules are
            interface placeholders.
          </p>
          <div className="welcome-actions">
            <Link to="/users" className="btn btn-primary">
              <Icon name="users" size={16} />
              Open User Management
            </Link>
            <Link to="/staff/new" className="btn btn-secondary">
              <Icon name="plus" size={16} />
              Add Staff Member
            </Link>
          </div>
        </div>
        <div className="welcome-illustration" aria-hidden="true">
          <Icon name="leaf" size={96} />
        </div>
      </section>

      {error && (
        <Alert
          title="Could not load dashboard statistics"
          onRetry={loadStats}
        >
          {error}
        </Alert>
      )}

      <div className="stat-grid">
        <StatCard
          icon="users"
          label="Total Staff"
          value={displayValue('totalStaff')}
          hint="All staff accounts"
        />
        <StatCard
          icon="user"
          label="Total Buyers"
          value={displayValue('totalBuyers')}
          hint="All buyer accounts"
        />
        <StatCard
          icon="checkCircle"
          label="Active Users"
          value={displayValue('activeUsers')}
          hint="Staff and buyers combined"
          tone="green"
        />
        <StatCard
          icon="alert"
          label="Inactive Users"
          value={displayValue('inactiveUsers')}
          hint="Deactivated accounts"
          tone="amber"
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <h3>System Modules</h3>
            <span className="panel-meta">{systemModules.length} modules</span>
          </div>
          <ul className="module-list">
            {systemModules.map((module) => (
              <li key={module.key}>
                <Link to={module.path} className="module-link">
                  <span className="module-icon">
                    <Icon name={module.icon} size={18} />
                  </span>
                  <span className="module-info">
                    <strong>{module.name}</strong>
                    <span>{MODULE_DESCRIPTIONS[module.key]}</span>
                  </span>
                  {module.available ? (
                    <span className="badge badge-active">Available</span>
                  ) : (
                    <span className="badge badge-muted">Under development</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>User Management</h3>
            <Link to="/users" className="panel-link">
              View module
            </Link>
          </div>
          <div className="summary-list">
            <div className="summary-row">
              <span>Staff accounts</span>
              <strong>{displayValue('totalStaff')}</strong>
            </div>
            <div className="summary-row">
              <span>Buyer accounts</span>
              <strong>{displayValue('totalBuyers')}</strong>
            </div>
            <div className="summary-row">
              <span>Active accounts</span>
              <strong>{displayValue('activeUsers')}</strong>
            </div>
            <div className="summary-row">
              <span>Inactive accounts</span>
              <strong>{displayValue('inactiveUsers')}</strong>
            </div>
          </div>
          <div className="panel-actions">
            <Link to="/staff" className="btn btn-secondary btn-block">
              Manage Staff
            </Link>
            <Link to="/buyers" className="btn btn-secondary btn-block">
              Manage Buyers
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

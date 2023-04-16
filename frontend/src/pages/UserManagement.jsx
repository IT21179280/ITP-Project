import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import Icon from '../components/icons';
import StatCard from '../components/StatCard';
import BuyerList from './buyers/BuyerList';
import StaffList from './staff/StaffList';
import { getDashboardStats } from '../services/dashboardService';

export default function UserManagement() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('staff');

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

  return (
    <div className="page-stack">
      <section className="intro-card">
        <div>
          <h2>User Management</h2>
          <p>
            Manage staff accounts and tea buyer / non-staff accounts. This is the fully
            functional module of the portfolio recreation, including search, filtering,
            validation, account activation and complete CRUD operations.
          </p>
        </div>
        <div className="intro-actions">
          <Link to="/staff/new" className="btn btn-primary">
            <Icon name="plus" size={16} />
            Add Staff
          </Link>
          <Link to="/buyers/new" className="btn btn-secondary">
            <Icon name="plus" size={16} />
            Add Buyer
          </Link>
        </div>
      </section>

      {error && (
        <Alert title="Could not load user statistics" onRetry={loadStats}>
          {error}
        </Alert>
      )}

      <div className="stat-grid">
        <StatCard
          icon="users"
          label="Total Staff Members"
          value={displayValue('totalStaff')}
          hint="Registered staff"
        />
        <StatCard
          icon="user"
          label="Total Buyers"
          value={displayValue('totalBuyers')}
          hint="Registered buyers"
        />
        <StatCard
          icon="checkCircle"
          label="Active Staff"
          value={displayValue('activeStaff')}
          hint="Staff with active accounts"
          tone="green"
        />
        <StatCard
          icon="checkCircle"
          label="Active Buyers"
          value={displayValue('activeBuyers')}
          hint="Buyers with active accounts"
          tone="green"
        />
      </div>

      <div className="tabs" role="tablist" aria-label="User categories">
        <button
          type="button"
          role="tab"
          id="staff-tab"
          aria-selected={activeTab === 'staff'}
          aria-controls="staff-panel"
          className={`tab${activeTab === 'staff' ? ' active' : ''}`}
          onClick={() => setActiveTab('staff')}
        >
          <Icon name="users" size={16} />
          Staff
          <span className="tab-count">{stats ? stats.totalStaff : '—'}</span>
        </button>
        <button
          type="button"
          role="tab"
          id="buyers-tab"
          aria-selected={activeTab === 'buyers'}
          aria-controls="buyers-panel"
          className={`tab${activeTab === 'buyers' ? ' active' : ''}`}
          onClick={() => setActiveTab('buyers')}
        >
          <Icon name="user" size={16} />
          Buyers / Non-Staff
          <span className="tab-count">{stats ? stats.totalBuyers : '—'}</span>
        </button>
      </div>

      {activeTab === 'staff' ? (
        <div role="tabpanel" id="staff-panel" aria-labelledby="staff-tab">
          <StaffList embedded onChanged={loadStats} />
        </div>
      ) : (
        <div role="tabpanel" id="buyers-panel" aria-labelledby="buyers-tab">
          <BuyerList embedded onChanged={loadStats} />
        </div>
      )}
    </div>
  );
}

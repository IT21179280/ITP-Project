import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../../components/Alert';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/EmptyState';
import Icon from '../../components/icons';
import Loader from '../../components/Loader';
import SearchBar from '../../components/SearchBar';
import StatusBadge from '../../components/StatusBadge';
import { useToast } from '../../components/ToastProvider';
import useDebounce from '../../hooks/useDebounce';
import { deleteStaff, getStaff, updateStaff } from '../../services/staffService';
import { DEPARTMENTS, STATUSES } from '../../utils/constants';

export default function StaffList({ embedded = false, onChanged }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const debouncedSearch = useDebounce(search, 350);
  const requestRef = useRef(0);
  const { showToast } = useToast();

  const loadStaff = useCallback(async () => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    setLoading(true);
    setError('');

    try {
      const result = await getStaff({
        search: debouncedSearch,
        status: statusFilter,
        department: departmentFilter,
      });

      if (requestRef.current === requestId) {
        setStaff(result.data);
      }
    } catch (loadError) {
      if (requestRef.current === requestId) {
        setError(loadError.message);
      }
    } finally {
      if (requestRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [debouncedSearch, statusFilter, departmentFilter]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const hasFilters = Boolean(search || statusFilter || departmentFilter);

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setDepartmentFilter('');
  };

  const handleToggleStatus = async (member) => {
    const nextStatus = member.accountStatus === 'Active' ? 'Inactive' : 'Active';
    setBusyId(member._id);

    try {
      const result = await updateStaff(member._id, { accountStatus: nextStatus });
      setStaff((current) =>
        current.map((item) => (item._id === member._id ? result.data : item))
      );
      showToast(
        `${member.fullName} has been ${nextStatus === 'Active' ? 'activated' : 'deactivated'}.`,
        'success'
      );
      onChanged?.();
    } catch (toggleError) {
      showToast(toggleError.message, 'error');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const result = await deleteStaff(deleteTarget._id);
      setDeleteTarget(null);
      showToast(result.message, 'success');
      await loadStaff();
      onChanged?.();
    } catch (deleteError) {
      showToast(deleteError.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={`list-section${embedded ? ' embedded' : ''}`}>
      <div className="table-card">
        <div className="table-toolbar">
          <div className="toolbar-filters">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search staff by name, ID or email..."
            />

            <select
              className="select-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter staff by account status"
            >
              <option value="">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              className="select-filter"
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              aria-label="Filter staff by department"
            >
              <option value="">All departments</option>
              {DEPARTMENTS.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>

            {hasFilters && (
              <button type="button" className="link-button" onClick={resetFilters}>
                Reset filters
              </button>
            )}
          </div>

          <div className="toolbar-actions">
            <span className="record-count">
              {loading
                ? 'Loading...'
                : `${staff.length} staff member${staff.length === 1 ? '' : 's'}`}
            </span>
            <Link to="/staff/new" className="btn btn-primary">
              <Icon name="plus" size={16} />
              Add Staff
            </Link>
          </div>
        </div>

        {loading ? (
          <Loader label="Loading staff members..." />
        ) : error ? (
          <div className="table-state">
            <Alert title="Could not load staff records" onRetry={loadStaff}>
              {error}
            </Alert>
          </div>
        ) : staff.length === 0 ? (
          <EmptyState
            icon="users"
            title={hasFilters ? 'No matching staff found' : 'No staff records yet'}
            message={
              hasFilters
                ? 'Try a different search term or reset the filters.'
                : 'Add the first staff account to get started.'
            }
          >
            {hasFilters ? (
              <button type="button" className="btn btn-secondary" onClick={resetFilters}>
                Reset filters
              </button>
            ) : (
              <Link to="/staff/new" className="btn btn-primary">
                <Icon name="plus" size={16} />
                Add Staff
              </Link>
            )}
          </EmptyState>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Staff ID</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member._id}>
                    <td>
                      <span className="id-tag">{member.staffId}</span>
                    </td>
                    <td>
                      <div className="cell-primary">{member.fullName}</div>
                      <div className="cell-secondary">@{member.username}</div>
                    </td>
                    <td>
                      <div className="cell-primary">{member.contactNumber}</div>
                      <div className="cell-secondary">{member.email}</div>
                    </td>
                    <td>{member.position}</td>
                    <td>{member.department}</td>
                    <td>
                      <StatusBadge status={member.accountStatus} />
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link
                          to={`/staff/${member._id}`}
                          className="icon-btn"
                          title="View staff details"
                          aria-label={`View details for ${member.fullName}`}
                        >
                          <Icon name="eye" size={15} />
                        </Link>
                        <Link
                          to={`/staff/${member._id}/edit`}
                          className="icon-btn"
                          title="Edit staff member"
                          aria-label={`Edit ${member.fullName}`}
                        >
                          <Icon name="edit" size={15} />
                        </Link>
                        <button
                          type="button"
                          className={`icon-btn ${
                            member.accountStatus === 'Active'
                              ? 'icon-btn-warn'
                              : 'icon-btn-success'
                          }`}
                          onClick={() => handleToggleStatus(member)}
                          disabled={busyId === member._id}
                          title={
                            member.accountStatus === 'Active'
                              ? 'Deactivate account'
                              : 'Activate account'
                          }
                          aria-label={`${
                            member.accountStatus === 'Active' ? 'Deactivate' : 'Activate'
                          } ${member.fullName}`}
                        >
                          <Icon name="power" size={15} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn icon-btn-danger"
                          onClick={() => setDeleteTarget(member)}
                          title="Delete staff member"
                          aria-label={`Delete ${member.fullName}`}
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete staff member"
        message={
          deleteTarget
            ? `Delete ${deleteTarget.fullName} (${deleteTarget.staffId})? This action cannot be undone.`
            : ''
        }
        busy={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

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
import { deleteBuyer, getBuyers, updateBuyer } from '../../services/buyerService';
import { STATUSES } from '../../utils/constants';

export default function BuyerList({ embedded = false, onChanged }) {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const debouncedSearch = useDebounce(search, 350);
  const requestRef = useRef(0);
  const { showToast } = useToast();

  const loadBuyers = useCallback(async () => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    setLoading(true);
    setError('');

    try {
      const result = await getBuyers({
        search: debouncedSearch,
        status: statusFilter,
      });

      if (requestRef.current === requestId) {
        setBuyers(result.data);
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
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    loadBuyers();
  }, [loadBuyers]);

  const hasFilters = Boolean(search || statusFilter);

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
  };

  const handleToggleStatus = async (buyer) => {
    const nextStatus = buyer.accountStatus === 'Active' ? 'Inactive' : 'Active';
    setBusyId(buyer._id);

    try {
      const result = await updateBuyer(buyer._id, { accountStatus: nextStatus });
      setBuyers((current) =>
        current.map((item) => (item._id === buyer._id ? result.data : item))
      );
      showToast(
        `${buyer.fullName} has been ${nextStatus === 'Active' ? 'activated' : 'deactivated'}.`,
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
      const result = await deleteBuyer(deleteTarget._id);
      setDeleteTarget(null);
      showToast(result.message, 'success');
      await loadBuyers();
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
              placeholder="Search buyers by name, ID or email..."
            />

            <select
              className="select-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter buyers by account status"
            >
              <option value="">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
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
                : `${buyers.length} buyer${buyers.length === 1 ? '' : 's'}`}
            </span>
            <Link to="/buyers/new" className="btn btn-primary">
              <Icon name="plus" size={16} />
              Add Buyer
            </Link>
          </div>
        </div>

        {loading ? (
          <Loader label="Loading buyers..." />
        ) : error ? (
          <div className="table-state">
            <Alert title="Could not load buyer records" onRetry={loadBuyers}>
              {error}
            </Alert>
          </div>
        ) : buyers.length === 0 ? (
          <EmptyState
            icon="user"
            title={hasFilters ? 'No matching buyers found' : 'No buyer records yet'}
            message={
              hasFilters
                ? 'Try a different search term or reset the filters.'
                : 'Add the first buyer account to get started.'
            }
          >
            {hasFilters ? (
              <button type="button" className="btn btn-secondary" onClick={resetFilters}>
                Reset filters
              </button>
            ) : (
              <Link to="/buyers/new" className="btn btn-primary">
                <Icon name="plus" size={16} />
                Add Buyer
              </Link>
            )}
          </EmptyState>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Buyer ID</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {buyers.map((buyer) => (
                  <tr key={buyer._id}>
                    <td>
                      <span className="id-tag">{buyer.buyerId}</span>
                    </td>
                    <td>
                      <div className="cell-primary">{buyer.fullName}</div>
                      <div className="cell-secondary">@{buyer.username}</div>
                    </td>
                    <td>
                      <div className="cell-primary">{buyer.contactNumber}</div>
                      <div className="cell-secondary">{buyer.email}</div>
                    </td>
                    <td>
                      <span className="cell-address" title={buyer.address}>
                        {buyer.address}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={buyer.accountStatus} />
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link
                          to={`/buyers/${buyer._id}`}
                          className="icon-btn"
                          title="View buyer details"
                          aria-label={`View details for ${buyer.fullName}`}
                        >
                          <Icon name="eye" size={15} />
                        </Link>
                        <Link
                          to={`/buyers/${buyer._id}/edit`}
                          className="icon-btn"
                          title="Edit buyer"
                          aria-label={`Edit ${buyer.fullName}`}
                        >
                          <Icon name="edit" size={15} />
                        </Link>
                        <button
                          type="button"
                          className={`icon-btn ${
                            buyer.accountStatus === 'Active'
                              ? 'icon-btn-warn'
                              : 'icon-btn-success'
                          }`}
                          onClick={() => handleToggleStatus(buyer)}
                          disabled={busyId === buyer._id}
                          title={
                            buyer.accountStatus === 'Active'
                              ? 'Deactivate account'
                              : 'Activate account'
                          }
                          aria-label={`${
                            buyer.accountStatus === 'Active' ? 'Deactivate' : 'Activate'
                          } ${buyer.fullName}`}
                        >
                          <Icon name="power" size={15} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn icon-btn-danger"
                          onClick={() => setDeleteTarget(buyer)}
                          title="Delete buyer"
                          aria-label={`Delete ${buyer.fullName}`}
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
        title="Delete buyer"
        message={
          deleteTarget
            ? `Delete ${deleteTarget.fullName} (${deleteTarget.buyerId})? This action cannot be undone.`
            : ''
        }
        busy={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

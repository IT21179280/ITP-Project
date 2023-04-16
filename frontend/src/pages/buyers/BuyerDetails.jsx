import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Alert from '../../components/Alert';
import ConfirmDialog from '../../components/ConfirmDialog';
import DetailItem from '../../components/DetailItem';
import Icon from '../../components/icons';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';
import { useToast } from '../../components/ToastProvider';
import {
  deleteBuyer,
  getBuyerById,
  updateBuyer,
} from '../../services/buyerService';
import { formatDateTime, getInitials } from '../../utils/format';

export default function BuyerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [toggling, setToggling] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    const loadBuyer = async () => {
      setLoading(true);
      setLoadError('');

      try {
        const result = await getBuyerById(id);
        if (active) setBuyer(result.data);
      } catch (error) {
        if (active) setLoadError(error.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadBuyer();

    return () => {
      active = false;
    };
  }, [id]);

  const handleToggleStatus = async () => {
    if (!buyer) return;
    const nextStatus = buyer.accountStatus === 'Active' ? 'Inactive' : 'Active';
    setToggling(true);

    try {
      const result = await updateBuyer(buyer._id, { accountStatus: nextStatus });
      setBuyer(result.data);
      showToast(
        `${buyer.fullName} has been ${nextStatus === 'Active' ? 'activated' : 'deactivated'}.`,
        'success'
      );
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!buyer) return;
    setDeleting(true);

    try {
      const result = await deleteBuyer(buyer._id);
      showToast(result.message, 'success');
      navigate('/buyers');
    } catch (error) {
      showToast(error.message, 'error');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="panel">
        <Loader label="Loading buyer..." />
      </div>
    );
  }

  if (loadError || !buyer) {
    return (
      <div className="page-stack">
        <Alert title="Could not load buyer">
          {loadError || 'The requested buyer record could not be found.'}
        </Alert>
        <div>
          <Link to="/buyers" className="btn btn-secondary">
            <Icon name="arrowLeft" size={15} />
            Back to Buyers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div>
        <Link to="/buyers" className="back-link">
          <Icon name="arrowLeft" size={14} />
          Back to Buyers
        </Link>
      </div>

      <section className="profile-card">
        <div className="profile-main">
          <div className="profile-avatar" aria-hidden="true">
            {getInitials(buyer.fullName)}
          </div>
          <div>
            <div className="profile-title-row">
              <h2>{buyer.fullName}</h2>
              <StatusBadge status={buyer.accountStatus} />
            </div>
            <p>Tea buyer account &middot; Non-staff user</p>
            <span className="id-tag">{buyer.buyerId}</span>
          </div>
        </div>

        <div className="profile-actions">
          <Link to={`/buyers/${buyer._id}/edit`} className="btn btn-primary">
            <Icon name="edit" size={15} />
            Edit
          </Link>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleToggleStatus}
            disabled={toggling}
          >
            <Icon name="power" size={15} />
            {toggling
              ? 'Updating...'
              : buyer.accountStatus === 'Active'
                ? 'Deactivate'
                : 'Activate'}
          </button>
          <button
            type="button"
            className="btn btn-danger-outline"
            onClick={() => setConfirmOpen(true)}
          >
            <Icon name="trash" size={15} />
            Delete
          </button>
        </div>
      </section>

      <div className="detail-layout">
        <section className="panel">
          <div className="panel-header">
            <h3>Personal &amp; Contact Information</h3>
          </div>
          <div className="detail-grid">
            <DetailItem icon="mail" label="Email Address" value={buyer.email} />
            <DetailItem icon="user" label="Username" value={`@${buyer.username}`} />
            <DetailItem
              icon="phone"
              label="Contact Number"
              value={buyer.contactNumber}
            />
            <DetailItem
              icon="mapPin"
              label="Address"
              value={buyer.address}
              full
            />
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>Account Information</h3>
          </div>
          <div className="detail-grid single">
            <DetailItem icon="hash" label="Buyer ID" value={buyer.buyerId} />
            <DetailItem
              icon="shield"
              label="Account Status"
              value={<StatusBadge status={buyer.accountStatus} />}
            />
            <DetailItem
              icon="calendar"
              label="Created"
              value={formatDateTime(buyer.createdAt)}
            />
            <DetailItem
              icon="refresh"
              label="Last Updated"
              value={formatDateTime(buyer.updatedAt)}
            />
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete buyer"
        message={`Delete ${buyer.fullName} (${buyer.buyerId})? This action cannot be undone.`}
        busy={deleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

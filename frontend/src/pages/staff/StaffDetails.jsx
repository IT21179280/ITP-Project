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
  deleteStaff,
  getStaffById,
  updateStaff,
} from '../../services/staffService';
import { formatDateTime, getInitials } from '../../utils/format';

export default function StaffDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [toggling, setToggling] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    const loadStaffMember = async () => {
      setLoading(true);
      setLoadError('');

      try {
        const result = await getStaffById(id);
        if (active) setStaff(result.data);
      } catch (error) {
        if (active) setLoadError(error.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadStaffMember();

    return () => {
      active = false;
    };
  }, [id]);

  const handleToggleStatus = async () => {
    if (!staff) return;
    const nextStatus = staff.accountStatus === 'Active' ? 'Inactive' : 'Active';
    setToggling(true);

    try {
      const result = await updateStaff(staff._id, { accountStatus: nextStatus });
      setStaff(result.data);
      showToast(
        `${staff.fullName} has been ${nextStatus === 'Active' ? 'activated' : 'deactivated'}.`,
        'success'
      );
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!staff) return;
    setDeleting(true);

    try {
      const result = await deleteStaff(staff._id);
      showToast(result.message, 'success');
      navigate('/staff');
    } catch (error) {
      showToast(error.message, 'error');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="panel">
        <Loader label="Loading staff member..." />
      </div>
    );
  }

  if (loadError || !staff) {
    return (
      <div className="page-stack">
        <Alert title="Could not load staff member">
          {loadError || 'The requested staff record could not be found.'}
        </Alert>
        <div>
          <Link to="/staff" className="btn btn-secondary">
            <Icon name="arrowLeft" size={15} />
            Back to Staff
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div>
        <Link to="/staff" className="back-link">
          <Icon name="arrowLeft" size={14} />
          Back to Staff
        </Link>
      </div>

      <section className="profile-card">
        <div className="profile-main">
          <div className="profile-avatar" aria-hidden="true">
            {getInitials(staff.fullName)}
          </div>
          <div>
            <div className="profile-title-row">
              <h2>{staff.fullName}</h2>
              <StatusBadge status={staff.accountStatus} />
            </div>
            <p>
              {staff.position} &middot; {staff.department}
            </p>
            <span className="id-tag">{staff.staffId}</span>
          </div>
        </div>

        <div className="profile-actions">
          <Link to={`/staff/${staff._id}/edit`} className="btn btn-primary">
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
              : staff.accountStatus === 'Active'
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
            <DetailItem icon="mail" label="Email Address" value={staff.email} />
            <DetailItem icon="user" label="Username" value={`@${staff.username}`} />
            <DetailItem
              icon="phone"
              label="Contact Number"
              value={staff.contactNumber}
            />
            <DetailItem icon="users" label="Gender" value={staff.gender} />
            <DetailItem
              icon="mapPin"
              label="Address"
              value={staff.address}
              full
            />
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>Employment Information</h3>
          </div>
          <div className="detail-grid single">
            <DetailItem icon="hash" label="Staff ID" value={staff.staffId} />
            <DetailItem icon="briefcase" label="Position" value={staff.position} />
            <DetailItem icon="factory" label="Department" value={staff.department} />
            <DetailItem
              icon="shield"
              label="Account Status"
              value={<StatusBadge status={staff.accountStatus} />}
            />
            <DetailItem
              icon="calendar"
              label="Created"
              value={formatDateTime(staff.createdAt)}
            />
            <DetailItem
              icon="refresh"
              label="Last Updated"
              value={formatDateTime(staff.updatedAt)}
            />
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete staff member"
        message={`Delete ${staff.fullName} (${staff.staffId})? This action cannot be undone.`}
        busy={deleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

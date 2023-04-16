import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Alert from '../../components/Alert';
import FormField from '../../components/FormField';
import Icon from '../../components/icons';
import Loader from '../../components/Loader';
import { useToast } from '../../components/ToastProvider';
import {
  createBuyer,
  getBuyerById,
  updateBuyer,
} from '../../services/buyerService';
import { STATUSES } from '../../utils/constants';
import { validateBuyerForm } from '../../utils/validation';

const emptyForm = {
  fullName: '',
  username: '',
  email: '',
  contactNumber: '',
  address: '',
  password: '',
  confirmPassword: '',
  accountStatus: 'Active',
};

const mapBuyerToForm = (buyer) => ({
  fullName: buyer.fullName,
  username: buyer.username,
  email: buyer.email,
  contactNumber: buyer.contactNumber,
  address: buyer.address,
  password: '',
  confirmPassword: '',
  accountStatus: buyer.accountStatus,
});

export default function BuyerForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState(emptyForm);
  const [buyerId, setBuyerId] = useState('');
  const [errors, setErrors] = useState({});
  const [pageError, setPageError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return undefined;

    let active = true;

    const loadBuyer = async () => {
      setLoading(true);
      setLoadError('');

      try {
        const result = await getBuyerById(id);
        if (!active) return;
        setBuyerId(result.data.buyerId);
        setForm(mapBuyerToForm(result.data));
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
  }, [id, isEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateBuyerForm(form, { isEdit });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setPageError('Please correct the highlighted fields.');
      const firstField = Object.keys(validationErrors)[0];
      document.getElementById(firstField)?.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const payload = {
      fullName: form.fullName.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      contactNumber: form.contactNumber.trim(),
      address: form.address.trim(),
      accountStatus: form.accountStatus,
    };

    if (form.password) {
      payload.password = form.password;
    }

    setSaving(true);
    setPageError('');
    setErrors({});

    try {
      if (isEdit) {
        const result = await updateBuyer(id, payload);
        showToast(result.message || 'Buyer updated successfully.', 'success');
        navigate(`/buyers/${id}`);
      } else {
        const result = await createBuyer(payload);
        showToast(result.message || 'Buyer added successfully.', 'success');
        navigate(`/buyers/${result.data._id}`);
      }
    } catch (error) {
      setPageError(error.message);
      if (error.errors && Object.keys(error.errors).length > 0) {
        setErrors(error.errors);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <Link to="/buyers" className="back-link">
            <Icon name="arrowLeft" size={14} />
            Back to Buyers
          </Link>
          <h2>{isEdit ? 'Edit Buyer' : 'Add New Buyer'}</h2>
          <p>
            {isEdit
              ? 'Update this buyer account. Leave the password fields blank to keep the current password.'
              : 'Create a buyer account for a tea purchaser or non-staff system user.'}
          </p>
        </div>
        {isEdit && buyerId && <span className="id-tag large">{buyerId}</span>}
      </div>

      {loading ? (
        <div className="panel">
          <Loader label="Loading buyer..." />
        </div>
      ) : loadError ? (
        <div className="page-stack">
          <Alert title="Could not load buyer">{loadError}</Alert>
          <div>
            <Link to="/buyers" className="btn btn-secondary">
              <Icon name="arrowLeft" size={15} />
              Back to Buyers
            </Link>
          </div>
        </div>
      ) : (
        <form className="form-card" onSubmit={handleSubmit} noValidate>
          {pageError && <Alert title="Unable to save buyer">{pageError}</Alert>}

          <fieldset className="form-section">
            <legend>Buyer Information</legend>
            <div className="form-grid">
              <FormField
                label="Full Name"
                htmlFor="fullName"
                required
                error={errors.fullName}
              >
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="input"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Mohamed Rizwan"
                  maxLength={80}
                  autoComplete="name"
                />
              </FormField>

              <FormField
                label="Username"
                htmlFor="username"
                required
                error={errors.username}
                hint="4-20 characters: letters, numbers, dots or underscores."
              >
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="input"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="e.g. rizwan.buyer"
                  maxLength={20}
                  autoComplete="username"
                />
              </FormField>

              <FormField
                label="Email Address"
                htmlFor="email"
                required
                error={errors.email}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </FormField>

              <FormField
                label="Contact Number"
                htmlFor="contactNumber"
                required
                error={errors.contactNumber}
                hint="Use 9-15 digits. Spaces, + and - are allowed."
              >
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  className="input"
                  value={form.contactNumber}
                  onChange={handleChange}
                  placeholder="e.g. 0771234567"
                  maxLength={18}
                  autoComplete="tel"
                />
              </FormField>

              <FormField
                label="Address"
                htmlFor="address"
                required
                error={errors.address}
                full
              >
                <textarea
                  id="address"
                  name="address"
                  className="input"
                  rows={2}
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street, city"
                  maxLength={200}
                  autoComplete="street-address"
                />
              </FormField>

              <FormField
                label="Account Status"
                htmlFor="accountStatus"
                error={errors.accountStatus}
                hint="Inactive accounts cannot use the system."
              >
                <select
                  id="accountStatus"
                  name="accountStatus"
                  className="input"
                  value={form.accountStatus}
                  onChange={handleChange}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </fieldset>

          <fieldset className="form-section">
            <legend>Account Security</legend>
            <p className="section-note">
              Passwords are hashed with bcrypt before being stored. Stored passwords are
              never returned by the API.
            </p>
            <div className="form-grid">
              <FormField
                label={isEdit ? 'New Password' : 'Password'}
                htmlFor="password"
                required={!isEdit}
                error={errors.password}
                hint={
                  isEdit
                    ? 'Leave blank to keep the current password.'
                    : 'Minimum 6 characters.'
                }
              >
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="input"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={isEdit ? 'Enter a new password' : 'At least 6 characters'}
                  autoComplete="new-password"
                />
              </FormField>

              <FormField
                label="Confirm Password"
                htmlFor="confirmPassword"
                required={!isEdit}
                error={errors.confirmPassword}
              >
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="input"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter the password"
                  autoComplete="new-password"
                />
              </FormField>
            </div>
          </fieldset>

          <div className="form-actions">
            <Link to={isEdit ? `/buyers/${id}` : '/buyers'} className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Buyer'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Alert from '../../components/Alert';
import FormField from '../../components/FormField';
import Icon from '../../components/icons';
import Loader from '../../components/Loader';
import { useToast } from '../../components/ToastProvider';
import {
  createStaff,
  getStaffById,
  updateStaff,
} from '../../services/staffService';
import { DEPARTMENTS, GENDERS, POSITIONS, STATUSES } from '../../utils/constants';
import { validateStaffForm } from '../../utils/validation';

const emptyForm = {
  fullName: '',
  username: '',
  email: '',
  contactNumber: '',
  address: '',
  gender: '',
  position: '',
  department: '',
  password: '',
  confirmPassword: '',
  accountStatus: 'Active',
};

const mapStaffToForm = (staff) => ({
  fullName: staff.fullName,
  username: staff.username,
  email: staff.email,
  contactNumber: staff.contactNumber,
  address: staff.address,
  gender: staff.gender,
  position: staff.position,
  department: staff.department,
  password: '',
  confirmPassword: '',
  accountStatus: staff.accountStatus,
});

export default function StaffForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState(emptyForm);
  const [staffId, setStaffId] = useState('');
  const [errors, setErrors] = useState({});
  const [pageError, setPageError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return undefined;

    let active = true;

    const loadStaffMember = async () => {
      setLoading(true);
      setLoadError('');

      try {
        const result = await getStaffById(id);
        if (!active) return;
        setStaffId(result.data.staffId);
        setForm(mapStaffToForm(result.data));
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

    const validationErrors = validateStaffForm(form, { isEdit });

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
      gender: form.gender,
      position: form.position,
      department: form.department,
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
        const result = await updateStaff(id, payload);
        showToast(result.message || 'Staff member updated successfully.', 'success');
        navigate(`/staff/${id}`);
      } else {
        const result = await createStaff(payload);
        showToast(result.message || 'Staff member added successfully.', 'success');
        navigate(`/staff/${result.data._id}`);
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

  const positionOptions =
    form.position && !POSITIONS.includes(form.position)
      ? [form.position, ...POSITIONS]
      : POSITIONS;

  const departmentOptions =
    form.department && !DEPARTMENTS.includes(form.department)
      ? [form.department, ...DEPARTMENTS]
      : DEPARTMENTS;

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <Link to="/staff" className="back-link">
            <Icon name="arrowLeft" size={14} />
            Back to Staff
          </Link>
          <h2>{isEdit ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
          <p>
            {isEdit
              ? 'Update the account details below. Leave the password fields blank to keep the current password.'
              : 'Create a staff account and assign the relevant employment details.'}
          </p>
        </div>
        {isEdit && staffId && <span className="id-tag large">{staffId}</span>}
      </div>

      {loading ? (
        <div className="panel">
          <Loader label="Loading staff member..." />
        </div>
      ) : loadError ? (
        <div className="page-stack">
          <Alert title="Could not load staff member">{loadError}</Alert>
          <div>
            <Link to="/staff" className="btn btn-secondary">
              <Icon name="arrowLeft" size={15} />
              Back to Staff
            </Link>
          </div>
        </div>
      ) : (
        <form className="form-card" onSubmit={handleSubmit} noValidate>
          {pageError && <Alert title="Unable to save staff member">{pageError}</Alert>}

          <fieldset className="form-section">
            <legend>Personal Information</legend>
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
                  placeholder="e.g. Nuwan Perera"
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
                  placeholder="e.g. nuwan.perera"
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
                  placeholder="name@teafactory.lk"
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
                label="Gender"
                htmlFor="gender"
                required
                error={errors.gender}
              >
                <select
                  id="gender"
                  name="gender"
                  className="input"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  {GENDERS.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
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
            </div>
          </fieldset>

          <fieldset className="form-section">
            <legend>Employment Details</legend>
            <div className="form-grid">
              <FormField
                label="Position"
                htmlFor="position"
                required
                error={errors.position}
              >
                <select
                  id="position"
                  name="position"
                  className="input"
                  value={form.position}
                  onChange={handleChange}
                >
                  <option value="">Select position</option>
                  {positionOptions.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Department"
                htmlFor="department"
                required
                error={errors.department}
              >
                <select
                  id="department"
                  name="department"
                  className="input"
                  value={form.department}
                  onChange={handleChange}
                >
                  <option value="">Select department</option>
                  {departmentOptions.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
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
            <Link to={isEdit ? `/staff/${id}` : '/staff'} className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving
                ? 'Saving...'
                : isEdit
                  ? 'Save Changes'
                  : 'Add Staff Member'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

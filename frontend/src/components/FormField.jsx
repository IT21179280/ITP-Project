import React from 'react';

export default function FormField({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  full = false,
  children,
}) {
  return (
    <div className={`form-field${full ? ' full' : ''}${error ? ' has-error' : ''}`}>
      <label htmlFor={htmlFor}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      {children}
      {error ? (
        <p className="field-error">{error}</p>
      ) : hint ? (
        <p className="field-hint">{hint}</p>
      ) : null}
    </div>
  );
}

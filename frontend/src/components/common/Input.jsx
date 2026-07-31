import React, { useId } from 'react';

export const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  required = false,
  disabled = false,
  className = '',
  id,
  ariaLabel,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`input-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label} {required && <span className="text-required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {Icon && <Icon className="input-icon" />}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={ariaLabel || label || placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`input-field ${Icon ? 'with-icon' : ''}`}
          {...props}
        />
      </div>
      {error && (
        <span id={`${inputId}-error`} className="input-error-msg" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

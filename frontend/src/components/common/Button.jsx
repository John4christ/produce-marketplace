import React from 'react';
import { BiLoaderAlt } from 'react-icons/bi';

export const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost', 'amber'
  size = 'md', // 'sm', 'md', 'lg'
  isLoading = false,
  isDisabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
  icon: Icon,
  ariaLabel,
  className = '',
  ...props
}) => {
  const handleClick = (e) => {
    if (isLoading || isDisabled) return;
    if (onClick) onClick(e);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled || isLoading}
      aria-label={ariaLabel || (typeof children === 'string' ? children : 'button')}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${isLoading ? 'btn-loading' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="btn-spinner">
          <BiLoaderAlt className="animate-spin" />
        </span>
      ) : (
        <>
          {Icon && <Icon className="btn-icon" />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

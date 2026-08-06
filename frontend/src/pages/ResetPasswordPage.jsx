import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { TbLeaf } from 'react-icons/tb';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { toast } from 'react-toastify';
import { isValidEmail } from '../utils/validators';
import { apiClient } from '../services/api';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [formData, setFormData] = useState({
    email: emailParam,
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token. Please request a new password reset link.');
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email address is required.';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your password.';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors below.');
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post('/auth/reset-password', {
        token,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      setIsSuccess(true);
      toast.success('Password reset successfully! You can now log in.');
    } catch (error) {
      const msg = error.message || 'Unable to reset password. The token may be invalid or expired.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-banner glass-panel">
          <div className="auth-banner-content">
            <Link to="/" className="brand-logo mb-6">
              <div className="logo-icon-bg">
                <TbLeaf className="logo-icon" />
              </div>
              <span className="brand-name">
                Agri<span className="brand-highlight">Harvest</span>
              </span>
            </Link>

            <h2 className="auth-banner-title">
              Fresh Local Produce Picked at Dawn.
            </h2>
            <p className="auth-banner-desc">
              Enter a new password for your account to regain secure access to your produce dashboard.
            </p>

            <div className="auth-trust-list">
              <div className="trust-row">
                <FiCheckCircle className="icon-green" /> Secure password reset
              </div>
              <div className="trust-row">
                <FiShield className="icon-green" /> 256-bit Encrypted SSL Security
              </div>
              <div className="trust-row">
                <FiInfo className="icon-green" /> Link expires in 60 minutes
              </div>
            </div>
          </div>
        </div>

        <div className="auth-card glass-panel">
          {isSuccess ? (
            <>
              <div className="auth-header text-center">
                <div className="auth-success-icon">
                  <FiCheckCircle className="icon-green icon-xl" />
                </div>
                <h1 className="auth-title">Password Changed</h1>
                <p className="auth-subtitle">Your password has been successfully updated. You can now sign in with your new password.</p>
              </div>

              <div className="auth-success-actions">
                <Link to="/login" className="btn btn-primary btn-lg btn-full">
                  Sign In to Your Account
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="auth-header text-center">
                <h1 className="auth-title">Reset Password</h1>
                <p className="auth-subtitle">Enter your new password below to continue</p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="auth-form">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={FiMail}
                  required
                  disabled={isLoading}
                  ariaLabel="Email address"
                />

                <div className="password-input-wrapper">
                  <Input
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter new password (min 8 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    icon={FiLock}
                    required
                    disabled={isLoading}
                    ariaLabel="New password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                <div className="password-input-wrapper">
                  <Input
                    label="Confirm New Password"
                    type={showConfirm ? 'text' : 'password'}
                    name="password_confirmation"
                    placeholder="Confirm new password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    error={errors.password_confirmation}
                    icon={FiLock}
                    required
                    disabled={isLoading}
                    ariaLabel="Confirm new password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                  >
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  icon={FiArrowRight}
                >
                  Reset Password
                </Button>
              </form>

              <div className="auth-footer text-center">
                <p>
                  Remember your password?{' '}
                  <Link to="/login" className="auth-register-link">
                    Back to Sign In
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

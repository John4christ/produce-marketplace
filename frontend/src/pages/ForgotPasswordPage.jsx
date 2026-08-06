import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowRight, FiShield, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { TbLeaf } from 'react-icons/tb';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { toast } from 'react-toastify';
import { isValidEmail } from '../utils/validators';
import { sanitizeInput } from '../utils/sanitize';
import { apiClient } from '../services/api';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const validateForm = () => {
    const sanitized = sanitizeInput(email);
    if (!sanitized) {
      setError('Email address is required.');
      return false;
    }
    if (!isValidEmail(sanitized)) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post('/auth/forgot-password', { email: sanitizeInput(email) });

      setIsSubmitted(true);
      toast.success('If an account exists with this email, a password reset link has been sent.');
    } catch {
      toast.error('Unable to send reset link. Please try again.');
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
              Enter your email below and we'll send you a secure link to reset your password and regain access to your account.
            </p>

            <div className="auth-trust-list">
              <div className="trust-row">
                <FiCheckCircle className="icon-green" /> Secure password reset process
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
          {isSubmitted ? (
            <>
              <div className="auth-header text-center">
                <div className="auth-success-icon">
                  <FiCheckCircle className="icon-green icon-xl" />
                </div>
                <h1 className="auth-title">Check Your Email</h1>
                <p className="auth-subtitle">
                  If an account exists for <strong>{sanitizeInput(email)}</strong>, a password reset link has been sent to your inbox.
                </p>
              </div>

              <div className="auth-info-box">
                <p className="auth-info-text">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>

              <div className="auth-submit-again">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                >
                  Send Another Reset Link
                </Button>
              </div>

              <div className="auth-footer text-center">
                <p>
                  <Link to="/login" className="auth-register-link">
                    Back to Sign In
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="auth-header text-center">
                <h1 className="auth-title">Forgot Password?</h1>
                <p className="auth-subtitle">Enter your email to receive a password reset link</p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="auth-form">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={handleChange}
                  error={error}
                  icon={FiMail}
                  required
                  disabled={isLoading}
                  ariaLabel="Email address"
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  icon={FiArrowRight}
                >
                  Send Reset Link
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

export default ForgotPasswordPage;

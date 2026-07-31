import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiArrowRight,
  FiShield,
  FiShoppingBag,
  FiCheck
} from 'react-icons/fi';
import { TbLeaf, TbTractor, TbBuildingStore } from 'react-icons/tb';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { isValidEmail } from '../utils/validators';
import { sanitizeInput } from '../utils/sanitize';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'buyer', // 'buyer' | 'farmer' | 'vendor'
    agreedToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password Strength Calculation Helper
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
      case 2:
        return { score: 25, label: 'Weak', color: '#ef4444' };
      case 3:
        return { score: 50, label: 'Fair', color: '#f59e0b' };
      case 4:
        return { score: 75, label: 'Good', color: '#3b82f6' };
      case 5:
        return { score: 100, label: 'Strong & Secure', color: '#22c55e' };
      default:
        return { score: 0, label: '', color: '' };
    }
  };

  const pwdStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, userType: role }));
  };

  const validateForm = () => {
    const newErrors = {};
    const sanitizedName = sanitizeInput(formData.fullName);
    const sanitizedEmail = sanitizeInput(formData.email);
    const sanitizedPhone = sanitizeInput(formData.phone);

    if (!sanitizedName) {
      newErrors.fullName = 'Full Name is required.';
    } else if (sanitizedName.length < 2) {
      newErrors.fullName = 'Please enter your real full name.';
    }

    if (!sanitizedEmail) {
      newErrors.email = 'Email address is required.';
    } else if (!isValidEmail(sanitizedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!sanitizedPhone) {
      newErrors.phone = 'Phone number is required for farm order SMS alerts.';
    } else if (!/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(sanitizedPhone)) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the Terms of Service & Privacy Policy.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please resolve form errors before registering.');
      return;
    }

    setIsLoading(true);

    // Simulate API User Registration Request
    setTimeout(() => {
      setIsLoading(false);
      const mockNewUser = {
        id: `user-${Date.now()}`,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.userType,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
      };

      login(mockNewUser, `jwt_token_register_${Date.now()}`);
      toast.success(
        `🎉 Account created successfully as a ${formData.userType.toUpperCase()}! Welcome to AgriHarvest!`,
        { autoClose: 3000 }
      );
      navigate('/');
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-container register-container">
        {/* Left Side Visual Banner */}
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
              Join 15,000+ Conscious Buyers & Local Organic Farmers.
            </h2>
            <p className="auth-banner-desc">
              Create an account to shop farm-fresh harvests, list your agricultural produce, or partner as a wholesale local vendor.
            </p>

            <div className="auth-trust-list">
              <div className="trust-row">
                <FiCheckCircle className="icon-green" /> 100% Direct Farm Traceability
              </div>
              <div className="trust-row">
                <FiCheckCircle className="icon-green" /> Fair Pricing: 85% revenue to growers
              </div>
              <div className="trust-row">
                <FiShield className="icon-green" /> Zero Middlemen & Verified Organic
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Registration Form Card */}
        <div className="auth-card glass-panel">
          <div className="auth-header text-center">
            <h1 className="auth-title">Create an Account</h1>
            <p className="auth-subtitle">Choose your account type and start harvesting fresh produce</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="auth-form">
            {/* User Type Selection Cards */}
            <div className="user-type-selector">
              <label className="input-label mb-2">Account Type <span className="text-required">*</span></label>
              <div className="role-cards-grid">
                <button
                  type="button"
                  className={`role-card ${formData.userType === 'buyer' ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect('buyer')}
                >
                  <FiShoppingBag className="role-icon" />
                  <span className="role-title">Buyer</span>
                  <span className="role-desc">Shop fresh produce</span>
                  {formData.userType === 'buyer' && <FiCheck className="role-check" />}
                </button>

                <button
                  type="button"
                  className={`role-card ${formData.userType === 'farmer' ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect('farmer')}
                >
                  <TbTractor className="role-icon" />
                  <span className="role-title">Farmer</span>
                  <span className="role-desc">Sell farm crops</span>
                  {formData.userType === 'farmer' && <FiCheck className="role-check" />}
                </button>

                <button
                  type="button"
                  className={`role-card ${formData.userType === 'vendor' ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect('vendor')}
                >
                  <TbBuildingStore className="role-icon" />
                  <span className="role-title">Vendor</span>
                  <span className="role-desc">Wholesale supply</span>
                  {formData.userType === 'vendor' && <FiCheck className="role-check" />}
                </button>
              </div>
            </div>

            {/* Full Name */}
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="e.g. Alex Rivera"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              icon={FiUser}
              required
              disabled={isLoading}
            />

            {/* Email Address */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="alex.rivera@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={FiMail}
              required
              disabled={isLoading}
            />

            {/* Phone Number */}
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="+1 (555) 019-2834"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              icon={FiPhone}
              required
              disabled={isLoading}
            />

            {/* Password Field */}
            <div className="password-input-wrapper">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create a strong password..."
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={FiLock}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="pwd-strength-meter">
                  <div className="strength-bar-bg">
                    <div
                      className="strength-bar-fill"
                      style={{
                        width: `${pwdStrength.score}%`,
                        backgroundColor: pwdStrength.color
                      }}
                    />
                  </div>
                  <span className="strength-label" style={{ color: pwdStrength.color }}>
                    Strength: {pwdStrength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="password-input-wrapper">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Re-enter password..."
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={FiLock}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="input-group">
              <label className="remember-me-label">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="checkbox-custom"
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="forgot-password-link">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="forgot-password-link">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreedToTerms && (
                <span className="input-error-msg">{errors.agreedToTerms}</span>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              icon={FiArrowRight}
            >
              Create Account
            </Button>
          </form>

          <div className="auth-footer text-center">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-register-link">
                Sign In here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

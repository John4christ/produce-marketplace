import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield, FiCheckCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { TbLeaf } from 'react-icons/tb';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { isValidEmail } from '../utils/validators';
import { sanitizeInput } from '../utils/sanitize';
import axios from "axios";
export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};
    const sanitizedEmail = sanitizeInput(formData.email);

    if (!sanitizedEmail) {
      newErrors.email = 'Email address is required.';
    } else if (!isValidEmail(sanitizedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    toast.error("Please fix the errors.");
    return;
  }

  setIsLoading(true);

  try {
    const response = await axios.post(
  `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
  {
    email: formData.email,
    password: formData.password,
  }
);

const user = response.data.data.user;
const token = response.data.data.token;
    login(user, token);

    toast.success("Login successful!");

    if (user.roles.includes("farmer")) {
      navigate("/farmer-dashboard");
    } else if (user.roles.includes("admin")) {
      navigate("/admin-dashboard");
    } else {
      navigate("/dashboard");
    }
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Unable to connect to the server.");
    }
  } finally {
    setIsLoading(false);
  }
};

  const handleSocialLogin = (provider) => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
    window.location.href = `${backendUrl}/auth/${provider}/redirect`;
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
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
              Fresh Local Produce Picked at Dawn.
            </h2>
            <p className="auth-banner-desc">
              Log in to your marketplace account to manage your organic farm subscriptions, track field harvests, and order straight from local growers.
            </p>

            <div className="auth-trust-list">
              <div className="trust-row">
                <FiCheckCircle className="icon-green" /> 100% Direct Farm Traceability
              </div>
              <div className="trust-row">
                <FiCheckCircle className="icon-green" /> Eco-Friendly sugarcane packaging
              </div>
              <div className="trust-row">
                <FiShield className="icon-green" /> 256-bit Encrypted SSL Security
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form Card */}
        <div className="auth-card glass-panel">
          <div className="auth-header text-center">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to access your fresh produce dashboard</p>
          </div>

          {/* Social Logins */}
          <div className="social-buttons-grid">
            <button
              type="button"
              className="btn btn-social btn-google"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              aria-label="Sign in with Google"
            >
              <FcGoogle className="social-icon" />
              <span>Google</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>or sign in with email</span>
          </div>

          <form onSubmit={handleSubmit} noValidate className="auth-form">
            {/* Email Field */}
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
            />

            {/* Password Field with Eye Toggle */}
            <div className="password-input-wrapper">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
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
                tabIndex={0}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="auth-options flex-between">
              <label className="remember-me-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="checkbox-custom"
                />
                <span>Remember me</span>
              </label>

              <Link to="/forgot-password" className="forgot-password-link">
                Forgot password?
              </Link>
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
              Sign In to Account
            </Button>
          </form>

          <div className="auth-footer text-center">
            <p>
              Don't have an account yet?{' '}
              <Link to="/register" className="auth-register-link">
                Register as Buyer or Farmer
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

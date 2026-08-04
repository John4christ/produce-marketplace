import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  FiCheck,
} from "react-icons/fi";
import { TbLeaf, TbTractor } from "react-icons/tb";
import axios from "axios";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { isValidEmail } from "../utils/validators";
import { sanitizeInput } from "../utils/sanitize";
import { resizeImage } from "../utils/resizeImage";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "buyer",
    agreedToTerms: false,
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "" };

    let score = 0;

    if (pwd.length >= 8) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    switch (score) {
      case 1:
      case 2:
        return {
          score: 25,
          label: "Weak",
          color: "#ef4444",
        };

      case 3:
        return {
          score: 50,
          label: "Fair",
          color: "#f59e0b",
        };

      case 4:
        return {
          score: 75,
          label: "Good",
          color: "#3b82f6",
        };

      case 5:
        return {
          score: 100,
          label: "Strong",
          color: "#22c55e",
        };

      default:
        return {
          score: 0,
          label: "",
          color: "",
        };
    }
  };

  const pwdStrength = getPasswordStrength(formData.password);

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({
      ...prev,
      userType: role,
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resized = await resizeImage(file, 400, 0.9);
      setAvatarFile(resized.file);
      setAvatarPreview(resized.preview);
    } catch (err) {
      toast.error('Failed to process image. Please try another file.');
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!sanitizeInput(formData.fullName)) {
      newErrors.fullName = "Full name is required.";
    }

    if (!isValidEmail(formData.email)) {
      newErrors.email = "Enter a valid email.";
    }

    if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms =
        "You must accept the Terms.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please resolve the errors.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = new FormData();
      payload.append('name', formData.fullName);
      payload.append('email', formData.email);
      payload.append('password', formData.password);
      payload.append('password_confirmation', formData.confirmPassword);
      payload.append('role', formData.userType);
      if (avatarFile) {
        payload.append('avatar', avatarFile);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        payload
      );

      const user = response.data.data.user;
      const token = response.data.data.token;

      login(user, token);

      toast.success("Registration successful!");

      if (user.roles.includes("farmer")) {
        navigate("/farmer-dashboard");
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
  return (
  <div className="auth-page">
    <div className="auth-container register-container">

      {/* Left Banner */}
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
            Join Thousands of Farmers and Buyers
          </h2>

          <p className="auth-banner-desc">
            Buy fresh farm produce directly from trusted farmers or
            register as a farmer and sell your products to customers
            across the country.
          </p>

          <div className="auth-trust-list">
            <div className="trust-row">
              <FiCheckCircle className="icon-green" />
              Verified Farmers
            </div>

            <div className="trust-row">
              <FiCheckCircle className="icon-green" />
              Secure Payments
            </div>

            <div className="trust-row">
              <FiShield className="icon-green" />
              Protected Accounts
            </div>
          </div>
        </div>
      </div>

      {/* Registration Card */}
      <div className="auth-card glass-panel">

        <div className="auth-header text-center">
          <h1 className="auth-title">
            Create an Account
          </h1>

          <p className="auth-subtitle">
            Choose whether you want to buy or sell fresh produce.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
          noValidate
        >

          {/* Account Type */}

          <div className="user-type-selector">

            <label className="input-label">
              Account Type
            </label>

            <div className="role-cards-grid">

              {/* Buyer */}

              <button
                type="button"
                className={`role-card ${
                  formData.userType === "buyer"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handleRoleSelect("buyer")
                }
              >
                <FiShoppingBag
                  className="role-icon"
                  size={30}
                />

                <span className="role-title">
                  Buyer
                </span>

                <span className="role-desc">
                  Purchase fresh farm produce.
                </span>

                {formData.userType === "buyer" && (
                  <FiCheck className="role-check" />
                )}
              </button>

              {/* Farmer */}

              <button
                type="button"
                className={`role-card ${
                  formData.userType === "farmer"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handleRoleSelect("farmer")
                }
              >
                <TbTractor
                  className="role-icon"
                  size={30}
                />

                <span className="role-title">
                  Farmer
                </span>

                <span className="role-desc">
                  Sell your farm products.
                </span>

                {formData.userType === "farmer" && (
                  <FiCheck className="role-check" />
                )}
              </button>

            </div>
          </div>

          {/* Avatar Upload */}
          <div className="input-group">
            <label className="input-label">Profile Picture (optional)</label>
            <div className="avatar-upload-row">
              <div className="avatar-preview">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" />
                ) : (
                  <div className="avatar-placeholder">
                    <FiUser />
                  </div>
                )}
              </div>
              <div className="avatar-upload-controls">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  className="file-input"
                  id="avatar-upload"
                />
                <label htmlFor="avatar-upload" className="btn btn-outline btn-sm">
                  Choose Image
                </label>
                <p className="text-muted text-sm">JPG, PNG or WebP. Max 2MB. Square images work best.</p>
                {errors.avatar && <span className="input-error-msg">{errors.avatar}</span>}
              </div>
            </div>
          </div>

          {/* Full Name */}
          <Input
            label="Full Name"
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            icon={FiUser}
            required
            disabled={isLoading}
          />

          {/* Email */}
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={FiMail}
            required
            disabled={isLoading}
          />

          {/* Phone */}
          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            placeholder="08012345678"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            icon={FiPhone}
            disabled={isLoading}
          />

          {/* Password */}
          <div className="password-input-wrapper">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
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
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>

            {formData.password && (
              <div className="pwd-strength-meter">

                <div className="strength-bar-bg">
                  <div
                    className="strength-bar-fill"
                    style={{
                      width: `${pwdStrength.score}%`,
                      backgroundColor: pwdStrength.color,
                    }}
                  />
                </div>

                <span
                  className="strength-label"
                  style={{
                    color: pwdStrength.color,
                  }}
                >
                  {pwdStrength.label}
                </span>

              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="password-input-wrapper">

            <Input
              label="Confirm Password"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              placeholder="Confirm password"
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
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword ? (
                <FiEyeOff />
              ) : (
                <FiEye />
              )}
            </button>

          </div>

          {/* Terms */}

          <div className="input-group">

            <label className="remember-me-label">

              <input
                type="checkbox"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                disabled={isLoading}
              />

              <span>
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="forgot-password-link"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="forgot-password-link"
                >
                  Privacy Policy
                </Link>
              </span>

            </label>

            {errors.agreedToTerms && (
              <span className="input-error-msg">
                {errors.agreedToTerms}
              </span>
            )}

          </div>
                    {/* Register Button */}

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

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="social-login-grid">
            <Button
              type="button"
              variant="outline"
              size="md"
              fullWidth
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, '')}/auth/google/redirect`;
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.3v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l2.85 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              fullWidth
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, '')}/auth/facebook/redirect`;
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div>

        </form>

        {/* Footer */}

        <div className="auth-footer text-center">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="auth-register-link"
            >
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  </div>
);
};
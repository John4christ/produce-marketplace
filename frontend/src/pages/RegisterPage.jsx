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
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
      {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: formData.userType,
      }
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

      console.log(error.response.data);
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
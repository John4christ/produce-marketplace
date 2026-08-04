import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiShoppingBag,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiSearch,
  FiUser,
  FiLogOut,
  FiUserPlus,
  FiShield
} from 'react-icons/fi';
import { TbLeaf } from 'react-icons/tb';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';

export const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [avatarError, setAvatarError] = useState(false);

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(navSearch);
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const userRole = user?.roles?.[0]?.slug || 'buyer';
  const avatarUrl = user?.avatar || null;
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  return (
    <header className="navbar-sticky glass-panel">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" aria-label="AgriHarvest Home">
          <div className="logo-icon-bg">
            <TbLeaf className="logo-icon" />
          </div>
          <span className="brand-name">
            Agri<span className="brand-highlight">Harvest</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <Link to="/" className="nav-link active">Home</Link>
          <Link to="/dashboard" className="nav-link">Fresh Produce</Link>
          <a href="#meet-farmers" className="nav-link">Our Farmers</a>
          <a href="#about-us" className="nav-link">Eco-Mission</a>
        </nav>

        {/* Right Header Controls */}
        <div className="nav-actions">
          {/* Quick Search */}
          <form className="nav-search-form" onSubmit={handleNavSearch}>
            <FiSearch className="nav-search-icon" />
            <input
              type="text"
              placeholder="Search produce..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="nav-search-input"
            />
          </form>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <FiSun className="icon-sun" /> : <FiMoon className="icon-moon" />}
          </button>

          {/* Cart Icon Counter */}
          <Link to="/cart" className="cart-btn" aria-label={`Cart with ${cartCount} items`}>
            <FiShoppingBag className="cart-icon" />
            {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
          </Link>

          {/* Authentication & User Account Menu */}
          {isAuthenticated && user ? (
            <div className="user-menu-wrapper">
              <button
                className="user-profile-badge"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-label="User account menu"
              >
                <div className="user-avatar-tiny" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: avatarUrl && !avatarError ? 'transparent' : 'var(--color-primary)', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', fontSize: '14px', fontWeight: 600, overflow: 'hidden' }}>
                  {avatarUrl && !avatarError ? (
                    <img
                      key={avatarUrl}
                      src={avatarUrl}
                      alt={user.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={handleAvatarError}
                    />
                  ) : (
                    userInitial
                  )}
                </div>
                <div className="user-meta-desktop">
                  <span className="user-name-sm">{user.name.split(' ')[0]}</span>
                  <Badge variant="primary" size="sm">
                    {userRole.toUpperCase()}
                  </Badge>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="user-dropdown glass-panel">
                  <div className="dropdown-user-header">
                    <p className="dropdown-user-name">{user.name}</p>
                    <p className="dropdown-user-email">{user.email}</p>
                  </div>
                  <div className="dropdown-divider" />
                  {userRole === 'admin' && (
                    <Link to="/admin-dashboard" className="dropdown-item">
                      <FiShield /> <span>Admin Dashboard</span>
                    </Link>
                  )}
                  {userRole === 'farmer' && (
                    <Link to="/farmer-dashboard" className="dropdown-item">
                      <FiUser /> <span>Farmer Dashboard</span>
                    </Link>
                  )}
                  {userRole === 'buyer' && (
                    <Link to="/dashboard" className="dropdown-item">
                      <FiShoppingBag /> <span>Buyer Dashboard</span>
                    </Link>
                  )}
                  <div className="dropdown-divider" />
                  <button className="dropdown-item red-text" onClick={handleLogout}>
                    <FiLogOut /> <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-nav-buttons">
              <Link to="/login" className="btn btn-outline btn-sm">
                <FiUser /> <span>Sign In</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <FiUserPlus /> <span>Register</span>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer glass-panel">
          <nav className="mobile-nav-links">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Fresh Produce</Link>
            <a href="#meet-farmers" onClick={() => setMobileMenuOpen(false)}>Our Farmers</a>
            <a href="#about-us" onClick={() => setMobileMenuOpen(false)}>Eco-Mission</a>
            <div className="mobile-auth-links mt-4">
              {isAuthenticated ? (
                <div className="flex-column gap-2">
                  {userRole === 'admin' && (
                    <Link to="/admin-dashboard" className="btn btn-outline btn-full" onClick={() => setMobileMenuOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  {userRole === 'farmer' && (
                    <Link to="/farmer-dashboard" className="btn btn-outline btn-full" onClick={() => setMobileMenuOpen(false)}>
                      Farmer Dashboard
                    </Link>
                  )}
                  {userRole === 'buyer' && (
                    <Link to="/dashboard" className="btn btn-outline btn-full" onClick={() => setMobileMenuOpen(false)}>
                      Buyer Dashboard
                    </Link>
                  )}
                  <button className="btn btn-outline btn-full" onClick={handleLogout}>
                    <FiLogOut /> Sign Out ({user?.name})
                  </button>
                </div>
              ) : (
                <div className="flex-column gap-2">
                  <Link to="/login" className="btn btn-outline btn-full" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-full" onClick={() => setMobileMenuOpen(false)}>
                    Register Account
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};


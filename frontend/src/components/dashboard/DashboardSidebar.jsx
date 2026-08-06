import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiGrid,
  FiShoppingBag,
  FiHeart,
  FiPackage,
  FiBell,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { TbLeaf } from 'react-icons/tb';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Avatar from '../common/Avatar';

export const DashboardSidebar = ({ isCollapsed, onToggleCollapse, wishlistCount = 0, ordersCount, notificationsCount }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { cartCount } = useCart();

  const navItems = [
    { label: 'Overview', icon: FiGrid, path: '/dashboard', badge: null },
    { label: 'Fresh Catalog', icon: FiShoppingBag, path: '/catalog', badge: null },
    { label: 'My Orders', icon: FiPackage, path: '/orders', badge: ordersCount > 0 ? ordersCount : null },
    { label: 'Saved Wishlist', icon: FiHeart, path: '/wishlist', badge: wishlistCount > 0 ? wishlistCount : null },
    { label: 'Notifications', icon: FiBell, path: '/notifications', badge: notificationsCount > 0 ? notificationsCount : null },
    { label: 'Account Settings', icon: FiSettings, path: '/settings', badge: null }
  ];

  return (
    <aside className={`dashboard-sidebar glass-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <Link to="/" className="brand-logo">
          <div className="logo-icon-bg">
            <TbLeaf className="logo-icon" />
          </div>
          {!isCollapsed && (
            <span className="brand-name">
              Agri<span className="brand-highlight">Harvest</span>
            </span>
          )}
        </Link>

        <button
          className="sidebar-toggle-btn"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      {!isCollapsed && user && (
        <div className="sidebar-user-pill">
          <Avatar
            src={user.avatar}
            name={user.name}
            alt={user.name}
            className="pill-avatar"
            fallbackBg="var(--color-primary)"
            fallbackSize={16}
            fallbackWeight={600}
          />
          <div className="pill-meta">
            <span className="pill-name">{user.name}</span>
            <span className="pill-role">Buyer Dashboard</span>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard');
          return (
            <Link
              key={idx}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="nav-item-icon" />
              {!isCollapsed && <span className="nav-item-label">{item.label}</span>}
              {!isCollapsed && item.badge && (
                <span className="nav-item-badge">{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout-btn" onClick={logout} title={isCollapsed ? 'Sign Out' : undefined}>
          <FiLogOut className="logout-icon" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

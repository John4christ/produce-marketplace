import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiGrid,
  FiPackage,
  FiTrendingUp,
  FiDollarSign,
  FiBell,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiPlusCircle
} from 'react-icons/fi';
import { TbLeaf, TbTractor } from 'react-icons/tb';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';

export const FarmerSidebar = ({ isCollapsed, onToggleCollapse, onOpenAddModal, cropsCount, ordersCount }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { label: 'Farm Overview', icon: FiGrid, path: '/farmer-dashboard', badge: null },
    { label: 'Crops & Inventory', icon: TbTractor, path: '/farmer/crops', badge: cropsCount > 0 ? cropsCount : null },
    { label: 'Orders to Fulfill', icon: FiPackage, path: '/farmer/orders', badge: ordersCount > 0 ? ordersCount : null },
    { label: 'Sales & Revenue', icon: FiTrendingUp, path: '/farmer/analytics', badge: null },
    { label: 'Payouts & Wallet', icon: FiDollarSign, path: '/farmer/wallet', badge: null },
    { label: 'Farm Profile', icon: FiSettings, path: '/farmer/profile', badge: null }
  ];

  return (
    <>
      {!isCollapsed && (
        <div className="sidebar-backdrop" onClick={onToggleCollapse} aria-hidden="true" />
      )}
      <aside className={`dashboard-sidebar farmer-sidebar glass-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <Link to="/" className="brand-logo">
          <div className="logo-icon-bg amber-gradient-bg">
            <TbTractor className="logo-icon" />
          </div>
          {!isCollapsed && (
            <span className="brand-name">
              Agri<span className="brand-highlight">Farmer</span>
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

      {!isCollapsed && (
        <div className="sidebar-farmer-pill">
          <Avatar
            src={user?.avatar}
            name={user?.name}
            alt={user?.name}
            className="pill-avatar"
            fallbackBg="var(--color-amber)"
            fallbackSize={16}
            fallbackWeight={600}
          />
          <div className="pill-meta">
            <span className="pill-name">{user?.name || 'Farmer'}</span>
            <span className="pill-role text-amber">Certified Organic Farmer</span>
          </div>
        </div>
      )}

      {/* Add Produce Action Button */}
      {!isCollapsed ? (
        <button className="btn btn-amber btn-full mb-4" onClick={onOpenAddModal}>
          <FiPlusCircle /> <span>List New Crop</span>
        </button>
      ) : (
        <button className="dash-icon-btn amber-icon mb-4" onClick={onOpenAddModal} title="List New Crop">
          <FiPlusCircle />
        </button>
      )}

      <nav className="sidebar-nav">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/farmer-dashboard' && location.pathname === '/farmer-dashboard');
          return (
            <Link
              key={idx}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? 'active-amber' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="nav-item-icon" />
              {!isCollapsed && <span className="nav-item-label">{item.label}</span>}
              {!isCollapsed && item.badge && (
                <span className="nav-item-badge amber-badge">{item.badge}</span>
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
    </>
  );
};

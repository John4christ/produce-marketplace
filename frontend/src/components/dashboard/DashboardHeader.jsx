import React, { useState } from 'react';
import {
  FiSearch,
  FiBell,
  FiSun,
  FiMoon,
  FiShoppingBag,
  FiUser,
  FiLogOut,
  FiSettings,
  FiCheck,
  FiX
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Badge } from '../common/Badge';
import Avatar from '../common/Avatar';

export const DashboardHeader = ({ onSearchChange, searchQuery = '' }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Harvest Picked Dawn Today',
      desc: 'SunValley Orchards just picked fresh Honeycrisp apples for your area.',
      time: '10 min ago',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Order #AG-9428 Out for Delivery',
      desc: 'Driver Marcus is en route with your organic spinach & brown eggs.',
      time: '1 hour ago',
      read: false
    },
    {
      id: 'notif-3',
      title: '15% Weekend Discount',
      desc: 'Wildflower Pure Raw Honey is on sale this weekend.',
      time: '1 day ago',
      read: true
    }
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const userRole = user?.roles?.[0]?.slug || 'buyer';

  return (
    <header className="dashboard-top-nav glass-panel">
      <div className="dash-search-container">
        <FiSearch className="dash-search-icon" />
        <input
          type="text"
          placeholder="Search produce, farms, or categories..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="dash-search-input"
          aria-label="Search produce dashboard"
        />
      </div>

      <div className="dash-nav-actions">
        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? <FiSun className="icon-sun" /> : <FiMoon className="icon-moon" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="dropdown-wrapper">
          <button
            className="dash-icon-btn"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
          >
            <FiBell />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {notificationsOpen && (
            <div className="notif-dropdown-panel glass-panel">
              <div className="notif-header">
                <h4 className="notif-title">Notifications ({unreadCount} new)</h4>
                {unreadCount > 0 && (
                  <button className="mark-read-btn" onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notif-list">
                {notifications.map((n) => (
                  <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                    <div className="notif-dot" />
                    <div className="notif-body">
                      <h5 className="notif-item-title">{n.title}</h5>
                      <p className="notif-item-desc">{n.desc}</p>
                      <span className="notif-item-time">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        {user && (
          <div className="dropdown-wrapper">
            <button
              className="dash-profile-btn"
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
              }}
              aria-label="Profile menu"
            >
              <Avatar
                src={user.avatar}
                name={user.name}
                alt={user.name}
                className="dash-user-avatar"
                fallbackBg="var(--color-primary)"
                fallbackSize={14}
                fallbackWeight={600}
              />
              <span className="dash-user-name">{user.name.split(' ')[0]}</span>
            </button>

            {profileOpen && (
              <div className="profile-dropdown-panel glass-panel">
                <div className="dropdown-user-header">
                  <p className="dropdown-user-name">{user.name}</p>
                  <p className="dropdown-user-email">{user.email}</p>
                  <Badge variant="primary" size="sm" className="mt-1">
                    {userRole.toUpperCase()} ACCOUNT
                  </Badge>
                </div>
                <div className="dropdown-divider" />
  
                <div className="dropdown-divider" />
                <button className="dropdown-item red-text" onClick={logout}>
                  <FiLogOut /> <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

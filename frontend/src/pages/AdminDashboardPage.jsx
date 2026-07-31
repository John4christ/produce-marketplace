import React, { useState } from 'react';
import { FiGrid, FiUsers, FiPackage, FiShoppingCart, FiBarChart2, FiBell, FiSettings, FiTrendingUp, FiClipboard, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/formatters';

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'New farmer profile submitted', desc: 'A new farm profile is pending approval.', time: '8 min ago', unread: true },
    { id: 'notif-2', title: 'Product moderation alert', desc: '3 listings flagged for review.', time: '45 min ago', unread: false },
    { id: 'notif-3', title: 'Revenue milestone reached', desc: 'Marketplace revenue exceeded $1M this month.', time: '1 day ago', unread: false }
  ]);

  const adminMetrics = [
    { label: 'Total Revenue', value: '$1.24M', icon: FiTrendingUp, accent: 'primary' },
    { label: 'Registered Users', value: '3,482', icon: FiUsers, accent: 'green' },
    { label: 'Approved Farmers', value: '258', icon: FiPackage, accent: 'amber' },
    { label: 'Active Products', value: '1,094', icon: FiShoppingCart, accent: 'purple' }
  ];

  const users = [
    { id: 'u-102', name: 'Maya Hernandez', email: 'maya@example.com', role: 'Buyer', status: 'Active' },
    { id: 'u-103', name: 'Devon Lee', email: 'devon@example.com', role: 'Buyer', status: 'Active' },
    { id: 'u-104', name: 'Priya Singh', email: 'priya@example.com', role: 'Buyer', status: 'Pending' }
  ];

  const farmers = [
    { id: 'f-201', name: 'Sun Valley Farm', location: 'Sonoma, CA', listings: 24, status: 'Verified' },
    { id: 'f-202', name: 'Green Sprout Acres', location: 'Napa, CA', listings: 18, status: 'Verified' },
    { id: 'f-203', name: 'Riverbend Harvest', location: 'Davis, CA', listings: 12, status: 'Pending' }
  ];

  const products = [
    { id: 'p-306', title: 'Organic Kale Bundle', farmer: 'Green Sprout Acres', inventory: 84, price: 7.95 },
    { id: 'p-309', title: 'Local Honey Jar', farmer: 'Sun Valley Farm', inventory: 42, price: 12.5 },
    { id: 'p-314', title: 'Free-range Eggs', farmer: 'Riverbend Harvest', inventory: 120, price: 5.25 }
  ];

  const orders = [
    { id: 'ORD-219', customer: 'Elena Park', amount: 84, date: 'Today', status: 'Processing' },
    { id: 'ORD-218', customer: 'Noah Wells', amount: 43, date: 'Yesterday', status: 'Completed' },
    { id: 'ORD-217', customer: 'Maya Lopez', amount: 129, date: 'Jul 28', status: 'On Hold' }
  ];

  const sections = [
    { id: 'overview', label: 'Overview', icon: FiGrid },
    { id: 'users', label: 'Users', icon: FiUsers },
    { id: 'farmers', label: 'Farmers', icon: FiPackage },
    { id: 'products', label: 'Products', icon: FiShoppingCart },
    { id: 'orders', label: 'Orders', icon: FiClipboard },
    { id: 'reports', label: 'Reports', icon: FiBarChart2 },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  const unreadCount = notifications.filter((n) => !n.unread).length;

  return (
    <div className="dashboard-layout admin-dashboard-layout">
      <aside className="admin-sidebar glass-panel">
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <FiShield />
          </div>
          <div>
            <p className="admin-brand-label">Marketplace Admin</p>
            <p className="admin-brand-meta">Control center</p>
          </div>
        </div>

        <div className="admin-nav">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                type="button"
                className={`admin-nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <Icon className="admin-nav-icon" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-footer-label">Alerts</div>
          <div className="admin-alert-pill">
            <span>{unreadCount} unread</span>
          </div>
        </div>
      </aside>

      <div className="dashboard-main-content">
        <DashboardHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <div className="dashboard-container">
          <div className="dash-welcome-banner glass-panel admin-welcome-banner">
            <div>
              <span className="section-tag">Admin Dashboard</span>
              <h1 className="dash-heading">
                Hello, <span className="text-gradient">{user?.name || 'Administrator'}</span>
              </h1>
              <p className="dash-subheading">
                Manage users, farmers, listings, orders, reports, and platform settings from one central dashboard.
              </p>
            </div>
            <div className="admin-welcome-actions">
              <Button variant="primary" size="lg">Review System Report</Button>
            </div>
          </div>

          <div className="admin-stats-grid">
            {adminMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="admin-kpi-card glass-panel">
                  <div>
                    <span className="text-sm text-muted">{metric.label}</span>
                    <h3 className="admin-kpi-value">{metric.value}</h3>
                  </div>
                  <Icon className={`admin-kpi-icon admin-kpi-icon-${metric.accent}`} />
                </div>
              );
            })}
          </div>

          <div className="admin-body-grid">
            <div className="admin-main-column">
              <section className="admin-panel">
                <div className="flex-between mb-4">
                  <div>
                    <h3 className="section-title-sm">Platform Reports</h3>
                    <p className="text-muted text-sm">Revenue, orders, and user growth at a glance.</p>
                  </div>
                  <Badge variant="primary">Live</Badge>
                </div>

                <div className="admin-chart-grid">
                  <div className="chart-card">
                    <div className="chart-card-header">
                      <div>
                        <h4>Revenue Trend</h4>
                        <p className="text-muted text-sm">Last 7 days</p>
                      </div>
                      <span className="text-primary font-semibold">+12.8%</span>
                    </div>
                    <div className="trend-bars">
                      {[30, 42, 55, 63, 76, 88, 105].map((value, idx) => (
                        <div key={idx} className="trend-bar-wrap">
                          <div className="trend-bar" style={{ height: `${value}%` }} />
                          <span className="trend-label">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="chart-card">
                    <div className="chart-card-header">
                      <div>
                        <h4>Order Volume</h4>
                        <p className="text-muted text-sm">Weekly order activity</p>
                      </div>
                      <span className="text-green font-semibold">+8.4%</span>
                    </div>
                    <div className="trend-bars">
                      {[24, 33, 39, 47, 58, 65, 72].map((value, idx) => (
                        <div key={idx} className="trend-bar-wrap">
                          <div className="trend-bar trend-bar-secondary" style={{ height: `${value}%` }} />
                          <span className="trend-label">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="admin-panel">
                <div className="flex-between mb-4">
                  <div>
                    <h3 className="section-title-sm">Recent Activity</h3>
                    <p className="text-muted text-sm">Latest user, farmer, product, and order events.</p>
                  </div>
                  <Button variant="outline" size="sm">Export CSV</Button>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((userRow) => (
                        <tr key={userRow.id}>
                          <td>{userRow.name}</td>
                          <td>{userRow.email}</td>
                          <td>{userRow.role}</td>
                          <td><Badge variant={userRow.status === 'Active' ? 'green' : 'amber'}>{userRow.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="admin-panel">
                <div className="flex-between mb-4">
                  <div>
                    <h3 className="section-title-sm">Recent Orders</h3>
                    <p className="text-muted text-sm">Orders that require admin attention.</p>
                  </div>
                  <Badge variant="amber">{orders.length} open</Badge>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="font-mono font-semibold">{order.id}</td>
                          <td>{order.customer}</td>
                          <td>{formatCurrency(order.amount)}</td>
                          <td>{order.date}</td>
                          <td><Badge variant={order.status === 'Completed' ? 'green' : order.status === 'Processing' ? 'primary' : 'amber'}>{order.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <aside className="admin-side-column">
              <section className="admin-panel admin-summary-panel">
                <h3 className="section-title-sm mb-3">Product Highlights</h3>
                {products.map((product) => (
                  <div key={product.id} className="admin-list-item">
                    <div>
                      <h4>{product.title}</h4>
                      <p className="text-muted text-sm">{product.farmer} • {product.inventory} in inventory</p>
                    </div>
                    <span className="text-primary font-semibold">{formatCurrency(product.price)}</span>
                  </div>
                ))}
              </section>

              <section className="admin-panel admin-notifications-card">
                <div className="flex-between mb-4">
                  <h3 className="section-title-sm">Notifications</h3>
                  <Badge variant="primary">{unreadCount} new</Badge>
                </div>
                <div className="notification-list">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                      <div className="notification-dot" />
                      <div>
                        <h4>{notif.title}</h4>
                        <p className="text-muted text-sm">{notif.desc}</p>
                        <span className="text-light text-xs">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="admin-panel admin-settings-card">
                <div className="flex-between mb-4">
                  <h3 className="section-title-sm">Settings</h3>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                <div className="admin-settings-list">
                  <div className="admin-settings-row">
                    <span>Platform access</span>
                    <Badge variant="green">Enabled</Badge>
                  </div>
                  <div className="admin-settings-row">
                    <span>Review workflow</span>
                    <Badge variant="primary">Auto</Badge>
                  </div>
                  <div className="admin-settings-row">
                    <span>Email alerts</span>
                    <Badge variant="amber">Daily</Badge>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

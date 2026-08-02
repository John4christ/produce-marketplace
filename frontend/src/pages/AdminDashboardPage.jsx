import React, { useState, useEffect } from 'react';
import { FiGrid, FiUsers, FiPackage, FiShoppingCart, FiBarChart2, FiBell, FiSettings, FiTrendingUp, FiClipboard, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { formatCurrency } from '../utils/formatters';
import { apiClient } from '../services/api';

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topFarmers, setTopFarmers] = useState([]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, usersRes, productsRes, ordersRes, topProductsRes, topFarmersRes] = await Promise.all([
        apiClient.get('/admin/dashboard'),
        apiClient.get('/admin/users', { params: { per_page: 10 } }),
        apiClient.get('/admin/products', { params: { per_page: 10 } }),
        apiClient.get('/admin/orders', { params: { per_page: 10 } }),
        apiClient.get('/admin/reports/top-products', { params: { limit: 5 } }),
        apiClient.get('/admin/reports/top-farmers', { params: { limit: 5 } }),
      ]);

      setStats(statsRes?.data || statsRes || null);
      setUsers(Array.isArray(usersRes?.data?.data) ? usersRes.data.data : []);
      setProducts(Array.isArray(productsRes?.data?.data) ? productsRes.data.data : []);
      setOrders(Array.isArray(ordersRes?.data?.data) ? ordersRes.data.data : []);
      setTopProducts(Array.isArray(topProductsRes?.data) ? topProductsRes.data : []);
      setTopFarmers(Array.isArray(topFarmersRes?.data) ? topFarmersRes.data : []);
    } catch (err) {
      setError(err.message || 'Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const sections = [
    { id: 'overview', label: 'Overview', icon: FiGrid },
    { id: 'users', label: 'Users', icon: FiUsers },
    { id: 'products', label: 'Products', icon: FiShoppingCart },
    { id: 'orders', label: 'Orders', icon: FiClipboard },
    { id: 'reports', label: 'Reports', icon: FiBarChart2 },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
      case 'active':
        return 'green';
      case 'processing':
      case 'shipped':
      case 'published':
        return 'primary';
      case 'pending':
      case 'draft':
        return 'amber';
      case 'cancelled':
      case 'archived':
        return 'red';
      default:
        return 'primary';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout admin-dashboard-layout">
        <aside className="admin-sidebar glass-panel">
          <div className="admin-brand">
            <div className="admin-brand-icon"><FiShield /></div>
            <div>
              <p className="admin-brand-label">Marketplace Admin</p>
              <p className="admin-brand-meta">Control center</p>
            </div>
          </div>
        </aside>
        <div className="dashboard-main-content">
          <DashboardHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <div className="dashboard-container">
            <div className="dash-welcome-banner glass-panel admin-welcome-banner">
              <div>
                <span className="section-tag">Admin Dashboard</span>
                <h1 className="dash-heading">Hello, <span className="text-gradient">{user?.name || 'Administrator'}</span></h1>
              </div>
            </div>
            <div className="admin-stats-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="admin-kpi-card glass-panel">
                  <Skeleton height="20px" width="60%" className="mb-3" />
                  <Skeleton height="32px" width="40%" />
                </div>
              ))}
            </div>
            <Skeleton height="300px" className="mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-layout admin-dashboard-layout">
        <aside className="admin-sidebar glass-panel">
          <div className="admin-brand">
            <div className="admin-brand-icon"><FiShield /></div>
            <div>
              <p className="admin-brand-label">Marketplace Admin</p>
              <p className="admin-brand-meta">Control center</p>
            </div>
          </div>
        </aside>
        <div className="dashboard-main-content">
          <DashboardHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <div className="dashboard-container">
            <ErrorState message={error} onRetry={fetchDashboard} />
          </div>
        </div>
      </div>
    );
  }

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
            <span>{stats?.orders?.pending || 0} pending</span>
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
              <Button variant="primary" size="lg" onClick={fetchDashboard}>Refresh Data</Button>
            </div>
          </div>

          <div className="admin-stats-grid">
            <div className="admin-kpi-card glass-panel">
              <div>
                <span className="text-sm text-muted">Total Revenue</span>
                <h3 className="admin-kpi-value">{formatCurrency(stats?.orders?.total_revenue || 0)}</h3>
              </div>
              <FiTrendingUp className={`admin-kpi-icon admin-kpi-icon-primary`} />
            </div>
            <div className="admin-kpi-card glass-panel">
              <div>
                <span className="text-sm text-muted">Registered Users</span>
                <h3 className="admin-kpi-value">{stats?.users?.total || 0}</h3>
              </div>
              <FiUsers className={`admin-kpi-icon admin-kpi-icon-green`} />
            </div>
            <div className="admin-kpi-card glass-panel">
              <div>
                <span className="text-sm text-muted">Approved Farmers</span>
                <h3 className="admin-kpi-value">{stats?.users?.farmers || 0}</h3>
              </div>
              <FiPackage className={`admin-kpi-icon admin-kpi-icon-amber`} />
            </div>
            <div className="admin-kpi-card glass-panel">
              <div>
                <span className="text-sm text-muted">Active Products</span>
                <h3 className="admin-kpi-value">{stats?.products?.published || 0}</h3>
              </div>
              <FiShoppingCart className={`admin-kpi-icon admin-kpi-icon-purple`} />
            </div>
          </div>

          <div className="admin-body-grid">
            <div className="admin-main-column">
              {activeSection === 'overview' && (
                <>
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
                          {users.slice(0, 5).map((userRow) => (
                            <tr key={userRow.id}>
                              <td>{userRow.name}</td>
                              <td>{userRow.email}</td>
                              <td className="text-capitalize">{userRow.roles?.[0]?.slug || 'user'}</td>
                              <td><Badge variant={userRow.email_verified_at ? 'green' : 'amber'}>{userRow.email_verified_at ? 'Active' : 'Pending'}</Badge></td>
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
                          {orders.slice(0, 5).map((order) => (
                            <tr key={order.id}>
                              <td className="font-mono font-semibold">{order.order_number || order.id}</td>
                              <td>{order.user?.name || 'Unknown'}</td>
                              <td>{formatCurrency(order.total || 0)}</td>
                              <td>{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</td>
                              <td><Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </>
              )}

              {activeSection === 'users' && (
                <section className="admin-panel">
                  <div className="flex-between mb-4">
                    <div>
                      <h3 className="section-title-sm">User Management</h3>
                      <p className="text-muted text-sm">All registered users and their roles.</p>
                    </div>
                  </div>
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((userRow) => (
                          <tr key={userRow.id}>
                            <td>{userRow.name}</td>
                            <td>{userRow.email}</td>
                            <td className="text-capitalize">{userRow.roles?.[0]?.slug || 'user'}</td>
                            <td><Badge variant={userRow.email_verified_at ? 'green' : 'amber'}>{userRow.email_verified_at ? 'Active' : 'Pending'}</Badge></td>
                            <td>{userRow.created_at ? new Date(userRow.created_at).toLocaleDateString() : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {activeSection === 'products' && (
                <section className="admin-panel">
                  <div className="flex-between mb-4">
                    <div>
                      <h3 className="section-title-sm">Product Management</h3>
                      <p className="text-muted text-sm">All listings across the marketplace.</p>
                    </div>
                  </div>
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Farmer</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.farmer?.name || '-'}</td>
                            <td>{product.category?.name || '-'}</td>
                            <td>{formatCurrency(product.price)}</td>
                            <td>{product.quantity_available}</td>
                            <td><Badge variant={getStatusBadgeVariant(product.status)}>{product.status}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {activeSection === 'orders' && (
                <section className="admin-panel">
                  <div className="flex-between mb-4">
                    <div>
                      <h3 className="section-title-sm">Order Management</h3>
                      <p className="text-muted text-sm">All orders and their current status.</p>
                    </div>
                  </div>
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td className="font-mono font-semibold">{order.order_number || order.id}</td>
                            <td>{order.user?.name || 'Unknown'}</td>
                            <td>{order.items?.length || 0}</td>
                            <td>{formatCurrency(order.total || 0)}</td>
                            <td><Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge></td>
                            <td>{order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {activeSection === 'reports' && (
                <section className="admin-panel">
                  <div className="flex-between mb-4">
                    <div>
                      <h3 className="section-title-sm">Top Products</h3>
                      <p className="text-muted text-sm">Best performing products by revenue.</p>
                    </div>
                  </div>
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Qty Sold</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topProducts.map((product) => (
                          <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.total_quantity}</td>
                            <td>{formatCurrency(product.total_revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {activeSection === 'settings' && (
                <section className="admin-panel">
                  <div className="flex-between mb-4">
                    <div>
                      <h3 className="section-title-sm">Platform Settings</h3>
                      <p className="text-muted text-sm">Manage marketplace configuration.</p>
                    </div>
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
                    <div className="admin-settings-row">
                      <span>Total users</span>
                      <Badge variant="primary">{stats?.users?.total || 0}</Badge>
                    </div>
                    <div className="admin-settings-row">
                      <span>Total products</span>
                      <Badge variant="primary">{stats?.products?.total || 0}</Badge>
                    </div>
                    <div className="admin-settings-row">
                      <span>Total orders</span>
                      <Badge variant="primary">{stats?.orders?.total || 0}</Badge>
                    </div>
                  </div>
                </section>
              )}
            </div>

            <aside className="admin-side-column">
              <section className="admin-panel admin-summary-panel">
                <h3 className="section-title-sm mb-3">Top Farmers</h3>
                {topFarmers.map((farmer) => (
                  <div key={farmer.id} className="admin-list-item">
                    <div>
                      <h4>{farmer.name}</h4>
                      <p className="text-muted text-sm">{farmer.total_orders} orders</p>
                    </div>
                    <span className="text-primary font-semibold">{formatCurrency(farmer.total_revenue)}</span>
                  </div>
                ))}
              </section>

              <section className="admin-panel admin-notifications-card">
                <div className="flex-between mb-4">
                  <h3 className="section-title-sm">Notifications</h3>
                  <Badge variant="primary">{stats?.orders?.pending || 0} new</Badge>
                </div>
                <div className="notification-list">
                  {stats?.orders?.pending > 0 && (
                    <div className="notification-item unread">
                      <div className="notification-dot" />
                      <div>
                        <h4>Pending Orders</h4>
                        <p className="text-muted text-sm">{stats.orders.pending} orders awaiting processing.</p>
                      </div>
                    </div>
                  )}
                  {stats?.users?.new_today > 0 && (
                    <div className="notification-item unread">
                      <div className="notification-dot" />
                      <div>
                        <h4>New Users Today</h4>
                        <p className="text-muted text-sm">{stats.users.new_today} new users registered today.</p>
                      </div>
                    </div>
                  )}
                  {stats?.products?.draft > 0 && (
                    <div className="notification-item unread">
                      <div className="notification-dot" />
                      <div>
                        <h4>Draft Products</h4>
                        <p className="text-muted text-sm">{stats.products.draft} products pending review.</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section className="admin-panel admin-settings-card">
                <div className="flex-between mb-4">
                  <h3 className="section-title-sm">Platform Stats</h3>
                </div>
                <div className="admin-settings-list">
                  <div className="admin-settings-row">
                    <span>Total Users</span>
                    <Badge variant="primary">{stats?.users?.total || 0}</Badge>
                  </div>
                  <div className="admin-settings-row">
                    <span>Farmers</span>
                    <Badge variant="green">{stats?.users?.farmers || 0}</Badge>
                  </div>
                  <div className="admin-settings-row">
                    <span>Buyers</span>
                    <Badge variant="amber">{stats?.users?.buyers || 0}</Badge>
                  </div>
                  <div className="admin-settings-row">
                    <span>Admins</span>
                    <Badge variant="primary">{stats?.users?.admins || 0}</Badge>
                  </div>
                  <div className="admin-settings-row">
                    <span>Published Products</span>
                    <Badge variant="green">{stats?.products?.published || 0}</Badge>
                  </div>
                  <div className="admin-settings-row">
                    <span>Total Orders</span>
                    <Badge variant="primary">{stats?.orders?.total || 0}</Badge>
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

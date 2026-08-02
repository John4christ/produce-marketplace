import React, { useState, useEffect } from "react";
import { apiClient } from "../services/api";
import AddProductModal from "../components/farmer/AddProductModal";
import { FarmerSidebar } from "../components/farmer/FarmerSidebar";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/formatters";
import { toast } from "react-toastify";
import {
  FiPackage,
  FiBox,
  FiUserCheck,
  FiPlusCircle,
  FiCreditCard,
  FiArrowRight,
  FiBell,
  FiEdit3,
  FiTrash2,
} from "react-icons/fi";

export const FarmerDashboardPage = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const salesTrend = [62, 72, 88, 96, 84, 104, 118];

  const orderRows = [
    {
      id: "AG-1802",
      buyer: "Rachel Nguyen",
      items: "12 Items",
      total: 258,
      status: "Awaiting Pickup",
      statusType: "amber",
    },
    {
      id: "AG-1754",
      buyer: "Miguel Santos",
      items: "8 Items",
      total: 134,
      status: "Processing",
      statusType: "primary",
    },
    {
      id: "AG-1689",
      buyer: "Priya Sharma",
      items: "5 Items",
      total: 79,
      status: "Delivered",
      statusType: "green",
    },
  ];

  const inventorySummary = [
    { label: "Total Inventory", value: "135 units", details: "Stock across all listings" },
    { label: "Low Stock", value: "5 items", details: "Restock before next market" },
    { label: "Harvest Today", value: "4 crops", details: "Fresh cuts ready for dispatch" },
    { label: "Farm Score", value: "4.9 / 5", details: "Average buyer rating" },
  ];

  const recentBuyers = [
    {
      id: "buyer-1",
      name: "Elena Park",
      amount: 82,
      items: "6 items",
      date: "Today",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    },
    {
      id: "buyer-2",
      name: "Noah Wells",
      amount: 48,
      items: "3 items",
      date: "Yesterday",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    },
    {
      id: "buyer-3",
      name: "Maya Lopez",
      amount: 132,
      items: "9 items",
      date: "Jul 26",
      avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80",
    },
  ];

  const fallbackNotifications = [
    {
      id: "notif-1",
      title: "New order received",
      desc: "Buyer Lucas ordered 8 lbs of apples and spinach.",
      time: "15 min ago",
      unread: true,
    },
    {
      id: "notif-2",
      title: "Payout scheduled",
      desc: "Your next payout of $3,450 is scheduled for tomorrow.",
      time: "2 hrs ago",
      unread: false,
    },
    {
      id: "notif-3",
      title: "Low stock alert",
      desc: "Raw Honey inventory is below 20 jars.",
      time: "Yesterday",
      unread: false,
    },
  ];

  const fallbackWallet = {
    balance: 12840,
    pending: 3450,
    earnedThisMonth: 8920,
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get("/farmer/dashboard");
      setDashboard(data);
    } catch (err) {
      setError(err.message);
      toast.error("Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const openAddProduce = () => {
    setShowAddModal(true);
  };

  const openEditProduce = (product) => {
    setEditingProduct(product);
    setEditModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setDeletingId(productId);
      await apiClient.delete(`/products/${productId}`);
      toast.success("Product deleted successfully");
      fetchDashboard();
    } catch (err) {
      toast.error(err.message || "Unable to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSuccess = () => {
    setShowAddModal(false);
    setEditModalOpen(false);
    setEditingProduct(null);
    fetchDashboard();
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditModalOpen(false);
    setEditingProduct(null);
  };

  const statsData = dashboard?.stats || {
    monthlyRevenue: 16840,
    activeListings: 12,
    pendingOrders: 8,
    newBuyers: 24,
    total_orders: 98,
  };

  const stats = [
    {
      label: "Monthly Revenue",
      value: formatCurrency(statsData.monthlyRevenue),
      icon: FiCreditCard,
      accent: "primary",
    },
    {
      label: "Active Listings",
      value: statsData.activeListings,
      icon: FiBox,
      accent: "amber",
    },
    {
      label: "Pending Orders",
      value: statsData.pendingOrders,
      icon: FiPackage,
      accent: "green",
    },
    {
      label: "New Buyers",
      value: statsData.newBuyers,
      icon: FiUserCheck,
      accent: "purple",
    },
  ];

  const orders = dashboard?.orders || orderRows;
  const products = dashboard?.products || [];
  const notifications = dashboard?.notifications || fallbackNotifications;
  const wallet = dashboard?.wallet || fallbackWallet;

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return "green";
      case "processing":
      case "shipped":
        return "primary";
      case "pending":
        return "amber";
      default:
        return "primary";
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <FarmerSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          onOpenAddModal={openAddProduce}
        />
        <div className="dashboard-main-content">
          <DashboardHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <div className="dashboard-container">
            <div className="dash-welcome-banner glass-panel">
              <div>
                <span className="section-tag">Farmer Dashboard</span>
                <h1 className="dash-heading">
                  Good morning, <span className="text-gradient">{user?.name || "Farmer"}!</span>
                </h1>
                <p className="dash-subheading">
                  Manage your farm operations, monitor sales, and keep inventory fresh for local buyers.
                </p>
              </div>
            </div>
            <div className="flex-center" style={{ padding: "4rem" }}>
              <p className="text-muted">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-layout">
        <FarmerSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          onOpenAddModal={openAddProduce}
        />
        <div className="dashboard-main-content">
          <DashboardHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <div className="dashboard-container">
            <div className="dash-welcome-banner glass-panel">
              <div>
                <span className="section-tag">Farmer Dashboard</span>
                <h1 className="dash-heading">
                  Good morning, <span className="text-gradient">{user?.name || "Farmer"}!</span>
                </h1>
                <p className="dash-subheading">
                  Manage your farm operations, monitor sales, and keep inventory fresh for local buyers.
                </p>
              </div>
            </div>
            <div className="flex-center" style={{ padding: "4rem" }}>
              <p className="text-muted">{error}</p>
              <Button variant="primary" onClick={fetchDashboard} className="mt-3">
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-layout">
        <FarmerSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          onOpenAddModal={openAddProduce}
        />

        <div className="dashboard-main-content">
          <DashboardHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className="dashboard-container">
            <div className="dash-welcome-banner glass-panel">
              <div>
                <span className="section-tag">Farmer Dashboard</span>
                <h1 className="dash-heading">
                  Good morning, <span className="text-gradient">{user?.name || "Farmer"}!</span>
                </h1>
                <p className="dash-subheading">
                  Manage your farm operations, monitor sales, and keep inventory fresh for local buyers.
                </p>
              </div>
              <div className="dash-welcome-actions">
                <Button variant="amber" size="lg" icon={FiPlusCircle} onClick={openAddProduce}>
                  Add Produce
                </Button>
              </div>
            </div>

            <div className="farmer-dashboard-overview">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="farmer-stat-card glass-panel">
                    <div className="stat-card-head">
                      <span>{stat.label}</span>
                      <Icon className={`stat-card-icon stat-icon-${stat.accent}`} />
                    </div>
                    <div className="stat-value">{stat.value}</div>
                  </div>
                );
              })}
            </div>

            <div className="farmer-dashboard-grid">
              <div className="farm-left-column">
                <section className="sales-chart-card glass-panel">
                  <div className="flex-between mb-4">
                    <div>
                      <h3 className="section-title-sm">Sales Performance</h3>
                      <p className="text-muted text-sm">Weekly order volume and revenue trend.</p>
                    </div>
                    <Badge variant="primary" size="sm">+12.6%</Badge>
                  </div>
                  <div className="sales-chart-inner">
                    <div className="sales-chart-legend">
                      <div>
                        <span className="text-muted">Revenue</span>
                        <p className="font-semibold text-xl">{formatCurrency(wallet.earnedThisMonth || 16840)}</p>
                      </div>
                      <div>
                        <span className="text-muted">Orders</span>
                        <p className="font-semibold text-xl">{statsData.total_orders || 98}</p>
                      </div>
                    </div>
                    <div className="chart-line-grid">
                      {salesTrend.map((value, index) => (
                        <div key={index} className="chart-bar">
                          <div className="chart-bar-level" style={{ height: `${value}%` }} />
                          <span className="chart-bar-dot" />
                        </div>
                      ))}
                    </div>
                    <div className="chart-x-labels">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
                        <span key={label}>{label}</span>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="orders-table-wrapper glass-panel">
                  <div className="table-header flex-between">
                    <div>
                      <h3 className="table-title">Orders to Fulfill</h3>
                      <p className="table-subtitle">Recent buyer orders waiting for harvest or dispatch.</p>
                    </div>
                    <Button variant="outline" size="sm" icon={FiArrowRight} onClick={() => toast.success("Showing all farm orders")}>
                      View all
                    </Button>
                  </div>
                  <div className="table-responsive">
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Buyer</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => {
                          const orderId = order.order_number || order.id;
                          const buyerName = order.user?.name || order.buyer || "Unknown";
                          const itemsCount = order.items?.length || order.items || "0";
                          const displayItems = typeof itemsCount === "number" ? `${itemsCount} Items` : itemsCount;
                          const total = order.total || order.amount || 0;
                          const status = order.status || "Pending";

                          return (
                            <tr key={order.id}>
                              <td className="font-mono font-semibold">{orderId}</td>
                              <td>{buyerName}</td>
                              <td>{displayItems}</td>
                              <td className="font-semibold">{formatCurrency(total)}</td>
                              <td>
                                <Badge variant={order.statusType || getStatusBadgeVariant(status)}>{status}</Badge>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="product-inventory-card glass-panel">
                  <div className="flex-between mb-4">
                    <div>
                      <h3 className="section-title-sm">Active Product Listings</h3>
                      <p className="text-muted text-sm">Track stock, sales, and pricing for your harvest inventory.</p>
                    </div>
                    <Badge variant="primary" size="sm">{products.length} active</Badge>
                  </div>
                  <div className="product-table-wrapper">
                    <table className="product-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Category</th>
                          <th>Quantity</th>
                          <th>Unit</th>
                          <th>Price</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.category?.name ?? "No Category"}</td>
                            <td>{product.quantity_available ?? 0}</td>
                            <td>{product.unit}</td>
                            <td className="font-semibold">{formatCurrency(product.price)}</td>
                            <td>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" icon={FiEdit3} onClick={() => openEditProduce(product)}>
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm" icon={FiTrash2} isLoading={deletingId === product.id} onClick={() => handleDeleteProduct(product.id)}>
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>

              <aside className="farm-right-panel">
                <section className="wallet-card glass-panel">
                  <div className="flex-between mb-4">
                    <div>
                      <h3 className="section-title-sm">Wallet Balance</h3>
                      <p className="text-muted text-sm">Available funds for payouts and farm reinvestment.</p>
                    </div>
                    <FiCreditCard className="icon-xl icon-green" />
                  </div>
                  <div className="wallet-balance-row">
                    <span className="text-muted">Available</span>
                    <span className="wallet-balance">{formatCurrency(wallet.balance)}</span>
                  </div>
                  <div className="wallet-detail-list">
                    <div className="wallet-detail-row">
                      <span>Pending payout</span>
                      <span>{formatCurrency(wallet.pending)}</span>
                    </div>
                    <div className="wallet-detail-row">
                      <span>Earned this month</span>
                      <span>{formatCurrency(wallet.earnedThisMonth)}</span>
                    </div>
                  </div>
                  <Button variant="primary" size="md" fullWidth icon={FiArrowRight} onClick={() => toast.success("Withdrawal initiated")}>
                    Request Payout
                  </Button>
                </section>

                <section className="inventory-summary-card glass-panel">
                  <div className="table-header mb-4">
                    <h3 className="table-title">Inventory Summary</h3>
                    <p className="table-subtitle">Quick view of stock health across your farm listings.</p>
                  </div>
                  <div className="inventory-summary-grid">
                    {inventorySummary.map((item) => (
                      <div key={item.label} className="summary-card-small">
                        <span className="summary-label">{item.label}</span>
                        <p className="summary-value">{item.value}</p>
                        <p className="summary-desc">{item.details}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="recent-buyers-card glass-panel">
                  <div className="table-header mb-4">
                    <h3 className="table-title">Recent Buyers</h3>
                    <p className="table-subtitle">Keep an eye on loyal customers and latest farm orders.</p>
                  </div>
                  <div className="recent-buyers-list">
                    {recentBuyers.map((buyer) => (
                      <div key={buyer.id} className="buyer-row">
                        <img src={buyer.avatar} alt={buyer.name} className="buyer-avatar" />
                        <div className="buyer-info">
                          <span className="buyer-name">{buyer.name}</span>
                          <span className="buyer-meta">{buyer.items} · {buyer.date}</span>
                        </div>
                        <span className="buyer-amount">{formatCurrency(buyer.amount)}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="notifications-card glass-panel">
                  <div className="table-header mb-4">
                    <h3 className="table-title">Notifications</h3>
                    <p className="table-subtitle">Recent farm alerts and dispatch reminders.</p>
                  </div>
                  <div className="notifications-list">
                    {notifications.map((note) => (
                      <div key={note.id} className={`notification-row ${note.unread ? "unread" : ""}`}>
                        <div className="notification-icon">
                          <FiBell />
                        </div>
                        <div>
                          <p className="notification-title">{note.title}</p>
                          <p className="notification-desc">{note.desc}</p>
                        </div>
                        <span className="notification-time">{note.time}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </div>
      </div>

      <AddProductModal
        isOpen={showAddModal || editModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editProduct={editingProduct}
      />
    </>
  );
};

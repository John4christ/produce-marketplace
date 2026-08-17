import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { apiClient } from "../services/api";
import AddProductModal from "../components/farmer/AddProductModal";
import ViewProductModal from "../components/farmer/ViewProductModal";
import { FarmerSidebar } from "../components/farmer/FarmerSidebar";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/formatters";
import { resizeImage } from "../utils/resizeImage";
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
  FiEye,
  FiRotateCcw,
  FiTrendingUp,
  FiDollarSign,
  FiSettings,
  FiUser,
  FiCheck,
} from "react-icons/fi";

export const FarmerDashboardPage = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [farmerProducts, setFarmerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const currentView = location.pathname;

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
      desc: "Your next payout of ₦3,450 is scheduled for tomorrow.",
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
      const response = await apiClient.get("/farmer/dashboard");
      setDashboard(response?.data || response || {});
    } catch (err) {
      setError(err.message);
      toast.error("Unable to load dashboard");
    }
  };

  const fetchFarmerProducts = async () => {
    try {
      const response = await apiClient.get("/farmer/products");
      const items = response?.data || response || [];
      setFarmerProducts(Array.isArray(items) ? items : items?.data || []);
    } catch (err) {
      toast.error("Unable to load your products.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchDashboard(), fetchFarmerProducts()]);
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      setSidebarCollapsed(false);
    }
  }, []);

  const openAddProduce = () => {
    setShowAddModal(true);
  };

  const openEditProduce = (product) => {
    setEditingProduct(product);
    setEditModalOpen(true);
  };

  const openViewProduce = (product) => {
    setViewingProduct(product);
  };

  const closeViewModal = () => {
    setViewingProduct(null);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setDeletingId(productId);
      await apiClient.delete(`/products/${productId}`);
      toast.success("Product deleted successfully");
      await Promise.all([fetchDashboard(), fetchFarmerProducts()]);
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
    Promise.all([fetchDashboard(), fetchFarmerProducts()]);
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
  const products = farmerProducts;
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

  const getApprovalStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return { variant: "green", label: "Approved" };
      case "rejected":
        return { variant: "red", label: "Rejected" };
      case "pending":
        return { variant: "amber", label: "Pending Approval" };
      default:
        return {
          variant: "primary",
          label: status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown",
        };
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case '/farmer/crops': return 'Crops & Inventory';
      case '/farmer/orders': return 'Orders to Fulfill';
      case '/farmer/analytics': return 'Sales & Revenue';
      case '/farmer/wallet': return 'Payouts & Wallet';
      case '/farmer/profile': return 'Farm Profile';
      default: return 'Farm Overview';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <FarmerSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          onOpenAddModal={openAddProduce}
          cropsCount={products.length}
          ordersCount={orders.length}
        />
        <div className="dashboard-main-content">
          <DashboardHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
            sidebarCollapsed={sidebarCollapsed}
          />
          <div className="dashboard-container">
            <div className="dash-welcome-banner glass-panel">
              <div>
                <span className="section-tag">{getViewTitle()}</span>
                <h1 className="dash-heading">
                  Good morning, <span className="text-gradient">{user?.name || "Farmer"}!</span>
                </h1>
              </div>
            </div>
            <div className="flex-center" style={{ padding: "4rem" }}>
              <p className="text-muted">Loading...</p>
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
          cropsCount={products.length}
          ordersCount={orders.length}
        />
        <div className="dashboard-main-content">
          <DashboardHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
            sidebarCollapsed={sidebarCollapsed}
          />
          <div className="dashboard-container">
            <div className="dash-welcome-banner glass-panel">
              <div>
                <span className="section-tag">{getViewTitle()}</span>
                <h1 className="dash-heading">
                  Good morning, <span className="text-gradient">{user?.name || "Farmer"}!</span>
                </h1>
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
          cropsCount={products.length}
          ordersCount={orders.length}
        />

        <div className="dashboard-main-content">
          <DashboardHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
            sidebarCollapsed={sidebarCollapsed}
          />

          <div className="dashboard-container">
            <div className="dash-welcome-banner glass-panel">
              <div>
                <span className="section-tag">{getViewTitle()}</span>
                <h1 className="dash-heading">
                  Good morning, <span className="text-gradient">{user?.name || "Farmer"}!</span>
                </h1>
                <p className="dash-subheading">
                  Manage your farm operations, monitor sales, and keep inventory fresh for local buyers.
                </p>
              </div>
              {(currentView === '/farmer-dashboard' || currentView === '/farmer/crops') && (
                <div className="dash-welcome-actions">
                  <Button variant="amber" size="lg" icon={FiPlusCircle} onClick={openAddProduce}>
                    Add Produce
                  </Button>
                </div>
              )}
            </div>

            {currentView === '/farmer-dashboard' && (
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
            )}

            <div className="farmer-dashboard-grid">
              <div className="farm-left-column">
                {(currentView === '/farmer-dashboard' || currentView === '/farmer/analytics') && (
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
                )}

                {(currentView === '/farmer-dashboard' || currentView === '/farmer/orders') && (
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
                )}

                {(currentView === '/farmer-dashboard' || currentView === '/farmer/crops') && (
                  <section className="product-inventory-card glass-panel">
                    <div className="flex-between mb-4">
                      <div>
                        <h3 className="section-title-sm">Active Product Listings</h3>
                        <p className="text-muted text-sm">Track stock, sales, and pricing for your harvest inventory.</p>
                      </div>
                      <Badge variant="primary" size="sm">{products.length} products</Badge>
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
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => {
                            const approval = getApprovalStatus(product.status);
                            return (
                              <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.category?.name ?? "No Category"}</td>
                                <td>{product.quantity_available ?? 0}</td>
                                <td>{product.unit}</td>
                                <td className="font-semibold">{formatCurrency(product.price)}</td>
                                <td>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
                                    <Badge variant={approval.variant}>{approval.label}</Badge>
                                    {product.status === "rejected" && product.rejection_reason && (
                                      <span
                                        title={product.rejection_reason}
                                        style={{
                                          display: "inline-block",
                                          maxWidth: 200,
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                          fontSize: "0.75rem",
                                          color: "#dc2626",
                                          fontWeight: 600,
                                        }}
                                      >
                                        Reason: {product.rejection_reason}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    <Button variant="outline" size="sm" icon={FiEye} onClick={() => openViewProduce(product)}>
                                      View
                                    </Button>
                                    {product.status === "approved" || (product.status !== "pending" && product.status !== "rejected") ? (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        icon={FiEdit3}
                                        title={product.status === "approved" ? "Editing an approved product sends it back for admin review." : undefined}
                                        onClick={() => openEditProduce(product)}
                                      >
                                        Edit
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        icon={FiEdit3}
                                        isDisabled
                                        title={
                                          product.status === "pending"
                                            ? "Products awaiting approval cannot be edited until reviewed."
                                            : "Rejected products must be resubmitted before they can be edited."
                                        }
                                      >
                                        Edit
                                      </Button>
                                    )}
                                    {product.status === "rejected" && (
                                      <Button variant="amber" size="sm" icon={FiRotateCcw} onClick={() => openEditProduce(product)}>
                                        Resubmit
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      icon={FiTrash2}
                                      isLoading={deletingId === product.id}
                                      onClick={() => handleDeleteProduct(product.id)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}
              </div>

              <aside className="farm-right-panel">
                {(currentView === '/farmer-dashboard' || currentView === '/farmer/wallet') && (
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
                )}

                {(currentView === '/farmer-dashboard' || currentView === '/farmer/crops') && (
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
                )}

                {(currentView === '/farmer-dashboard' || currentView === '/farmer/orders') && (
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
                )}

                {(currentView === '/farmer-dashboard' || currentView === '/farmer/profile') && (
                  <section className="notifications-card glass-panel">
                    <div className="table-header mb-4">
                      <h3 className="table-title">Farm Profile</h3>
                      <p className="table-subtitle">Manage your farm details and public presence.</p>
                    </div>
                    <div className="glass-panel p-4 rounded-xl">
                      <FarmProfileForm user={user} />
                    </div>
                  </section>
                )}
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

      <ViewProductModal product={viewingProduct} onClose={closeViewModal} />
    </>
  );
};

const FarmProfileForm = ({ user }) => {
  const { updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const nameRef = useRef(name);
  const emailRef = useRef(email);
  nameRef.current = name;
  emailRef.current = email;

  useEffect(() => {
    if (!editing) {
      setName(user?.name || '');
      setEmail(user?.email || '');
      setAvatarPreview(user?.avatar || null);
      setAvatarFile(null);
    }
  }, [user, editing]);

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

  const startEditing = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setAvatarPreview(user?.avatar || null);
    setAvatarFile(null);
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const trimmedName = (nameRef.current || '').trim();
      const trimmedEmail = (emailRef.current || '').trim();

      if (!trimmedName) {
        toast.error('Name is required.');
        setSaving(false);
        return;
      }

      if (!trimmedEmail) {
        toast.error('Email is required.');
        setSaving(false);
        return;
      }

      const payload = new FormData();
      payload.append('_method', 'PUT');
      payload.append('name', trimmedName);
      payload.append('email', trimmedEmail);
      if (avatarFile) {
        payload.append('avatar', avatarFile);
      }

      const response = await apiClient.post('/auth/profile', payload);

      const updatedUser = response.data.data ?? response.data;
      updateUser(updatedUser);

      setName(updatedUser.name || '');
      setEmail(updatedUser.email || '');
      setAvatarPreview(updatedUser.avatar || null);
      setAvatarFile(null);

      setSaveSuccess(true);
      toast.success('Profile updated successfully');

      setTimeout(() => {
        setSaveSuccess(false);
        setEditing(false);
      }, 1200);
    } catch (err) {
      setSaveSuccess(false);
      if (err.errors && typeof err.errors === 'object') {
        Object.values(err.errors).forEach((messages) => {
          if (Array.isArray(messages)) {
            messages.forEach((message) => toast.error(message));
          } else {
            toast.error(messages);
          }
        });
      } else if (err.originalData?.errors && typeof err.originalData.errors === 'object') {
        Object.values(err.originalData.errors).forEach((messages) => {
          if (Array.isArray(messages)) {
            messages.forEach((message) => toast.error(message));
          } else {
            toast.error(messages);
          }
        });
      } else {
        toast.error(
          err.message ||
            err.originalData?.message ||
            'Failed to update profile.'
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const displayName = editing ? name : user?.name || 'My Farm';
  const displayEmail = editing ? email : user?.email || 'N/A';
  const displayAvatar = editing ? avatarPreview : (user?.avatar ? `${user.avatar}?t=${Date.now()}` : null);

  return (
    <div>
      <div className="avatar-upload-row mb-4">
        <div className="avatar-preview">
          {displayAvatar ? (
            <img src={displayAvatar} alt="Avatar" />
          ) : (
            <div className="avatar-placeholder">
              <FiUser />
            </div>
          )}
        </div>
        {editing && (
          <div className="avatar-upload-controls">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="file-input"
              id="farmer-avatar-upload"
            />
            <label htmlFor="farmer-avatar-upload" className="btn btn-outline btn-sm">
              Change Photo
            </label>
            <p className="text-muted text-sm">JPG, PNG or WebP. Max 2MB.</p>
          </div>
        )}
      </div>

      {editing ? (
        <div className="form-grid">
          <div className="form-group">
            <label className="input-label">Farm Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant="primary"
              onClick={handleSave}
              isLoading={saving}
              isDisabled={saveSuccess}
              icon={saveSuccess ? FiCheck : undefined}
            >
              {saveSuccess ? 'Saved!' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={() => setEditing(false)} isDisabled={saving || saveSuccess}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-muted text-sm mb-2">Farm Name: {displayName}</p>
          <p className="text-muted text-sm mb-2">Email: {displayEmail}</p>
          <p className="text-muted text-sm mb-3">Member since: 2024</p>
          <Button variant="outline" size="sm" onClick={startEditing}>
            Edit Profile
          </Button>
        </div>
      )}
    </div>
  );
};

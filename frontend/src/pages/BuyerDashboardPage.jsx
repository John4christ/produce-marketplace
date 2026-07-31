import React, { useState } from 'react';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { ProduceCard } from '../components/produce/ProduceCard';
import { CartSummaryWidget } from '../components/dashboard/CartSummaryWidget';
import { RecentOrdersTable } from '../components/dashboard/RecentOrdersTable';
import { MOCK_PRODUCE, MOCK_CATEGORIES } from '../services/mockData';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { toast } from 'react-toastify';
import {
  FiShoppingBag,
  FiHeart,
  FiPackage,
  FiZap,
  FiFilter,
  FiCheck,
  FiStar
} from 'react-icons/fi';
import { TbLeaf } from 'react-icons/tb';

export const BuyerDashboardPage = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [wishlist, setWishlist] = useState(['prod-1', 'prod-3']); // product IDs in wishlist

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        toast.info('Item removed from wishlist', { autoClose: 2000 });
        return prev.filter((id) => id !== productId);
      } else {
        toast.success('Item added to your saved wishlist! ❤️', { autoClose: 2000 });
        return [...prev, productId];
      }
    });
  };

  const filteredProduce = MOCK_PRODUCE.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.farm.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const recommendedProduce = MOCK_PRODUCE.slice(0, 3);
  const wishlistItems = MOCK_PRODUCE.filter((p) => wishlist.includes(p.id));

  return (
    <div className="dashboard-layout">
      {/* 1. Collapsible Sidebar */}
      <DashboardSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        wishlistCount={wishlist.length}
      />

      {/* Main Content Area */}
      <div className="dashboard-main-content">
        {/* 2. Top Header Navigation */}
        <DashboardHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="dashboard-container">
          {/* Welcome Header Banner */}
          <div className="dash-welcome-banner glass-panel">
            <div>
              <span className="section-tag">Buyer Dashboard</span>
              <h1 className="dash-heading">
                Welcome back, <span className="text-gradient">{user ? user.name : 'Valued Buyer'}</span> 👋
              </h1>
              <p className="dash-subheading">
                Explore field-picked organic produce, track active orders, and support Sonoma & Napa local farmers.
              </p>
            </div>
            <div className="dash-stat-chips">
              <div className="stat-chip">
                <FiPackage className="chip-icon green" />
                <div>
                  <span className="chip-val">12</span>
                  <span className="chip-lbl">Orders Placed</span>
                </div>
              </div>
              <div className="stat-chip">
                <TbLeaf className="chip-icon amber" />
                <div>
                  <span className="chip-val">42 lbs</span>
                  <span className="chip-lbl">CO2 Saved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Layout: Main Feed (Left 2.2fr) + Sidebar Cart Widget (Right 1fr) */}
          <div className="dash-body-grid">
            <div className="dash-feed-column">
              {/* Category Pills Filter */}
              <div className="dash-section">
                <div className="flex-between mb-3">
                  <h3 className="section-title-sm">Browse Harvest Categories</h3>
                  <button
                    className={`filter-chip ${activeCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('all')}
                  >
                    View All ({MOCK_PRODUCE.length})
                  </button>
                </div>

                <div className="category-pills-row">
                  {MOCK_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      className={`cat-pill-btn ${activeCategory === cat.slug ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat.slug)}
                    >
                      <span className="pill-emoji">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Catalog Grid with Wishlist Heart Buttons */}
              <div className="dash-section">
                <div className="flex-between mb-4">
                  <h3 className="section-title-sm">Fresh Field Produce</h3>
                  <span className="text-muted text-sm">Showing {filteredProduce.length} fresh items</span>
                </div>

                <div className="dash-produce-grid">
                  {filteredProduce.map((product) => {
                    const isWishlisted = wishlist.includes(product.id);
                    return (
                      <div key={product.id} className="dash-produce-card-wrap">
                        <ProduceCard product={product} />
                        <button
                          className={`wishlist-heart-btn ${isWishlisted ? 'active' : ''}`}
                          onClick={() => toggleWishlist(product.id)}
                          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <FiHeart className={isWishlisted ? 'heart-filled' : ''} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Saved Wishlist Section */}
              {wishlistItems.length > 0 && (
                <div className="dash-section glass-panel p-6 rounded-xl mb-6">
                  <div className="flex-between mb-4">
                    <h3 className="section-title-sm flex-center gap-2">
                      <FiHeart className="icon-red" /> Your Saved Wishlist ({wishlistItems.length})
                    </h3>
                  </div>
                  <div className="wishlist-horizontal-row">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="wishlist-mini-card">
                        <img src={item.image} alt={item.title} className="mini-card-img" />
                        <div className="mini-card-body">
                          <h4 className="mini-title">{item.title}</h4>
                          <span className="mini-price">${item.price} / {item.unit}</span>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => addToCart(item)}
                            className="mt-2"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Orders Section */}
              <div className="dash-section">
                <RecentOrdersTable />
              </div>

              {/* Recommended Seasonal Produce */}
              <div className="dash-section">
                <div className="flex-between mb-4">
                  <h3 className="section-title-sm flex-center gap-2">
                    <FiZap className="icon-amber" /> Recommended For You
                  </h3>
                  <span className="text-muted text-sm">Based on your organic preferences</span>
                </div>
                <div className="dash-produce-grid">
                  {recommendedProduce.map((product) => (
                    <ProduceCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Sticky Cart Summary Widget */}
            <div className="dash-sidebar-column">
              <CartSummaryWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

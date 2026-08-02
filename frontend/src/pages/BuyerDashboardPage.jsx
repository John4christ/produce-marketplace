import React, { useState, useEffect } from 'react';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { CartSummaryWidget } from '../components/dashboard/CartSummaryWidget';
import { RecentOrdersTable } from '../components/dashboard/RecentOrdersTable';
import { apiClient } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'react-toastify';
import {
  FiShoppingBag,
  FiHeart,
  FiPackage,
  FiZap,
  FiRefreshCw
} from 'react-icons/fi';
import { TbLeaf } from 'react-icons/tb';

export const BuyerDashboardPage = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [wishlist, setWishlist] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsRes, categoriesRes, ordersRes] = await Promise.all([
          apiClient.get('/products', {
            params: {
              status: 'published',
              search: searchQuery || undefined,
              category_id: activeCategory !== 'all' ? activeCategory : undefined,
              min_price: priceRange.min || undefined,
              max_price: priceRange.max || undefined,
            }
          }),
          apiClient.get('/categories'),
          apiClient.get('/orders', { params: { my_orders: true } }),
        ]);

        const productsData = productsRes?.data || productsRes || [];
        const categoriesData = categoriesRes?.data || categoriesRes || [];
        const ordersData = ordersRes?.data || ordersRes || [];

        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err) {
        setError(err.message || 'Failed to load data');
        toast.error(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, activeCategory, priceRange.min, priceRange.max]);

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

  const handleAddToCart = (product) => {
    const cartProduct = {
      id: product.id,
      title: product.name,
      price: product.price,
      unit: product.unit,
      image: product.images?.[0]?.url || '/placeholder.jpg',
      farm: product.farmer?.name || 'Unknown Farm',
    };
    addToCart(cartProduct);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  const wishlistItems = products.filter((p) => wishlist.includes(p.id));

  const orderCount = Array.isArray(orders) ? orders.length : 0;

  return (
    <div className="dashboard-layout">
      <DashboardSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        wishlistCount={wishlist.length}
      />

      <div className="dashboard-main-content">
        <DashboardHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="dashboard-container">
          <div className="dash-welcome-banner glass-panel">
            <div>
              <span className="section-tag">Buyer Dashboard</span>
              <h1 className="dash-heading">
                Welcome back, <span className="text-gradient">{user ? user.name : 'Valued Buyer'}</span> 👋
              </h1>
              <p className="dash-subheading">
                Explore field-picked organic produce, track active orders, and support local farmers.
              </p>
            </div>
            <div className="dash-stat-chips">
              <div className="stat-chip">
                <FiPackage className="chip-icon green" />
                <div>
                  <span className="chip-val">{orderCount}</span>
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

          <div className="dash-body-grid">
            <div className="dash-feed-column">
              <div className="dash-section">
                <div className="flex-between mb-3">
                  <h3 className="section-title-sm">Browse Harvest Categories</h3>
                  <button
                    className={`filter-chip ${activeCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('all')}
                  >
                    View All ({products.length})
                  </button>
                </div>

                <div className="category-pills-row">
                  <button
                    className={`cat-pill-btn ${activeCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('all')}
                  >
                    <span className="pill-emoji">🌐</span>
                    <span>All Categories</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`cat-pill-btn ${activeCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      <span className="pill-emoji">{cat.icon || '📦'}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>

                <div className="flex-between mt-2">
                  <div className="flex-center gap-2">
                    <input
                      type="number"
                      placeholder="Min price"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                      className="input-field"
                      style={{ width: '120px' }}
                      min="0"
                      step="0.01"
                    />
                    <span className="text-muted">-</span>
                    <input
                      type="number"
                      placeholder="Max price"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                      className="input-field"
                      style={{ width: '120px' }}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div className="dash-section">
                <div className="flex-between mb-4">
                  <h3 className="section-title-sm">Fresh Field Produce</h3>
                  <span className="text-muted text-sm">
                    {loading ? 'Loading...' : `Showing ${products.length} fresh items`}
                  </span>
                </div>

                {error ? (
                  <div className="text-center py-8">
                    <p className="text-muted mb-4">{error}</p>
                    <Button variant="primary" size="sm" icon={FiRefreshCw} onClick={handleRetry}>
                      Retry
                    </Button>
                  </div>
                ) : loading ? (
                  <div className="dash-produce-grid">
                    {[...Array(6)].map((_, idx) => (
                      <div key={idx} className="dash-produce-card-wrap">
                        <div className="produce-card glass-panel">
                          <div className="produce-image-container">
                            <Skeleton height="200px" borderRadius="var(--radius-lg) var(--radius-lg) 0 0" />
                          </div>
                          <div className="produce-body">
                            <Skeleton height="16px" width="60%" className="mb-2" />
                            <Skeleton height="24px" width="90%" className="mb-2" />
                            <Skeleton height="16px" width="40%" className="mb-4" />
                            <div className="produce-footer">
                              <Skeleton height="28px" width="30%" />
                              <Skeleton height="36px" width="35%" borderRadius="var(--radius-sm)" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted">No products found matching your filters.</p>
                  </div>
                ) : (
                  <div className="dash-produce-grid">
                    {products.map((product) => {
                      const isWishlisted = wishlist.includes(product.id);
                      return (
                        <div key={product.id} className="dash-produce-card-wrap">
                          <article className="produce-card glass-panel">
                            <div className="produce-image-container">
                              <img
                                src={product.images?.[0]?.url || '/placeholder.jpg'}
                                alt={product.images?.[0]?.alt_text || product.name}
                                className="produce-image"
                                loading="lazy"
                              />
                            </div>
                            <div className="produce-body">
                              <div className="produce-farm-meta">
                                <span className="farm-name">{product.farmer?.name || 'Local Farm'}</span>
                              </div>
                              <h3 className="produce-title">{product.name}</h3>
                              <p className="text-muted text-sm" style={{ marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
                                {product.category?.name}
                              </p>
                            </div>
                            <div className="produce-footer">
                              <div className="price-tag">
                                <span className="price-val">{formatCurrency(product.price)}</span>
                                <span className="price-unit">/ {product.unit}</span>
                              </div>
                              <Button
                                variant="primary"
                                size="sm"
                                icon={FiShoppingBag}
                                onClick={() => handleAddToCart(product)}
                                ariaLabel={`Add ${product.name} to cart`}
                              >
                                Add
                              </Button>
                            </div>
                          </article>
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
                )}
              </div>

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
                        <img src={item.images?.[0]?.url || '/placeholder.jpg'} alt={item.name} className="mini-card-img" />
                        <div className="mini-card-body">
                          <h4 className="mini-title">{item.name}</h4>
                          <span className="mini-price">${item.price} / {item.unit}</span>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAddToCart(item)}
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

              <div className="dash-section">
                <RecentOrdersTable />
              </div>

              {products.length > 0 && (
                <div className="dash-section">
                  <div className="flex-between mb-4">
                    <h3 className="section-title-sm flex-center gap-2">
                      <FiZap className="icon-amber" /> Recommended For You
                    </h3>
                    <span className="text-muted text-sm">Based on your organic preferences</span>
                  </div>
                  <div className="dash-produce-grid">
                    {products.slice(0, 3).map((product) => (
                      <div key={product.id} className="dash-produce-card-wrap">
                        <article className="produce-card glass-panel">
                          <div className="produce-image-container">
                            <img
                              src={product.images?.[0]?.url || '/placeholder.jpg'}
                              alt={product.images?.[0]?.alt_text || product.name}
                              className="produce-image"
                              loading="lazy"
                            />
                          </div>
                          <div className="produce-body">
                            <div className="produce-farm-meta">
                              <span className="farm-name">{product.farmer?.name || 'Local Farm'}</span>
                            </div>
                            <h3 className="produce-title">{product.name}</h3>
                            <p className="text-muted text-sm" style={{ marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
                              {product.category?.name}
                            </p>
                          </div>
                          <div className="produce-footer">
                            <div className="price-tag">
                              <span className="price-val">{formatCurrency(product.price)}</span>
                              <span className="price-unit">/ {product.unit}</span>
                            </div>
                            <Button
                              variant="primary"
                              size="sm"
                              icon={FiShoppingBag}
                              onClick={() => handleAddToCart(product)}
                              ariaLabel={`Add ${product.name} to cart`}
                            >
                              Add
                            </Button>
                          </div>
                        </article>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="dash-sidebar-column">
              <CartSummaryWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

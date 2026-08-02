import React, { useMemo, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiStar, FiPlus, FiMinus, FiShoppingBag, FiMapPin, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { apiClient } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { toast } from 'react-toastify';

export const ProductDetailsPage = () => {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const [productRes, reviewsRes] = await Promise.all([
          apiClient.get(`/products/${productId}`),
          apiClient.get(`/products/${productId}/reviews`),
        ]);

        const productData = productRes?.data || productRes;
        setProduct(productData);

        const reviewsData = reviewsRes?.data || reviewsRes;
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);

        if (productData?.category?.id) {
          const relatedRes = await apiClient.get('/products', {
            params: {
              category_id: productData.category.id,
              per_page: 4,
              status: 'published',
            },
          });
          const relatedData = relatedRes?.data || relatedRes;
          const items = Array.isArray(relatedData) ? relatedData : relatedData?.data || [];
          setRelatedProducts(items.filter((p) => p.id !== productId).slice(0, 3));
        }
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const galleryImages = useMemo(() => {
    if (!product?.images?.length) return ['/placeholder.jpg'];
    return product.images
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((img) => img.url);
  }, [product]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1);
  }, [reviews]);

  const handleQuantityChange = (value) => {
    setQuantity((prev) => Math.max(1, prev + value));
  };

  const handleAddToCart = () => {
    if (!product) return;
    const cartProduct = {
      id: product.id,
      title: product.name,
      price: product.price,
      unit: product.unit,
      image: product.images?.[0]?.url || '/placeholder.jpg',
      farm: product.farmer?.name || 'Local Farm',
    };
    addToCart({ ...cartProduct, quantity });
    toast.success(`${product.name} added to cart.`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const cartProduct = {
      id: product.id,
      title: product.name,
      price: product.price,
      unit: product.unit,
      image: product.images?.[0]?.url || '/placeholder.jpg',
      farm: product.farmer?.name || 'Local Farm',
    };
    addToCart({ ...cartProduct, quantity });
    toast.success('Ready for checkout!');
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="product-hero glass-panel">
          <Skeleton height="24px" width="200px" className="mb-3" />
          <Skeleton height="40px" width="60%" />
        </div>
        <div className="product-details-grid">
          <div className="product-gallery-panel glass-panel">
            <Skeleton height="400px" borderRadius="var(--radius-lg)" />
          </div>
          <div className="product-info-panel glass-panel">
            <Skeleton height="20px" width="40%" className="mb-3" />
            <Skeleton height="32px" width="50%" className="mb-4" />
            <Skeleton height="100px" width="100%" className="mb-4" />
            <Skeleton height="48px" width="100%" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-page">
        <div className="product-details-empty glass-panel">
          <h2>Product not found</h2>
          <p>{error || 'The item you are looking for is no longer available.'}</p>
          <Link to="/" className="btn btn-primary btn-md">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <section className="product-hero glass-panel">
        <div className="product-breadcrumbs">
          <Link to="/" className="breadcrumb-link">
            Marketplace
          </Link>
          <span>·</span>
          <span>{product.category?.name || 'Produce'}</span>
        </div>
        <h1>{product.name}</h1>
        <p className="product-hero-copy">
          Discover the origin of your produce, compare farmer details, and choose fresh local harvests with confidence.
        </p>
      </section>

      <div className="product-details-grid">
        <div className="product-gallery-panel glass-panel">
          <img
            src={galleryImages[selectedImageIndex]}
            alt={product.images?.[selectedImageIndex]?.alt_text || product.name}
            className="gallery-main-image"
          />
          {galleryImages.length > 1 && (
            <div className="gallery-thumbs-row">
              {galleryImages.map((src, index) => (
                <button
                  key={index}
                  type="button"
                  className={`gallery-thumb-btn ${index === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={src} alt={`${product.name} thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info-panel glass-panel">
          <div className="product-meta-row">
            <span className="product-category">{product.category?.name || 'Produce'}</span>
            <div className="product-rating-pill">
              <FiStar className="icon-tiny" />
              <span>{averageRating}</span>
              <span>({reviews.length} reviews)</span>
            </div>
          </div>

          <div className="price-block">
            <div>
              <p className="price-label">Price</p>
              <div className="price-figure">
                <span className="price-value">{formatCurrency(product.price)}</span>
                <span className="price-unit">/ {product.unit}</span>
              </div>
            </div>
            <Badge variant="primary">Farm Fresh</Badge>
          </div>

          <div className="product-description">
            <p>{product.description || 'Fresh farm produce sourced directly from local farmers.'}</p>
          </div>

          <div className="product-detail-list">
            <div>
              <span>Farmer</span>
              <strong>{product.farmer?.name || 'Local Farm'}</strong>
            </div>
            <div>
              <span>Stock available</span>
              <strong>{product.quantity_available ?? 0} items</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{product.status}</strong>
            </div>
          </div>

          <div className="quantity-selector">
            <button type="button" className="qty-btn" onClick={() => handleQuantityChange(-1)}>
              <FiMinus />
            </button>
            <input type="text" value={quantity} readOnly aria-label="Selected quantity" />
            <button type="button" className="qty-btn" onClick={() => handleQuantityChange(1)}>
              <FiPlus />
            </button>
          </div>

          <div className="product-action-row">
            <Button
              variant="primary"
              size="lg"
              icon={FiShoppingBag}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </div>

          <div className="product-farm-info card-panel">
            <div className="farm-owner-row">
              <div className="farm-avatar">
                <img
                  src={product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={product.farmer?.name || 'Farm'}
                />
              </div>
              <div>
                <p className="text-muted">Sold by</p>
                <h4>{product.farmer?.name || 'Local Farm'}</h4>
                <p className="farm-location">
                  <FiMapPin className="icon-tiny" /> Local Farm
                </p>
              </div>
            </div>
            <div className="farm-stats-row">
              <div>
                <span>Trusted Rating</span>
                <strong>{averageRating} / 5</strong>
              </div>
              <div>
                <span>Verified Orders</span>
                <strong>{reviews.length * 4}+</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="product-extra-grid">
        <section className="reviews-panel glass-panel">
          <div className="flex-between mb-4">
            <div>
              <h3 className="section-title-sm">Customer Reviews</h3>
              <p className="text-muted text-sm">What buyers say about this harvest.</p>
            </div>
            <Badge variant="primary" size="sm">{averageRating} / 5</Badge>
          </div>
          {reviews.length === 0 ? (
            <p className="text-muted">No reviews yet. Be the first to review this product!</p>
          ) : (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-avatar">
                    <img src={review.user?.avatar || '/placeholder.jpg'} alt={review.user?.name || 'User'} />
                  </div>
                  <div className="review-body">
                    <div className="review-header">
                      <strong>{review.user?.name || 'Anonymous'}</strong>
                      <span>{review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}</span>
                    </div>
                    <div className="review-rating">
                      <FiStar className="star-filled" /> {review.rating}
                    </div>
                    <p>{review.comment || review.title || ''}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="related-panel glass-panel">
          <div className="flex-between mb-4">
            <div>
              <h3 className="section-title-sm">Related Products</h3>
              <p className="text-muted text-sm">More fresh harvests from local farms.</p>
            </div>
            <Badge variant="amber" size="sm">Recommended</Badge>
          </div>
          {relatedProducts.length === 0 ? (
            <p className="text-muted">No related products found.</p>
          ) : (
            <div className="related-products-grid">
              {relatedProducts.map((item) => (
                <Link key={item.id} to={`/product/${item.id}`} className="related-product-card">
                  <img src={item.images?.[0]?.url || '/placeholder.jpg'} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{formatCurrency(item.price)} / {item.unit}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiStar, FiPlus, FiMinus, FiShoppingBag, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { MOCK_PRODUCE } from '../services/mockData';
import { formatCurrency } from '../utils/formatters';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { toast } from 'react-toastify';

export const ProductDetailsPage = () => {
  const { productId } = useParams();
  const product = useMemo(
    () => MOCK_PRODUCE.find((item) => item.id === productId),
    [productId]
  );
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="product-details-empty glass-panel">
          <h2>Product not found</h2>
          <p>The item you are looking for is no longer available.</p>
          <Link to="/" className="btn btn-primary btn-md">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages = [
    product.image,
    product.image,
    product.image
  ];

  const reviews = [
    {
      id: 'review-1',
      name: 'Maria Chen',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
      rating: 5,
      date: 'Jul 28, 2026',
      comment: 'This batch of produce arrived crisp and flavorful. The quality is amazing, and the farmer details gave me confidence in sourcing local.'
    },
    {
      id: 'review-2',
      name: 'Jordan Price',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      rating: 4,
      date: 'Jul 22, 2026',
      comment: 'Freshness was excellent and the seller shipped quickly. I would buy again for weekly delivery.'
    },
    {
      id: 'review-3',
      name: 'Nina Patel',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
      rating: 5,
      date: 'Jul 18, 2026',
      comment: 'I love supporting local farmers. The produce was bright, clean, and absolutely delicious in every recipe.'
    }
  ];

  const relatedProducts = MOCK_PRODUCE.filter((item) => item.id !== product.id).slice(0, 3);

  const handleQuantityChange = (value) => {
    setQuantity((prev) => Math.max(1, prev + value));
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    toast.success(`${product.title} added to cart.`);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    toast.success('Ready for checkout!');
  };

  return (
    <div className="product-details-page">
      <section className="product-hero glass-panel">
        <div className="product-breadcrumbs">
          <Link to="/" className="breadcrumb-link">
            Marketplace
          </Link>
          <span>·</span>
          <span>{product.category}</span>
        </div>
        <h1>{product.title}</h1>
        <p className="product-hero-copy">
          Discover the origin of your produce, compare farmer details, and choose fresh local harvests with confidence.
        </p>
      </section>

      <div className="product-details-grid">
        <div className="product-gallery-panel glass-panel">
          <img
            src={galleryImages[selectedImageIndex]}
            alt={product.title}
            className="gallery-main-image"
          />
          <div className="gallery-thumbs-row">
            {galleryImages.map((src, index) => (
              <button
                key={index}
                type="button"
                className={`gallery-thumb-btn ${index === selectedImageIndex ? 'active' : ''}`}
                onClick={() => setSelectedImageIndex(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img src={src} alt={`${product.title} thumbnail ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-info-panel glass-panel">
          <div className="product-meta-row">
            <span className="product-category">{product.category}</span>
            <div className="product-rating-pill">
              <FiStar className="icon-tiny" />
              <span>{product.rating}</span>
              <span>({product.reviewsCount} reviews)</span>
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
            <Badge variant="primary">{product.badge || 'Farm Fresh'}</Badge>
          </div>

          <div className="product-description">
            <p>
              Sustainably grown by {product.farm}, this {product.category.toLowerCase()} selection is harvested on demand and packaged with regenerative practices for peak flavor.
            </p>
          </div>

          <div className="product-detail-list">
            <div>
              <span>Farmer</span>
              <strong>{product.farm}</strong>
            </div>
            <div>
              <span>Location</span>
              <strong>{product.farmLocation}</strong>
            </div>
            <div>
              <span>Stock available</span>
              <strong>{product.stock} items</strong>
            </div>
            <div>
              <span>Organic</span>
              <strong>{product.isOrganic ? 'Yes' : 'No'}</strong>
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
                  src={product.image}
                  alt={product.farm}
                />
              </div>
              <div>
                <p className="text-muted">Sold by</p>
                <h4>{product.farm}</h4>
                <p className="farm-location">
                  <FiMapPin className="icon-tiny" /> {product.farmLocation}
                </p>
              </div>
            </div>
            <div className="farm-stats-row">
              <div>
                <span>Trusted Rating</span>
                <strong>{product.rating} / 5</strong>
              </div>
              <div>
                <span>Verified Orders</span>
                <strong>{product.reviewsCount * 4}</strong>
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
            <Badge variant="primary" size="sm">{product.rating} / 5</Badge>
          </div>
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-avatar">
                  <img src={review.avatar} alt={review.name} />
                </div>
                <div className="review-body">
                  <div className="review-header">
                    <strong>{review.name}</strong>
                    <span>{review.date}</span>
                  </div>
                  <div className="review-rating">
                    <FiStar className="star-filled" /> {review.rating}
                  </div>
                  <p>{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="related-panel glass-panel">
          <div className="flex-between mb-4">
            <div>
              <h3 className="section-title-sm">Related Products</h3>
              <p className="text-muted text-sm">More fresh harvests from local farms.</p>
            </div>
            <Badge variant="amber" size="sm">Recommended</Badge>
          </div>
          <div className="related-products-grid">
            {relatedProducts.map((item) => (
              <Link key={item.id} to={`/product/${item.id}`} className="related-product-card">
                <img src={item.image} alt={item.title} />
                <div>
                  <strong>{item.title}</strong>
                  <span>{formatCurrency(item.price)} / {item.unit}</span>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

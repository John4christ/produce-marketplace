import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiShoppingBag, FiMapPin } from 'react-icons/fi';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

export const ProduceCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <article className="produce-card glass-panel">
      <Link to={`/product/${product.id}`} className="produce-card-link">
        <div className="produce-image-container">
          <img
            src={product.image}
            alt={product.title}
            className="produce-image"
            loading="lazy"
          />
          <div className="produce-badges">
            {product.badge && <Badge variant="amber">{product.badge}</Badge>}
            {product.isOrganic && <Badge variant="primary">100% Organic</Badge>}
          </div>
        </div>

        <div className="produce-body">
          <div className="produce-farm-meta">
            <span className="farm-name">{product.farm}</span>
            <span className="farm-location">
              <FiMapPin className="icon-tiny" /> {product.farmLocation}
            </span>
          </div>

          <h3 className="produce-title">{product.title}</h3>

          <div className="produce-rating">
            <div className="stars">
              <FiStar className="star-filled" />
              <span className="rating-score">{product.rating}</span>
            </div>
            <span className="reviews-count">({product.reviewsCount} reviews)</span>
          </div>
        </div>
      </Link>

      <div className="produce-footer">
        <div className="price-tag">
          <span className="price-val">{formatCurrency(product.price)}</span>
          <span className="price-unit">/ {product.unit}</span>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={FiShoppingBag}
          onClick={handleAddToCart}
          ariaLabel={`Add ${product.title} to cart`}
        >
          Add
        </Button>
      </div>
    </article>
  );
};

import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';
import { FiShoppingBag, FiArrowRight, FiTruck, FiShield } from 'react-icons/fi';

export const CartSummaryWidget = () => {
  const { cartItems, cartCount, cartSubtotal, removeFromCart } = useCart();
  const deliveryFee = cartSubtotal > 35 || cartSubtotal === 0 ? 0 : 4.99;
  const grandTotal = cartSubtotal + deliveryFee;

  return (
    <div className="cart-summary-widget glass-panel">
      <div className="widget-header flex-between">
        <h3 className="widget-title flex-center gap-2">
          <FiShoppingBag className="icon-green" /> Live Harvest Cart
        </h3>
        <span className="cart-count-pill">{cartCount} items</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-widget-cart text-center py-4">
          <p className="text-muted text-sm">Your fresh produce cart is empty.</p>
          <p className="text-xs text-light mt-1">Add organic apples or eggs from the catalog!</p>
        </div>
      ) : (
        <div className="widget-cart-items-list">
          {cartItems.map((item) => (
            <div key={item.id} className="widget-cart-item">
              <img src={item.image} alt={item.title} className="widget-item-img" />
              <div className="widget-item-info">
                <h4 className="widget-item-title">{item.title}</h4>
                <p className="widget-item-meta">
                  {item.quantity} x {formatCurrency(item.price)}
                </p>
              </div>
              <button
                className="remove-item-btn"
                onClick={() => removeFromCart(item.id)}
                title="Remove item"
              >
                &times;
              </button>
            </div>
          ))}

          <div className="widget-pricing-breakdown">
            <div className="price-row">
              <span>Subtotal</span>
              <span className="font-semibold">{formatCurrency(cartSubtotal)}</span>
            </div>
            <div className="price-row">
              <span>Eco Delivery</span>
              <span className="font-semibold">
                {deliveryFee === 0 ? <span className="text-green">FREE</span> : formatCurrency(deliveryFee)}
              </span>
            </div>
            {cartSubtotal < 35 && cartSubtotal > 0 && (
              <p className="free-shipping-note">
                Add {formatCurrency(35 - cartSubtotal)} more for FREE farm delivery!
              </p>
            )}
            <div className="price-row grand-total-row">
              <span>Total</span>
              <span className="grand-total-val">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <Button variant="primary" size="md" fullWidth icon={FiArrowRight}>
            Proceed to Checkout
          </Button>

          <div className="widget-guarantee">
            <FiShield className="icon-green" /> 100% Organic Freshness Guarantee
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { toast } from 'react-toastify';

export const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const deliveryFee = cartSubtotal > 35 || cartSubtotal === 0 ? 0 : 4.99;

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.code === 'FARM10') return cartSubtotal * 0.1;
    if (appliedCoupon.code === 'HARVEST5') return 5;
    return 0;
  }, [appliedCoupon, cartSubtotal]);

  const totalAmount = cartSubtotal + deliveryFee - couponDiscount;

  const handleApplyCoupon = () => {
    const normalized = coupon.trim().toUpperCase();
    if (normalized === 'FARM10') {
      setAppliedCoupon({ code: 'FARM10', label: '10% off farm orders' });
      toast.success('Coupon FARM10 applied!');
    } else if (normalized === 'HARVEST5') {
      setAppliedCoupon({ code: 'HARVEST5', label: '$5 off your order' });
      toast.success('Coupon HARVEST5 applied!');
    } else {
      setAppliedCoupon(null);
      toast.error('Coupon code not recognized.');
    }
  };

  const handleCheckout = () => {
    if (!cartItems.length) {
      toast.error('Your cart is empty. Add produce before checkout.');
      return;
    }
    navigate('/checkout');
  };

  const roundedTotal = Math.max(totalAmount, 0).toFixed(2);

  return (
    <div className="cart-page">
      <div className="cart-page-header glass-panel">
        <div>
          <span className="section-tag">Shopping Cart</span>
          <h1 className="cart-heading">Review your farm produce order</h1>
          <p className="text-muted">Adjust quantities, apply a coupon, and confirm delivery details before checkout.</p>
        </div>
        <div className="cart-summary-pill">
          <FiShoppingBag className="icon-green" />
          <span>{cartItems.length} items</span>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty-panel glass-panel">
          <h2>Your cart is currently empty</h2>
          <p>Browse fresh harvests and add items to your cart for a quick checkout.</p>
          <Link to="/" className="btn btn-primary btn-lg">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-items-panel glass-panel">
            <div className="cart-items-header flex-between">
              <div>
                <h2 className="section-title-sm">Cart Items</h2>
                <p className="text-muted">Manage your selected produce and make updates instantly.</p>
              </div>
              <Button variant="outline" size="sm" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <img src={item.image} alt={item.title} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3>{item.title}</h3>
                    <p className="text-muted">{item.farm}</p>
                    <div className="cart-item-meta">
                      <span>{formatCurrency(item.price)} / {item.unit}</span>
                      <span>{item.stock} available</span>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <FiMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <FiPlus />
                      </button>
                    </div>
                    <div className="item-subtotal">{formatCurrency(item.price * item.quantity)}</div>
                    <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>
                      <FiTrash2 /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="cart-summary-panel glass-panel">
            <div className="cart-summary-block">
              <h2 className="section-title-sm">Order Summary</h2>
            </div>

            <div className="coupon-block">
              <label htmlFor="coupon" className="coupon-label">Coupon Code</label>
              <div className="coupon-input-row">
                <input
                  id="coupon"
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter code"
                />
                <Button variant="primary" size="sm" onClick={handleApplyCoupon}>
                  Apply
                </Button>
              </div>
              {appliedCoupon && (
                <p className="coupon-info">Applied {appliedCoupon.code}: {appliedCoupon.label}</p>
              )}
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal</span>
                <strong>{formatCurrency(cartSubtotal)}</strong>
              </div>
              <div className="price-row">
                <span>Delivery fee</span>
                <strong>{deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}</strong>
              </div>
              <div className="price-row">
                <span>Coupon discount</span>
                <strong>-{formatCurrency(couponDiscount)}</strong>
              </div>
              <div className="price-row grand-total-row">
                <span>Total</span>
                <strong>{formatCurrency(Number(roundedTotal))}</strong>
              </div>
            </div>

            <Button variant="primary" size="lg" fullWidth onClick={handleCheckout}>
              Checkout Now
            </Button>
            <p className="checkout-note text-muted">Secure payment, eco-friendly delivery, and fresh farm packing included.</p>
          </aside>
        </div>
      )}
    </div>
  );
};

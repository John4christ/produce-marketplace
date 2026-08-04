import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { apiClient } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { toast } from 'react-toastify';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone: '',
  });
  const [placingOrder, setPlacingOrder] = useState(false);
  const [syncingCart, setSyncingCart] = useState(true);
  const [error, setError] = useState(null);

  const deliveryFee = deliveryMethod === 'express' ? 8.99 : deliveryMethod === 'pickup' ? 0 : 4.99;

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.code === 'FARM10') return cartSubtotal * 0.1;
    if (appliedCoupon.code === 'HARVEST5') return 5;
    return 0;
  }, [appliedCoupon, cartSubtotal]);

  const totalAmount = cartSubtotal + deliveryFee - couponDiscount;

  useEffect(() => {
    const syncCartToBackend = async () => {
      try {
        setSyncingCart(true);
        setError(null);

        const backendCartResponse = await apiClient.get('/cart');
        const backendCart = backendCartResponse?.data || backendCartResponse;
        const backendItems = backendCart?.items || [];

        const backendItemMap = new Map(backendItems.map((item) => [item.product_id, item]));

        for (const item of cartItems) {
          const productId = item.product_id || item.id;
          const existing = backendItemMap.get(productId);
          if (existing) {
            if (existing.quantity !== item.quantity) {
              await apiClient.put(`/cart/items/${existing.id}`, {
                product_id: productId,
                quantity: item.quantity,
              });
            }
          } else {
            await apiClient.post('/cart/items', {
              product_id: productId,
              quantity: item.quantity,
            });
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to sync cart');
        toast.error('Cart sync failed. Please try again.');
      } finally {
        setSyncingCart(false);
      }
    };

    if (cartItems.length > 0) {
      syncCartToBackend();
    } else {
      setSyncingCart(false);
    }
  }, [cartItems]);

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

  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      toast.error('Your cart is empty.');
      return;
    }

    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postal_code ||
      !shippingAddress.country
    ) {
      toast.error('Please complete your shipping address.');
      return;
    }

    setPlacingOrder(true);
    try {
      const orderData = {
        shipping_address: shippingAddress,
        delivery_method: deliveryMethod,
        notes: `Payment method: ${paymentMethod}.${appliedCoupon ? ` Coupon: ${appliedCoupon.code}.` : ''}`,
      };

      const orderResponse = await apiClient.post('/orders', orderData);
      const order = orderResponse?.data || orderResponse;

      if (paymentMethod === 'cod') {
        clearCart();
        toast.success('Order placed successfully. Please pay on delivery.');
        navigate('/orders');
        return;
      }

      const callbackUrl = `${window.location.origin}/payment/callback`;
      const paymentResponse = await apiClient.post('/payments/initialize', {
        order_id: order.id,
        email: user?.email || '',
        callback_url: callbackUrl,
      });

      const payment = paymentResponse?.data || paymentResponse;
      if (payment?.authorization_url) {
        window.location.href = payment.authorization_url;
      } else {
        toast.error('Unable to initialize payment.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const changeAddress = (field, value) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  if (syncingCart) {
    return (
      <div className="checkout-page">
        <div className="checkout-hero glass-panel">
          <span className="section-tag">Checkout</span>
          <h1>Complete your order</h1>
        </div>
        <div className="checkout-grid">
          <section className="checkout-form-panel glass-panel">
            <div className="flex-center" style={{ padding: '4rem' }}>
              <Skeleton height="20px" width="200px" />
              <p className="text-muted mt-3">Syncing your cart...</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-page">
        <div className="checkout-hero glass-panel">
          <span className="section-tag">Checkout</span>
          <h1>Complete your order</h1>
        </div>
        <div className="checkout-grid">
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-hero glass-panel">
        <span className="section-tag">Checkout</span>
        <h1>Complete your order</h1>
        <p className="text-muted">Enter shipping and payment details to finalize your farm produce delivery.</p>
      </div>

      <div className="checkout-grid">
        <section className="checkout-form-panel glass-panel">
          <div className="checkout-section">
            <div className="section-head">
              <h2>Customer Information</h2>
              <p className="text-muted">Confirm your contact details before checkout.</p>
            </div>

            <div className="customer-info-grid">
              <div>
                <label>Name</label>
                <input type="text" value={user?.name || ''} disabled />
              </div>
              <div>
                <label>Email</label>
                <input type="text" value={user?.email || ''} disabled />
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <div className="section-head">
              <h2>Shipping Address</h2>
              <p className="text-muted">Where should we deliver your fresh produce?</p>
            </div>

            <div className="form-grid">
              <label className="full-width">
                Street address
                <input
                  type="text"
                  value={shippingAddress.street}
                  onChange={(e) => changeAddress('street', e.target.value)}
                  placeholder="123 Farm Lane"
                />
              </label>
              <label>
                City
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => changeAddress('city', e.target.value)}
                  placeholder="Sonoma"
                />
              </label>
              <label>
                State
                <input
                  type="text"
                  value={shippingAddress.state}
                  onChange={(e) => changeAddress('state', e.target.value)}
                  placeholder="California"
                />
              </label>
              <label>
                Postal code
                <input
                  type="text"
                  value={shippingAddress.postal_code}
                  onChange={(e) => changeAddress('postal_code', e.target.value)}
                  placeholder="94952"
                />
              </label>
              <label>
                Country
                <input
                  type="text"
                  value={shippingAddress.country}
                  onChange={(e) => changeAddress('country', e.target.value)}
                  placeholder="USA"
                />
              </label>
              <label>
                Phone number
                <input
                  type="text"
                  value={shippingAddress.phone}
                  onChange={(e) => changeAddress('phone', e.target.value)}
                  placeholder="(123) 456-7890"
                />
              </label>
            </div>
          </div>

          <div className="checkout-section">
            <div className="section-head">
              <h2>Delivery Method</h2>
              <p className="text-muted">Choose how your harvest arrives.</p>
            </div>
            <div className="radio-group">
              <label className={`radio-card ${deliveryMethod === 'standard' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="delivery"
                  value="standard"
                  checked={deliveryMethod === 'standard'}
                  onChange={() => setDeliveryMethod('standard')}
                />
                <div>
                  <strong>Standard delivery</strong>
                  <span>2-4 business days • {formatCurrency(4.99)}</span>
                </div>
              </label>
              <label className={`radio-card ${deliveryMethod === 'express' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="delivery"
                  value="express"
                  checked={deliveryMethod === 'express'}
                  onChange={() => setDeliveryMethod('express')}
                />
                <div>
                  <strong>Express delivery</strong>
                  <span>Next-day shipping • {formatCurrency(8.99)}</span>
                </div>
              </label>
              <label className={`radio-card ${deliveryMethod === 'pickup' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="delivery"
                  value="pickup"
                  checked={deliveryMethod === 'pickup'}
                  onChange={() => setDeliveryMethod('pickup')}
                />
                <div>
                  <strong>Farm pickup</strong>
                  <span>Pickup from local market • FREE</span>
                </div>
              </label>
            </div>
          </div>

          <div className="checkout-section">
            <div className="section-head">
              <h2>Payment Method</h2>
              <p className="text-muted">Select your preferred method.</p>
            </div>
            <div className="radio-group">
              <label className={`radio-card ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                />
                <div>
                  <strong>Credit card</strong>
                  <span>Visa, Mastercard, Amex</span>
                </div>
              </label>
              <label className={`radio-card ${paymentMethod === 'apple' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="apple"
                  checked={paymentMethod === 'apple'}
                  onChange={() => setPaymentMethod('apple')}
                />
                <div>
                  <strong>Apple Pay</strong>
                  <span>Secure quick checkout</span>
                </div>
              </label>
              <label className={`radio-card ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <div>
                  <strong>Cash on delivery</strong>
                  <span>Pay when your order arrives</span>
                </div>
              </label>
            </div>
          </div>
        </section>

        <aside className="checkout-summary-panel glass-panel">
          <div className="summary-header">
            <h2>Order Summary</h2>
            <span>{cartItems.length} items</span>
          </div>

          <div className="summary-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item-row">
                <div className="summary-item-product">
                  <img src={item.image} alt={item.title} className="summary-item-image" />
                  <div>
                    <strong>{item.title}</strong>
                    <p className="text-muted">{item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                </div>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="summary-divider" />

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(cartSubtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Delivery fee</span>
              <strong>{deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}</strong>
            </div>
            <div className="summary-row">
              <span>Coupon</span>
              <strong>{appliedCoupon ? `-${formatCurrency(couponDiscount)}` : '$0.00'}</strong>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <strong>{formatCurrency(Math.max(totalAmount, 0))}</strong>
            </div>
          </div>

          <div className="coupon-block">
            <label htmlFor="checkout-coupon" className="coupon-label">Apply coupon</label>
            <div className="coupon-input-row">
              <input
                id="checkout-coupon"
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="FARM10 or HARVEST5"
              />
              <Button variant="primary" size="sm" onClick={handleApplyCoupon}>
                Apply
              </Button>
            </div>
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={handlePlaceOrder} isLoading={placingOrder}>
            Place Order
          </Button>

          <div className="checkout-footnote text-muted">
            <FiCheckCircle /> Your order is protected with secure payment and local farm delivery.
          </div>
        </aside>
      </div>
    </div>
  );
};

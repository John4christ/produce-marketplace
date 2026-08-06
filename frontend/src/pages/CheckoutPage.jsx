import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiShoppingBag, FiTruck, FiCreditCard, FiMapPin, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { apiClient } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { isValidEmail, isValidPhone, isRequired } from '../utils/validators';
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
  const [placingOrder, setPlacingOrder] = useState(false);
  const [syncingCart, setSyncingCart] = useState(true);
  const [error, setError] = useState(null);
  const [stockErrors, setStockErrors] = useState([]);
  const [syncedBackendItems, setSyncedBackendItems] = useState([]);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    note: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});

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
        setStockErrors([]);

        const backendCartResponse = await apiClient.get('/cart');
        const backendCart = backendCartResponse?.data || backendCartResponse;
        const backendItems = backendCart?.items || [];

        const mappedItems = backendItems.map((item) => {
          const product = item.product || {};
          return {
            id: item.id,
            product_id: product.id,
            title: product.name || 'Unknown Product',
            price: Number(item.unit_price || product.price || 0),
            unit: product.unit || 'unit',
            image: product.images?.[0]?.url || '/placeholder.jpg',
            farm: product.farmer?.name || 'Local Farm',
            farmer_name: product.farmer?.name || 'Local Farm',
            quantity: Number(item.quantity || 1),
            quantity_available: Number(product.quantity_available ?? 0),
          };
        });

        setSyncedBackendItems(mappedItems);

        const backendItemMap = new Map(
          backendItems.map((item) => [item.product_id || item.product?.id, item])
        );

        for (const item of cartItems) {
          const productId = item.product_id || item.id || item.product?.id;
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

  const validateFields = () => {
    const errors = {};
    if (!isRequired(shippingAddress.fullName)) errors.fullName = 'Full name is required.';
    if (!isRequired(shippingAddress.email)) errors.email = 'Email is required.';
    else if (!isValidEmail(shippingAddress.email)) errors.email = 'Please enter a valid email address.';
    if (!isRequired(shippingAddress.phone)) errors.phone = 'Phone number is required.';
    else if (!isValidPhone(shippingAddress.phone)) errors.phone = 'Please enter a valid phone number.';
    if (!isRequired(shippingAddress.street)) errors.street = 'Delivery address is required.';
    if (!isRequired(shippingAddress.city)) errors.city = 'City is required.';
    if (!isRequired(shippingAddress.state)) errors.state = 'State is required.';
    if (!isRequired(shippingAddress.postal_code)) errors.postal_code = 'Postal code is required.';
    if (!isRequired(shippingAddress.country)) errors.country = 'Country is required.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStock = () => {
    const outOfStock = syncedBackendItems.filter(
      (item) => item.quantity_available < item.quantity
    );
    setStockErrors(outOfStock);
    return outOfStock.length === 0;
  };

  const handleChangeAddress = (field, value) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleApplyCoupon = () => {
    const normalized = coupon.trim().toUpperCase();
    if (normalized === 'FARM10') {
      setAppliedCoupon({ code: 'FARM10', label: '10% off farm orders' });
      toast.success('Coupon FARM10 applied!');
    } else if (normalized === 'HARVEST5') {
      setAppliedCoupon({ code: 'HARVEST5', label: '₦5 off your order' });
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

    if (!validateFields()) {
      toast.error('Please fix the errors in the delivery form.');
      return;
    }

    if (!validateStock()) {
      toast.error('Some items have insufficient stock. Please update your cart.');
      return;
    }

    setPlacingOrder(true);
    try {
      const orderData = {
        shipping_address: {
          full_name: shippingAddress.fullName,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postal_code,
          country: shippingAddress.country,
          note: shippingAddress.note || '',
        },
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
        email: shippingAddress.email || user?.email || '',
        callback_url: callbackUrl,
      });

      const payment = paymentResponse?.data || paymentResponse;
      if (payment?.authorization_url) {
        window.location.href = payment.authorization_url;
      } else {
        toast.error('Unable to initialize payment.');
      }
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Failed to place order. Please try again.';
      toast.error(message);
    } finally {
      setPlacingOrder(false);
    }
  };

  const displayItems = syncedBackendItems.length > 0 ? syncedBackendItems : cartItems;

  if (syncingCart && cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-hero glass-panel">
          <span className="section-tag">Checkout</span>
          <h1>Complete your order</h1>
          <p className="text-muted">Preparing your checkout...</p>
        </div>
        <div className="checkout-grid">
          <section className="checkout-form-panel glass-panel">
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Skeleton height="24px" width="180px" />
              <Skeleton height="16px" width="100%" />
              <Skeleton height="16px" width="80%" />
              <Skeleton height="40px" width="100%" />
              <Skeleton height="40px" width="100%" />
              <Skeleton height="40px" width="100%" />
            </div>
          </section>
          <aside className="checkout-summary-panel glass-panel">
            <Skeleton height="20px" width="140px" style={{ marginBottom: '1rem' }} />
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
                <Skeleton height="48px" width="48px" borderRadius="var(--radius-md)" />
                <div style={{ flex: 1 }}>
                  <Skeleton height="14px" width="70%" />
                  <Skeleton height="12px" width="40%" />
                </div>
              </div>
            ))}
            <Skeleton height="1px" width="100%" style={{ margin: '1rem 0' }} />
            <Skeleton height="16px" width="100%" />
            <Skeleton height="16px" width="100%" />
            <Skeleton height="40px" width="100%" style={{ marginTop: '1rem' }} />
          </aside>
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
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-hero glass-panel">
          <span className="section-tag">Checkout</span>
          <h1>Complete your order</h1>
          <p className="text-muted">Enter shipping and payment details to finalize your farm produce delivery.</p>
        </div>
        <div className="empty-checkout glass-panel">
          <FiShoppingBag style={{ fontSize: '3rem', color: 'var(--text-light)' }} />
          <h2>Your cart is empty</h2>
          <p>Looks like you have not added any fresh produce yet. Browse our marketplace to find the best farm products.</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/cart" className="btn btn-outline btn-lg">
              Back to Cart
            </Link>
            <Link to="/" className="btn btn-ghost btn-lg">
              Continue Shopping
            </Link>
          </div>
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
              <h2><FiUser style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Customer Information</h2>
              <p className="text-muted">Confirm your contact details before checkout.</p>
            </div>

            <div className="customer-info-grid">
              <div>
                <label>Full Name</label>
                <input type="text" value={shippingAddress.fullName} onChange={(e) => handleChangeAddress('fullName', e.target.value)} placeholder="John Doe" />
                {fieldErrors.fullName && <span className="field-error">{fieldErrors.fullName}</span>}
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={shippingAddress.email}
                  onChange={(e) => handleChangeAddress('email', e.target.value)}
                  placeholder="john@example.com"
                  disabled={!!user?.email}
                />
                {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
              </div>
              <div>
                <label>Phone Number</label>
                <input type="tel" value={shippingAddress.phone} onChange={(e) => handleChangeAddress('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
                {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <div className="section-head">
              <h2><FiMapPin style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Delivery Address</h2>
              <p className="text-muted">Where should we deliver your fresh produce?</p>
            </div>

            <div className="form-grid">
              <label className="full-width">
                Delivery Address
                <input
                  type="text"
                  value={shippingAddress.street}
                  onChange={(e) => handleChangeAddress('street', e.target.value)}
                  placeholder="123 Farm Lane, Apt 4B"
                />
                {fieldErrors.street && <span className="field-error">{fieldErrors.street}</span>}
              </label>
              <label>
                City
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => handleChangeAddress('city', e.target.value)}
                  placeholder="Sonoma"
                />
                {fieldErrors.city && <span className="field-error">{fieldErrors.city}</span>}
              </label>
              <label>
                State
                <input
                  type="text"
                  value={shippingAddress.state}
                  onChange={(e) => handleChangeAddress('state', e.target.value)}
                  placeholder="California"
                />
                {fieldErrors.state && <span className="field-error">{fieldErrors.state}</span>}
              </label>
              <label>
                Postal Code
                <input
                  type="text"
                  value={shippingAddress.postal_code}
                  onChange={(e) => handleChangeAddress('postal_code', e.target.value)}
                  placeholder="94952"
                />
                {fieldErrors.postal_code && <span className="field-error">{fieldErrors.postal_code}</span>}
              </label>
              <label>
                Country
                <input
                  type="text"
                  value={shippingAddress.country}
                  onChange={(e) => handleChangeAddress('country', e.target.value)}
                  placeholder="USA"
                />
                {fieldErrors.country && <span className="field-error">{fieldErrors.country}</span>}
              </label>
              <label className="full-width">
                Delivery Note <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(optional)</span>
                <textarea
                  className="textarea-field"
                  value={shippingAddress.note}
                  onChange={(e) => handleChangeAddress('note', e.target.value)}
                  placeholder="Gate code, special instructions, preferred delivery time..."
                  rows={3}
                />
              </label>
            </div>
          </div>

          <div className="checkout-section">
            <div className="section-head">
              <h2><FiTruck style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Delivery Method</h2>
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
              <h2><FiCreditCard style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Payment Method</h2>
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
            {displayItems.map((item) => (
              <div key={item.id} className="summary-item-row">
                <div className="summary-item-product">
                  <img src={item.image} alt={item.title} className="summary-item-image" />
                  <div>
                    <strong>{item.title}</strong>
                    <p className="summary-item-meta">
                      {item.farm || item.farmer_name} • {item.quantity} × {formatCurrency(item.price)} / {item.unit || 'unit'}
                    </p>
                  </div>
                </div>
                <span className="summary-item-subtotal">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {stockErrors.length > 0 && (
            <div className="stock-error">
              <strong>Stock issue:</strong> {stockErrors.map((i) => i.title).join(', ')} — please update quantities or remove items.
            </div>
          )}

          <div className="summary-divider" />

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(cartSubtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <strong>{deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}</strong>
            </div>
            <div className="summary-row">
              <span>Coupon</span>
              <strong>{appliedCoupon ? `-${formatCurrency(couponDiscount)}` : formatCurrency(0)}</strong>
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
            {appliedCoupon && (
              <p className="coupon-info" style={{ marginTop: '0.5rem' }}>Applied {appliedCoupon.code}: {appliedCoupon.label}</p>
            )}
          </div>

          <div className="checkout-buttons">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handlePlaceOrder}
              isLoading={placingOrder}
              disabled={stockErrors.length > 0}
            >
              {placingOrder ? 'Processing...' : 'Proceed to Payment'}
            </Button>
            <div className="btn-row">
              <Link to="/cart" className="btn btn-outline btn-md" style={{ flex: 1, textAlign: 'center' }}>
                Back to Cart
              </Link>
              <Link to="/" className="btn btn-ghost btn-md" style={{ flex: 1, textAlign: 'center' }}>
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="checkout-footnote">
            <FiCheckCircle /> Your order is protected with secure payment and local farm delivery.
          </div>
        </aside>
      </div>
    </div>
  );
};

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiTruck, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { toast } from 'react-toastify';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal } = useCart();
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  });

  const deliveryFee = deliveryMethod === 'express' ? 8.99 : deliveryMethod === 'pickup' ? 0 : 4.99;

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

  const handlePlaceOrder = () => {
    if (!cartItems.length) {
      toast.error('Your cart is empty. Add items before placing an order.');
      return;
    }

    if (!shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country || !shippingAddress.phone) {
      toast.error('Please complete your shipping address.');
      return;
    }

    toast.success('Order placed! Thank you for supporting local farms.');
    navigate('/');
  };

  const changeAddress = (field, value) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

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
              <h2>Shipping Address</h2>
              <p className="text-muted">Where should we deliver your fresh produce?</p>
            </div>

            <div className="form-grid">
              <label>
                Full name
                <input
                  type="text"
                  value={shippingAddress.fullName}
                  onChange={(e) => changeAddress('fullName', e.target.value)}
                  placeholder="Jane Doe"
                />
              </label>
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
                Postal code
                <input
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) => changeAddress('postalCode', e.target.value)}
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
                <div>
                  <strong>{item.title}</strong>
                  <p className="text-muted">{item.quantity} × {formatCurrency(item.price)}</p>
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

          <Button variant="primary" size="lg" fullWidth onClick={handlePlaceOrder}>
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

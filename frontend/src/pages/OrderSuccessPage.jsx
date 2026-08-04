import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiShoppingBag, FiHome } from 'react-icons/fi';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'react-toastify';

export const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearCart } = useCart();

  const handleGoToOrders = () => {
    navigate('/orders');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleContinueShopping = () => {
    navigate('/catalog');
  };

  return (
    <div className="order-success-page">
      <div className="page-header glass-panel">
        <span className="section-tag">Order Confirmed</span>
        <h1>Thank you for your order!</h1>
        <p className="text-muted">
          Your order has been placed successfully. You will receive a confirmation email shortly.
        </p>
      </div>

      <div className="page-body">
        <div className="success-card glass-panel">
          <div className="success-icon">
            <FiCheckCircle />
          </div>
          <h2>Order Placed Successfully</h2>
          <p className="text-muted">
            Hi {user?.name || 'Customer'}, your order has been confirmed and is now being processed.
          </p>

          <div className="success-details">
            <div className="detail-row">
              <span>Order Status</span>
              <strong>Pending</strong>
            </div>
            <div className="detail-row">
              <span>Payment</span>
              <strong>Awaiting Payment</strong>
            </div>
            <div className="detail-row">
              <span>Estimated Delivery</span>
              <strong>3-5 business days</strong>
            </div>
          </div>

          <div className="success-actions">
            <Button variant="primary" size="lg" onClick={handleGoToOrders} icon={FiShoppingBag}>
              View My Orders
            </Button>
            <Button variant="outline" size="lg" onClick={handleContinueShopping} icon={FiHome}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

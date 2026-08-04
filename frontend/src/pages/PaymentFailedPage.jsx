import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiXCircle, FiRefreshCw, FiHome, FiShoppingBag } from 'react-icons/fi';
import { Button } from '../components/common/Button';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export const PaymentFailedPage = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const handleRetryPayment = () => {
    navigate('/checkout');
  };

  const handleGoToOrders = () => {
    navigate('/orders');
  };

  const handleContinueShopping = () => {
    navigate('/catalog');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="payment-failed-page">
      <div className="page-header glass-panel">
        <span className="section-tag">Payment Failed</span>
        <h1>Payment Not Completed</h1>
        <p className="text-muted">
          Your payment could not be processed. Please try again or use a different payment method.
        </p>
      </div>

      <div className="page-body">
        <div className="failed-card glass-panel">
          <div className="failed-icon">
            <FiXCircle />
          </div>
          <h2>Payment Failed</h2>
          <p className="text-muted">
            We were unable to process your payment. Your cart has been preserved so you can try again.
          </p>

          <div className="failed-actions">
            <Button variant="primary" size="lg" onClick={handleRetryPayment} icon={FiRefreshCw}>
              Retry Payment
            </Button>
            <Button variant="outline" size="lg" onClick={handleGoToOrders} icon={FiShoppingBag}>
              View My Orders
            </Button>
            <Button variant="ghost" size="lg" onClick={handleContinueShopping} icon={FiHome}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

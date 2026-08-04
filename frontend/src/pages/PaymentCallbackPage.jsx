import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { apiClient } from '../services/api';
import { Button } from '../components/common/Button';
import { toast } from 'react-toastify';

export const PaymentCallbackPage = () => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('Verifying payment...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      if (!reference) {
        setStatus('failed');
        setMessage('No payment reference found.');
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.post('/payments/verify', { reference });
        const result = response?.data || response;
        if (result.success) {
          clearCart();
          setStatus('success');
          setMessage('Payment verified successfully. Your order is confirmed.');
          toast.success('Payment verified successfully.');
          setTimeout(() => {
            navigate('/orders');
          }, 2000);
        } else {
          setStatus('failed');
          setMessage(result.message || 'Payment verification failed.');
          toast.error(result.message || 'Payment verification failed.');
        }
      } catch (err) {
        setStatus('failed');
        setMessage(err.message || 'Unable to verify payment.');
        toast.error(err.message || 'Unable to verify payment.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [navigate, searchParams]);

  return (
    <div className="payment-callback-page">
      <div className="page-header glass-panel">
        <span className="section-tag">Payment Status</span>
        <h1>{status === 'success' ? 'Payment Confirmed' : 'Payment Verification'}</h1>
        <p className="text-muted">{message}</p>
      </div>

      <div className="page-body glass-panel">
        {loading ? (
          <div className="loading-block">
            <span className="loader" />
            <p>Checking payment status with Paystack...</p>
          </div>
        ) : (
          <div className="result-block">
            <p>{message}</p>
            <Button variant="primary" onClick={() => navigate('/orders')}>
              Go to My Orders
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
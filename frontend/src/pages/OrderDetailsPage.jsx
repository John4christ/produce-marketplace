import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { toast } from 'react-toastify';

export const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get(`/orders/${orderId}`);
        setOrder(response?.data || response);
      } catch (err) {
        setError(err.message || 'Unable to load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="page-header glass-panel">
          <h1>Order Details</h1>
          <p className="text-muted">Loading your order status and line items.</p>
        </div>
        <div className="page-body">
          <div className="skeleton-panel" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details-page">
        <div className="page-header glass-panel">
          <h1>Order Details</h1>
          <p className="text-muted">{error}</p>
        </div>
        <div className="page-body">
          <Button variant="primary" onClick={() => navigate('/orders')}>Back to Orders</Button>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="order-details-page">
      <div className="page-header glass-panel">
        <div>
          <span className="section-tag">Order #{order.order_number}</span>
          <h1>Order Summary</h1>
          <p className="text-muted">Status: <Badge variant={order.status === 'delivered' ? 'green' : order.status === 'processing' ? 'primary' : order.status === 'pending' ? 'amber' : 'red'}>{order.status}</Badge></p>
        </div>
        <Button variant="outline" onClick={() => navigate('/orders')}>Back to Orders</Button>
      </div>

      <div className="order-details-grid">
        <section className="order-details-panel glass-panel">
          <h2>Delivery Information</h2>
          <p><strong>Address:</strong></p>
          <p>{order.shipping_address?.street}</p>
          <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postal_code}</p>
          <p>{order.shipping_address?.country}</p>
          {order.shipping_address?.phone && <p><strong>Phone:</strong> {order.shipping_address.phone}</p>}
          <p><strong>Delivery method:</strong> {order.delivery_method}</p>
          {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
        </section>

        <section className="order-items-panel glass-panel">
          <h2>Order Items</h2>
          <div className="order-items-list">
            {order.items?.map((item) => (
              <div key={item.id} className="order-item-row">
                <div>
                  <h3>{item.product_name}</h3>
                  <p className="text-muted">{item.product_unit} &middot; {item.quantity} × {formatCurrency(item.unit_price)}</p>
                </div>
                <strong>{formatCurrency(item.subtotal)}</strong>
              </div>
            ))}
          </div>

          <div className="order-summary-block">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(order.subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <strong>{formatCurrency(order.shipping_cost)}</strong>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <strong>{formatCurrency(order.total)}</strong>
            </div>
            {order.payments?.length > 0 && (
              <div className="payment-history-block">
                <h3>Payment</h3>
                {order.payments.map((payment) => (
                  <div key={payment.id} className="payment-row">
                    <span>{payment.provider} • {payment.reference}</span>
                    <strong>{payment.status}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

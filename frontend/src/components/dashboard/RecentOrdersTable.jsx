import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { FiRefreshCw, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';

export const RecentOrdersTable = () => {
  const mockOrders = [
    {
      id: 'ORD-9482',
      date: 'Today, 8:30 AM',
      farm: 'SunValley Orchards',
      itemsCount: '4 Items',
      total: 24.95,
      status: 'In Transit',
      statusType: 'amber',
      icon: FiTruck
    },
    {
      id: 'ORD-9210',
      date: 'July 24, 2026',
      farm: 'Green Acre Organics',
      itemsCount: '6 Items',
      total: 38.50,
      status: 'Delivered',
      statusType: 'primary',
      icon: FiCheckCircle
    },
    {
      id: 'ORD-8941',
      date: 'July 18, 2026',
      farm: 'Willow Creek Farm',
      itemsCount: '3 Items',
      total: 19.99,
      status: 'Delivered',
      statusType: 'primary',
      icon: FiCheckCircle
    }
  ];

  const handleReorder = (orderId) => {
    toast.success(`Items from order ${orderId} added to your cart!`, { autoClose: 2500 });
  };

  return (
    <div className="orders-table-wrapper glass-panel">
      <div className="table-header flex-between">
        <div>
          <h3 className="table-title">Recent Farm Orders</h3>
          <p className="table-subtitle">Track live delivery status & reorder farm baskets</p>
        </div>
      </div>

      <div className="table-responsive">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Farm Source</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order) => {
              const StatusIcon = order.icon;
              return (
                <tr key={order.id}>
                  <td className="font-mono font-semibold">{order.id}</td>
                  <td className="text-muted">{order.date}</td>
                  <td className="font-semibold">{order.farm}</td>
                  <td>{order.itemsCount}</td>
                  <td className="font-semibold">{formatCurrency(order.total)}</td>
                  <td>
                    <Badge variant={order.statusType}>
                      <StatusIcon className="icon-tiny" /> {order.status}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={FiRefreshCw}
                      onClick={() => handleReorder(order.id)}
                    >
                      Reorder
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

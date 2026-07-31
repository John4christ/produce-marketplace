import React from 'react';
import { ProduceCard } from './ProduceCard';
import { Skeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';

export const ProduceGrid = ({
  products = [],
  isLoading = false,
  error = null,
  onRetry
}) => {
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (isLoading) {
    return (
      <div className="produce-grid">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="produce-card-skeleton glass-panel">
            <Skeleton height="200px" borderRadius="var(--radius-md) var(--radius-md) 0 0" />
            <div style={{ padding: '1rem' }}>
              <Skeleton height="16px" width="60%" className="mb-2" />
              <Skeleton height="24px" width="90%" className="mb-2" />
              <Skeleton height="16px" width="40%" className="mb-4" />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton height="28px" width="30%" />
                <Skeleton height="36px" width="35%" borderRadius="var(--radius-sm)" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <EmptyState title="No produce found" description="Try selecting a different harvest category or adjusting your search term." />;
  }

  return (
    <div className="produce-grid">
      {products.map((product) => (
        <ProduceCard key={product.id} product={product} />
      ))}
    </div>
  );
};

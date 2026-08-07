import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { apiClient } from '../services/api';
import { Skeleton } from '../components/common/Skeleton';
import { MOCK_CATEGORIES } from '../services/mockData';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    apiClient
      .get('/categories', { params: { per_page: 50 } })
      .then((response) => {
        if (!isActive) return;
        const data = Array.isArray(response?.data) ? response.data : [];
        if (data.length > 0) setCategories(data);
      })
      .catch(() => {
        // Keep MOCK_CATEGORIES as a fallback so the page still renders.
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const categoryValue = (cat) => cat.slug || String(cat.id);

  return (
    <div className="static-page categories-page">
      <div className="container">
        <div className="static-page-header">
          <span className="section-tag">Shop By Harvest</span>
          <h1 className="page-title">Browse Categories</h1>
          <p className="section-subtitle">
            Explore our curated produce categories, from crisp greens to raw wildflower honey.
          </p>
        </div>

        <div className="categories-grid">
          <Link to="/products" className="category-card glass-panel">
            <div className="category-icon-box">🌱</div>
            <div className="category-info">
              <h3 className="category-name">All Farm Harvests</h3>
              <span className="category-count">Show All Produce</span>
            </div>
            <FiChevronRight className="category-arrow" />
          </Link>

          {isLoading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="category-card glass-panel">
                  <div className="category-icon-box">
                    <Skeleton width="32px" height="32px" borderRadius="var(--radius-full)" />
                  </div>
                  <div className="category-info" style={{ flex: 1 }}>
                    <Skeleton width="60%" height="18px" className="mb-2" />
                    <Skeleton width="85%" height="14px" />
                  </div>
                </div>
              ))
            : categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${encodeURIComponent(categoryValue(cat))}`}
                  className="category-card glass-panel"
                >
                  <div className="category-icon-box">{cat.icon || '📦'}</div>
                  <div className="category-info">
                    <h3 className="category-name">{cat.name}</h3>
                    <span className="category-count">
                      {cat.description || 'Browse fresh harvests'}
                    </span>
                  </div>
                  <FiChevronRight className="category-arrow" />
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
};

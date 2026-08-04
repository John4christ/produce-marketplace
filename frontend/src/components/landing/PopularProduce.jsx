import React, { useState } from 'react';
import { ProduceGrid } from '../produce/ProduceGrid';
import { Button } from '../common/Button';
import { FiFilter, FiCheck } from 'react-icons/fi';

export const PopularProduce = ({
  products = [],
  isLoading = false,
  error = null,
  activeCategory,
  onCategoryChange,
  onRetry
}) => {
  const [onlyOrganic, setOnlyOrganic] = useState(false);

  const filteredProducts = products.filter((p) => {
    const categorySlug = p.category?.slug || p.category?.name || '';
    const matchesCategory = activeCategory === 'all' || categorySlug === activeCategory;
    const matchesOrganic = !onlyOrganic || p.isOrganic;
    return matchesCategory && matchesOrganic;
  });

  return (
    <section className="popular-produce-section" id="popular-harvest">
      <div className="container">
        <div className="section-header flex-between reveal-on-scroll">
          <div>
            <span className="section-tag">Popular Right Now</span>
            <h2 className="section-title">Today's Fresh Harvest</h2>
          </div>

          <div className="filter-controls">
            <button
              className={`filter-chip ${onlyOrganic ? 'active' : ''}`}
              onClick={() => setOnlyOrganic(!onlyOrganic)}
            >
              <FiCheck className="chip-check" /> 100% Organic Only
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="category-tabs reveal-on-scroll">
          <button
            className={`tab-item ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => onCategoryChange('all')}
          >
            All Harvest
          </button>
          <button
            className={`tab-item ${activeCategory === 'fruits' ? 'active' : ''}`}
            onClick={() => onCategoryChange('fruits')}
          >
            Organic Fruits
          </button>
          <button
            className={`tab-item ${activeCategory === 'vegetables' ? 'active' : ''}`}
            onClick={() => onCategoryChange('vegetables')}
          >
            Vegetables
          </button>
          <button
            className={`tab-item ${activeCategory === 'dairy' ? 'active' : ''}`}
            onClick={() => onCategoryChange('dairy')}
          >
            Eggs & Dairy
          </button>
          <button
            className={`tab-item ${activeCategory === 'honey' ? 'active' : ''}`}
            onClick={() => onCategoryChange('honey')}
          >
            Honey & Oils
          </button>
        </div>

        <ProduceGrid
          products={filteredProducts}
          isLoading={isLoading}
          error={error}
          onRetry={onRetry}
        />
      </div>
    </section>
  );
};

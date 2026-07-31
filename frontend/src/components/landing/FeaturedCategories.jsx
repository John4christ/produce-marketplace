import React from 'react';
import { MOCK_CATEGORIES } from '../../services/mockData';
import { FiChevronRight } from 'react-icons/fi';

export const FeaturedCategories = ({ selectedCategory, onSelectCategory }) => {
  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header text-center reveal-on-scroll">
          <span className="section-tag">Explore By Harvest</span>
          <h2 className="section-title">Shop Fresh Local Categories</h2>
          <p className="section-subtitle">
            Carefully curated produce grown with organic integrity by our partner farmers.
          </p>
        </div>

        <div className="categories-grid reveal-on-scroll">
          <button
            className={`category-card glass-panel ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => onSelectCategory('all')}
          >
            <div className="category-icon-box">🌱</div>
            <div className="category-info">
              <h3 className="category-name">All Farm Harvests</h3>
              <span className="category-count">Show All Produce</span>
            </div>
            <FiChevronRight className="category-arrow" />
          </button>

          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-card glass-panel ${selectedCategory === cat.slug ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.slug)}
            >
              <div className="category-icon-box">{cat.icon}</div>
              <div className="category-info">
                <h3 className="category-name">{cat.name}</h3>
                <span className="category-count">{cat.count}+ fresh items</span>
              </div>
              <FiChevronRight className="category-arrow" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

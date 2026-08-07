import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { apiClient } from '../services/api';
import { ProduceGrid } from '../components/produce/ProduceGrid';
import { MOCK_CATEGORIES } from '../services/mockData';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategory = searchParams.get('category') || 'all';

  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiClient.get('/categories', { params: { per_page: 50 } });
      const data = Array.isArray(response?.data) ? response.data : [];
      if (data.length > 0) setCategories(data);
    } catch {
      // Keep MOCK_CATEGORIES as a fallback so the page still renders.
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiCategory = categories.find(
        (cat) => String(cat.id) === activeCategory || cat.slug === activeCategory
      );
      const isMockCategory = !apiCategory || !Number.isFinite(Number(apiCategory.id));

      const params = { status: 'published', per_page: 48 };
      if (apiCategory && !isMockCategory) {
        params.category_id = apiCategory.id;
      }

      const response = await apiClient.get('/products', { params });
      const productsData = response?.data || response;
      let items = Array.isArray(productsData) ? productsData : productsData?.data || [];

      if (isMockCategory && activeCategory !== 'all') {
        const slug = apiCategory?.slug || activeCategory;
        items = items.filter((p) => {
          const catSlug = p.category?.slug || p.category?.name?.toLowerCase() || '';
          return catSlug === slug || catSlug === activeCategory;
        });
      }

      setProducts(items);
    } catch (err) {
      setError(err.message || 'Failed to load products.');
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, categories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const visibleProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;

    return products.filter((p) => {
      const name = (p.name || '').toLowerCase();
      const description = (p.description || '').toLowerCase();
      const category = (p.category?.name || '').toLowerCase();
      const farmer = (p.farmer?.name || '').toLowerCase();
      return (
        name.includes(query) ||
        description.includes(query) ||
        category.includes(query) ||
        farmer.includes(query)
      );
    });
  }, [products, searchQuery]);

  const handleCategorySelect = (value) => {
    if (value === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: value });
    }
  };

  const categoryValue = (cat) => cat.slug || String(cat.id);

  return (
    <div className="static-page products-page">
      <div className="container">
        <div className="static-page-header">
          <span className="section-tag">Fresh Marketplace</span>
          <h1 className="page-title">Explore Fresh Produce</h1>
          <p className="section-subtitle">
            Field-picked organic harvests from verified local growers across the country.
          </p>
        </div>

        <div className="products-toolbar">
          <div className="products-search">
            <FiSearch className="products-search-icon" />
            <input
              type="text"
              placeholder="Search produce, farms or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="products-search-input"
              aria-label="Search produce"
            />
          </div>
        </div>

        <div className="products-filter-row">
          <div className="category-pills-row">
            <button
              className={`cat-pill-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategorySelect('all')}
            >
              <span className="pill-emoji">🌐</span>
              <span>All Categories</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`cat-pill-btn ${activeCategory === categoryValue(cat) ? 'active' : ''}`}
                onClick={() => handleCategorySelect(categoryValue(cat))}
              >
                <span className="pill-emoji">{cat.icon || '📦'}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="products-count">
          {isLoading
            ? 'Loading fresh harvest...'
            : `Showing ${visibleProducts.length} fresh ${visibleProducts.length === 1 ? 'item' : 'items'}`}
        </div>

        <ProduceGrid
          products={visibleProducts}
          isLoading={isLoading}
          error={error}
          onRetry={fetchProducts}
        />
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturedCategories } from '../components/landing/FeaturedCategories';
import { PopularProduce } from '../components/landing/PopularProduce';
import { WhyChooseUs } from '../components/landing/WhyChooseUs';
import { FarmerShowcase } from '../components/landing/FarmerShowcase';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { StatisticsSection } from '../components/landing/StatisticsSection';
import { NewsletterSection } from '../components/landing/NewsletterSection';
import { JoinCommunityCTA } from '../components/landing/JoinCommunityCTA';
import api from '../services/api';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useScrollAnimation();

  const fetchProduce = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/products', {
        params: {
          status: 'published',
          per_page: 12,
        },
      });

      const productsData = response?.data || response;
      const items = Array.isArray(productsData) ? productsData : productsData?.data || [];
      setProducts(items);
    } catch (err) {
      setError('Failed to fetch harvest data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduce();
  }, []);

  const handleSearchSubmit = (searchTerm) => {
    if (!searchTerm) {
      fetchProduce();
      return;
    }

    const lower = searchTerm.toLowerCase();
    const filtered = products.filter((item) => {
      const name = item.name?.toLowerCase() || '';
      const category = item.category?.name?.toLowerCase() || '';
      return name.includes(lower) || category.includes(lower);
    });
    setProducts(filtered);

    const elem = document.getElementById('popular-harvest');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page">
      <HeroSection onSearchSubmit={handleSearchSubmit} />
      <StatisticsSection />
      <FeaturedCategories
        selectedCategory={activeCategory}
        onSelectCategory={(slug) => setActiveCategory(slug)}
      />
      <PopularProduce
        products={products}
        isLoading={isLoading}
        error={error}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onRetry={fetchProduce}
      />
      <WhyChooseUs />
      <FarmerShowcase />
      <TestimonialsSection />
      <JoinCommunityCTA />
      <NewsletterSection />
    </div>
  );
};

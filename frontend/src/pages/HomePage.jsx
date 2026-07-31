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
import { MOCK_PRODUCE } from '../services/mockData';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { toast } from 'react-toastify';

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Trigger scroll reveal animations
  useScrollAnimation();

  const fetchProduce = () => {
    setIsLoading(true);
    setError(null);

    // Simulate API fetch delay
    setTimeout(() => {
      try {
        setProducts(MOCK_PRODUCE);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch harvest data. Please refresh.');
        setIsLoading(false);
        toast.error('Could not load produce items.');
      }
    }, 800);
  };

  useEffect(() => {
    fetchProduce();
  }, []);

  const handleSearchSubmit = (searchTerm) => {
    if (!searchTerm) {
      setProducts(MOCK_PRODUCE);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = MOCK_PRODUCE.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.farm.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower)
    );
    setProducts(filtered);

    // Smooth scroll to results
    const elem = document.getElementById('popular-harvest');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <HeroSection onSearchSubmit={handleSearchSubmit} />

      {/* 2. Statistics Section */}
      <StatisticsSection />

      {/* 3. Featured Harvest Categories */}
      <FeaturedCategories
        selectedCategory={activeCategory}
        onSelectCategory={(slug) => setActiveCategory(slug)}
      />

      {/* 4. Popular Produce Items (Filterable Grid with Skeleton / Error / Empty States) */}
      <PopularProduce
        products={products}
        isLoading={isLoading}
        error={error}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onRetry={fetchProduce}
      />

      {/* 5. Why Choose Us (Benefits) */}
      <WhyChooseUs />

      {/* 6. Farmer Showcase */}
      <FarmerShowcase />

      {/* 7. Testimonials */}
      <TestimonialsSection />

      {/* 8. Join Community CTA */}
      <JoinCommunityCTA />

      {/* 9. Newsletter Section */}
      <NewsletterSection />
    </div>
  );
};

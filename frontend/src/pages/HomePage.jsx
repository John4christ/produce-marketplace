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
import { toast } from 'react-toastify';

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Trigger scroll reveal animations
  useScrollAnimation();
const fetchProduce = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const response = await api.get("/products");

console.log("API RESPONSE:", response);
console.log("response.data:", response.data);
console.log("response.data.data:", response.data?.data);
console.log("response.data.data.data:", response.data?.data?.data);

if (Array.isArray(response)) {
 setProducts(response.data.data);
} else if (Array.isArray(response.data)) {
  setProducts(response.data);
} else if (Array.isArray(response.data?.data)) {
  setProducts(response.data.data);
} else {
  console.log("UNKNOWN RESPONSE:", response);
}
    setIsLoading(false);
  } catch (err) {
    console.error(err);
    setError("Failed to fetch harvest data.");
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

  const filtered = products.filter(
    (item) =>
      item.title.toLowerCase().includes(lower) ||
      item.category.toLowerCase().includes(lower)
  );

  setProducts(filtered);

  const elem = document.getElementById("popular-harvest");

  if (elem) {
    elem.scrollIntoView({ behavior: "smooth" });
  }
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

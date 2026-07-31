import React, { useState } from 'react';
import { FiSearch, FiMapPin, FiArrowRight, FiCheckCircle, FiShield } from 'react-icons/fi';
import { Button } from '../common/Button';
import { sanitizeInput } from '../../utils/sanitize';
import { validateSearchQuery } from '../../utils/validators';

export const HeroSection = ({ onSearchSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Sonoma & Napa Valley, CA');
  const [searchError, setSearchError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const sanitized = sanitizeInput(searchQuery);
    const validation = validateSearchQuery(sanitized);

    if (!validation.isValid) {
      setSearchError(validation.error);
      return;
    }

    setSearchError('');
    if (onSearchSubmit) {
      onSearchSubmit(sanitized);
    }
  };

  return (
    <section className="hero-section">
      <div className="container hero-container">
        <div className="hero-content reveal-on-scroll">
          <div className="hero-badge">
            <FiShield className="icon-green" />
            <span>100% Certified Direct-From-Farm Produce</span>
          </div>

          <h1 className="hero-title">
            Taste Pure <span className="text-gradient">Organic Freshness</span> Picked at Dawn.
          </h1>

          <p className="hero-subtitle">
            Connecting conscious households directly with local independent farmers. Enjoy same-day harvested fruits, vegetables, eggs, and raw honey with complete origin transparency.
          </p>

          <form className="hero-search-box glass-panel" onSubmit={handleSearch}>
            <div className="search-input-wrap">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search heirloom apples, organic spinach, raw honey..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search produce"
                className="hero-input"
              />
            </div>

            <div className="search-location-wrap">
              <FiMapPin className="location-icon" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Select farm radius location"
                className="hero-select"
              >
                <option value="Sonoma & Napa Valley, CA">Sonoma & Napa Valley</option>
                <option value="Bay Area, CA">Bay Area (within 25mi)</option>
                <option value="Sacramento Valley, CA">Sacramento Valley</option>
              </select>
            </div>

            <Button type="submit" variant="primary" size="lg" icon={FiArrowRight}>
              Search Harvest
            </Button>
          </form>

          {searchError && <p className="hero-search-error">{searchError}</p>}

          <div className="hero-trust-indicators">
            <div className="trust-item">
              <FiCheckCircle className="trust-icon" />
              <span>Zero Pesticides</span>
            </div>
            <div className="trust-item">
              <FiCheckCircle className="trust-icon" />
              <span>Same-Day Field Picked</span>
            </div>
            <div className="trust-item">
              <FiCheckCircle className="trust-icon" />
              <span>85% Profits To Farmers</span>
            </div>
          </div>
        </div>

        <div className="hero-visual reveal-on-scroll">
          <div className="hero-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80"
              alt="Fresh organic produce basket harvest"
              className="hero-main-img"
            />

            {/* Floating Card 1 */}
            <div className="hero-floating-card card-top glass-panel">
              <div className="floating-avatar">🚜</div>
              <div>
                <h4 className="floating-title">100% Farm Traceable</h4>
                <p className="floating-sub">Harvested today by SunValley Orchards</p>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="hero-floating-card card-bottom glass-panel">
              <div className="floating-avatar">⭐ 4.95</div>
              <div>
                <h4 className="floating-title">Over 25,000+ Orders</h4>
                <p className="floating-sub">Fresh eco-friendly delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

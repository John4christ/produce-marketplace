import React from 'react';
import { MOCK_FARMERS } from '../../services/mockData';
import { FiStar, FiMapPin, FiAward, FiCheckCircle } from 'react-icons/fi';
import { Badge } from '../common/Badge';

export const FarmerShowcase = () => {
  return (
    <section className="farmers-section" id="meet-farmers">
      <div className="container">
        <div className="section-header text-center reveal-on-scroll">
          <span className="section-tag">Meet The Growers</span>
          <h2 className="section-title">Independent Partner Farmers</h2>
          <p className="section-subtitle">
            Every harvest item connects you directly with a dedicated agricultural family in your region.
          </p>
        </div>

        <div className="farmers-grid">
          {MOCK_FARMERS.map((farmer) => (
            <article key={farmer.id} className="farmer-card glass-panel reveal-on-scroll">
              <div className="farmer-cover-wrap">
                <img src={farmer.cover} alt={farmer.farmName} className="farmer-cover" />
                <Badge variant="amber" className="farmer-badge-float">
                  <FiAward className="icon-tiny" /> {farmer.badge}
                </Badge>
              </div>

              <div className="farmer-avatar-wrap">
                <img src={farmer.avatar} alt={farmer.name} className="farmer-avatar" />
              </div>

              <div className="farmer-content">
                <h3 className="farmer-name">{farmer.name}</h3>
                <p className="farmer-farm-title">{farmer.farmName}</p>

                <div className="farmer-meta flex-center gap-2">
                  <span className="meta-item">
                    <FiMapPin /> {farmer.location}
                  </span>
                  <span className="meta-item">
                    <FiStar className="star-filled" /> {farmer.rating}
                  </span>
                </div>

                <div className="farmer-details-list">
                  <div className="detail-row">
                    <span className="detail-label">Specialty:</span>
                    <span className="detail-val">{farmer.specialty}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Practice:</span>
                    <span className="detail-val">{farmer.experience}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Impact:</span>
                    <span className="detail-val highlight">{farmer.salesCount}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

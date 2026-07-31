import React from 'react';
import { MOCK_WHY_CHOOSE } from '../../services/mockData';

export const WhyChooseUs = () => {
  return (
    <section className="why-choose-section">
      <div className="container">
        <div className="section-header text-center reveal-on-scroll">
          <span className="section-tag">Direct Farm Advantage</span>
          <h2 className="section-title">Why Choose AgriHarvest?</h2>
          <p className="section-subtitle">
            We bridge the gap between conscientious organic farmers and families looking for clean, nutrient-dense food.
          </p>
        </div>

        <div className="why-grid">
          {MOCK_WHY_CHOOSE.map((item, idx) => (
            <div key={idx} className="why-card glass-panel reveal-on-scroll">
              <div className="why-icon">{item.icon}</div>
              <h3 className="why-title">{item.title}</h3>
              <p className="why-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

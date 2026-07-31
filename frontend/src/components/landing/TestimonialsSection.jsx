import React from 'react';
import { MOCK_TESTIMONIALS } from '../../services/mockData';
import { FiStar, FiCheckCircle } from 'react-icons/fi';

export const TestimonialsSection = () => {
  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header text-center reveal-on-scroll">
          <span className="section-tag">Community Feedback</span>
          <h2 className="section-title">Loved by Chefs & Conscious Families</h2>
          <p className="section-subtitle">
            See what chefs, mothers, and nutritionists are saying about our farm-fresh delivery experience.
          </p>
        </div>

        <div className="testimonials-grid">
          {MOCK_TESTIMONIALS.map((item) => (
            <div key={item.id} className="testimonial-card glass-panel reveal-on-scroll">
              <div className="testimonial-stars">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <FiStar key={i} className="star-filled" />
                ))}
              </div>
              <p className="testimonial-quote">"{item.comment}"</p>
              <div className="testimonial-author">
                <img src={item.avatar} alt={item.name} className="author-avatar" />
                <div>
                  <h4 className="author-name">{item.name}</h4>
                  <p className="author-role">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

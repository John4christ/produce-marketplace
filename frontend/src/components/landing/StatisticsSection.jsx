import React from 'react';
import { MOCK_STATS } from '../../services/mockData';

export const StatisticsSection = () => {
  return (
    <section className="stats-banner">
      <div className="container">
        <div className="stats-grid glass-panel reveal-on-scroll">
          {MOCK_STATS.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-value text-gradient">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

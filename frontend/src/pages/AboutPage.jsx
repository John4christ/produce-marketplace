import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

export const AboutPage = () => {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-page-header">
          <span className="section-tag">Our Story</span>
          <h1 className="page-title">About AgriHarvest</h1>
          <p className="section-subtitle">
            We are on a mission to connect local organic growers directly with conscious consumers.
          </p>
        </div>

        <div className="static-page-content">
          <div className="static-card">
            <h2>Who We Are</h2>
            <p>
              AgriHarvest is a direct farm-to-table produce marketplace. We partner with
              independent, certified organic growers so that fresh harvests go from field to
              fork without the unnecessary layers, markups, and long storage times of
              traditional grocery supply chains.
            </p>

            <h2>Our Mission</h2>
            <p>
              Every farmer deserves a fair price for honest work, and every family deserves
              food they can trust. By cutting out supermarket middlemen, we return more of
              every dollar directly to the people who grow your food while giving you full
              farm-level traceability on every single order.
            </p>

            <h2>Why Shoppers Choose Us</h2>
            <ul className="static-list">
              <li>100% farm-traceable produce with named, verified growers.</li>
              <li>Zero pesticide, zero unnecessary plastic packaging.</li>
              <li>Same-day field-picked freshness in eco-friendly transport.</li>
              <li>Fair, transparent pricing for both buyers and farmers.</li>
            </ul>

            <h2>Why Farmers Grow With Us</h2>
            <ul className="static-list">
              <li>Direct access to a nationwide community of conscious buyers.</li>
              <li>Transparent commission structure and fair pricing commitments.</li>
              <li>Tools to list, manage, and grow their harvest sales with ease.</li>
              <li>A partner committed to supporting local, independent agriculture.</li>
            </ul>

            <h2>Join Our Community</h2>
            <p>
              Whether you want to buy your family's produce directly from the farm or grow
              with us as a seller, we would love to have you. Explore our{' '}
              <Link to="/products" className="inline-link">fresh marketplace</Link>, browse{' '}
              <Link to="/categories" className="inline-link">our categories</Link>, or{' '}
              <Link to="/contact" className="inline-link">get in touch</Link> with our team.
            </p>

            <div className="static-highlights">
              <div className="static-highlight">
                <FiCheckCircle className="icon-green" />
                <strong>450+</strong>
                <span>Local independent farmers</span>
              </div>
              <div className="static-highlight">
                <FiCheckCircle className="icon-green" />
                <strong>25,000+</strong>
                <span>100% traceable harvests</span>
              </div>
              <div className="static-highlight">
                <FiCheckCircle className="icon-green" />
                <strong>99.4%</strong>
                <span>Customer satisfaction rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

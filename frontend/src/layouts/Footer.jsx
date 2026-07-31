import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiTruck, FiHeart } from 'react-icons/fi';
import { TbLeaf } from 'react-icons/tb';

export const Footer = () => {
  return (
    <footer className="footer-container" id="about-us">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <Link to="/" className="brand-logo mb-4">
              <div className="logo-icon-bg">
                <TbLeaf className="logo-icon" />
              </div>
              <span className="brand-name">
                Agri<span className="brand-highlight">Harvest</span>
              </span>
            </Link>
            <p className="footer-desc">
              The direct farm-to-table produce marketplace connecting local organic growers with conscious consumers. 100% farm-traceable, zero pesticides.
            </p>
            <div className="security-badges-row">
              <div className="sec-badge">
                <FiShield /> <span>SSL Encrypted</span>
              </div>
              <div className="sec-badge">
                <FiTruck /> <span>Same-Day Fresh</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Fresh Marketplace</h4>
            <ul className="footer-links">
              <li><a href="#popular-harvest">Organic Vegetables</a></li>
              <li><a href="#popular-harvest">Sun-Ripened Fruits</a></li>
              <li><a href="#popular-harvest">Pasture Eggs & Dairy</a></li>
              <li><a href="#popular-harvest">Raw Wildflower Honey</a></li>
              <li><a href="#popular-harvest">Fresh Microgreens</a></li>
            </ul>
          </div>

          {/* Partner Farmers */}
          <div className="footer-col">
            <h4 className="footer-heading">For Growers</h4>
            <ul className="footer-links">
              <li><a href="#meet-farmers">Become a Partner Farmer</a></li>
              <li><a href="#meet-farmers">Farmer Portal Login</a></li>
              <li><a href="#meet-farmers">Organic Certification Standards</a></li>
              <li><a href="#about-us">Fair Pricing Commitment</a></li>
            </ul>
          </div>

          {/* Security & Support */}
          <div className="footer-col">
            <h4 className="footer-heading">Trust & Security</h4>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy & Data Security</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#refunds">100% Fresh Guarantee Policy</a></li>
              <li><a href="#support">Help Center & Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AgriHarvest Produce Marketplace Inc. All rights reserved.</p>
          <p className="flex-center gap-1">
            Built with <FiHeart className="icon-red" /> for local independent farmers.
          </p>
        </div>
      </div>
    </footer>
  );
};

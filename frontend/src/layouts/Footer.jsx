import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiTruck, FiHeart } from 'react-icons/fi';
import { TbLeaf } from 'react-icons/tb';

const footerColumns = [
  {
    heading: 'Marketplace',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Products', to: '/products' },
      { label: 'Categories', to: '/categories' },
    ],
  },
  {
    heading: 'For Growers',
    links: [
      { label: 'Become a Farmer', to: '/register' },
      { label: 'Farmer Login', to: '/login' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
    ],
  },
];

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

          {footerColumns.map((col) => (
            <div className="footer-col" key={col.heading}>
              <h4 className="footer-heading">{col.heading}</h4>
              <ul className="footer-links">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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

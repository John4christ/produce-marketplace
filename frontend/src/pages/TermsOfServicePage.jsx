import React from 'react';
import { Link } from 'react-router-dom';

export const TermsOfServicePage = () => {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-page-header">
          <span className="section-tag">Legal</span>
          <h1 className="page-title">Terms of Service</h1>
          <p className="section-subtitle">Last updated: August 2026</p>
        </div>

        <div className="static-page-content">
          <div className="static-card">
            <h2>1. Agreement to Terms</h2>
            <p>
              By creating an account or using the AgriHarvest marketplace, you agree to be
              bound by these Terms of Service and our{' '}
              <Link to="/privacy" className="inline-link">Privacy Policy</Link>. If you do not
              agree with any part of these terms, please do not use the platform.
            </p>

            <h2>2. About the Marketplace</h2>
            <p>
              AgriHarvest is an online marketplace that connects buyers with independent
              growers. Farmers list fresh produce and related goods for sale; buyers can
              browse, order, and pay for those goods through the platform.
            </p>

            <h2>3. Accounts</h2>
            <ul className="static-list">
              <li>You must provide accurate, current information when creating an account.</li>
              <li>You are responsible for safeguarding your password and for all activity under your account.</li>
              <li>You must be at least 16 years old to create an account.</li>
              <li>Notify us immediately of any unauthorized use of your account.</li>
            </ul>

            <h2>4. Buyer Responsibilities</h2>
            <ul className="static-list">
              <li>Place orders in good faith and provide accurate delivery details.</li>
              <li>Complete payment for all confirmed orders in a timely manner.</li>
              <li>Review products and sellers before purchasing; sales are between the buyer and the grower through our platform.</li>
            </ul>

            <h2>5. Farmer Responsibilities</h2>
            <ul className="static-list">
              <li>List accurate product details, including pricing, units, and availability.</li>
              <li>Maintain the quality and safety standards described in your listings.</li>
              <li>Fulfill orders and communicate delivery information to buyers.</li>
              <li>Comply with all applicable laws and regulations for the goods you sell.</li>
            </ul>

            <h2>6. Orders, Payments &amp; Delivery</h2>
            <p>
              All prices are displayed in the applicable currency and may change at the
              seller's discretion. Payment is processed through secure third-party payment
              providers. Delivery times and methods depend on the grower and your location.
              Refunds are handled in accordance with the marketplace guarantee and applicable
              consumer law.
            </p>

            <h2>7. Prohibited Conduct</h2>
            <ul className="static-list">
              <li>Misrepresenting products, origins, or certifications.</li>
              <li>Posting fraudulent, misleading, or unlawful listings.</li>
              <li>Attempting to interfere with the security or proper functioning of the platform.</li>
              <li>Harassing, threatening, or defrauding other users.</li>
            </ul>

            <h2>8. Intellectual Property</h2>
            <p>
              The AgriHarvest name, logo, and all platform content are the property of
              AgriHarvest Produce Marketplace Inc. or its licensors. You may not reproduce or
              redistribute them without our prior written consent.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, AgriHarvest provides the platform "as
              is" and is not liable for indirect, incidental, or consequential damages arising
              from your use of the marketplace or any transaction between users.
            </p>

            <h2>10. Termination</h2>
            <p>
              We may suspend or terminate your account if you violate these terms. You may
              close your account at any time by contacting our support team.
            </p>

            <h2>11. Changes to These Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Continued use of the
              platform after changes take effect constitutes acceptance of the updated terms.
            </p>

            <h2>12. Contact</h2>
            <p>
              Questions about these Terms of Service? Reach us via our{' '}
              <Link to="/contact" className="inline-link">Contact page</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

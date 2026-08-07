import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage = () => {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-page-header">
          <span className="section-tag">Legal</span>
          <h1 className="page-title">Privacy Policy</h1>
          <p className="section-subtitle">Last updated: August 2026</p>
        </div>

        <div className="static-page-content">
          <div className="static-card">
            <h2>1. Introduction</h2>
            <p>
              AgriHarvest Produce Marketplace Inc. ("AgriHarvest", "we", "us" or "our")
              respects your privacy and is committed to protecting the personal information
              you share with us. This Privacy Policy explains what information we collect,
              how we use it, and the choices you have.
            </p>

            <h2>2. Information We Collect</h2>
            <p>We collect information you provide directly and information we gather when you use our marketplace:</p>
            <ul className="static-list">
              <li>Account details such as your name, email address, phone number, and profile picture.</li>
              <li>Order, payment, delivery, and transaction history.</li>
              <li>Product listings, messages, reviews, and support inquiries.</li>
              <li>Technical data such as device and browser information, and usage analytics.</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <ul className="static-list">
              <li>To create and manage your account and process your orders.</li>
              <li>To connect buyers with farmers and process marketplace transactions.</li>
              <li>To provide customer support and respond to your inquiries.</li>
              <li>To improve our services, send service updates, and — only with your consent — marketing communications.</li>
              <li>To detect, prevent, and address fraud, security, or technical issues.</li>
            </ul>

            <h2>4. How We Share Information</h2>
            <p>
              We do not sell your personal information. We only share it with trusted parties
              as needed to operate the marketplace, including payment processors, delivery
              partners, and service providers, all of whom are bound by confidentiality
              obligations. We may also disclose information where required by law or to
              protect the rights, property, or safety of our users and the public.
            </p>

            <h2>5. Data Security</h2>
            <p>
              We use industry-standard safeguards, including SSL/TLS encryption and access
              controls, to protect your information in transit and at rest. While no method
              of transmission is 100% secure, we work hard to protect your data.
            </p>

            <h2>6. Your Choices &amp; Rights</h2>
            <p>Depending on your location, you may have the right to access, correct, or delete your personal information, and to object to or restrict certain processing. You can update most account details directly from your dashboard or by contacting us.</p>

            <h2>7. Cookies</h2>
            <p>
              We use cookies and similar technologies to keep you signed in, remember your
              preferences, and understand how our platform is used. You can control cookies
              through your browser settings.
            </p>

            <h2>8. Children's Privacy</h2>
            <p>
              Our marketplace is not directed to children under the age of 16, and we do not
              knowingly collect personal information from children.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of
              material changes by posting the updated policy on this page and updating the
              "Last updated" date above.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or your data, please reach
              out to us via our <Link to="/contact" className="inline-link">Contact page</Link> or at
              support@agriharvest.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

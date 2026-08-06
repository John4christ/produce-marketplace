import React, { useState } from 'react';
import { FiMail, FiSend, FiCheck } from 'react-icons/fi';
import { Button } from '../common/Button';
import { toast } from 'react-toastify';
import { isValidEmail } from '../../utils/validators';
import { sanitizeInput } from '../../utils/sanitize';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const sanitizedEmail = sanitizeInput(email);

    if (!sanitizedEmail) {
      setError('Email address is required.');
      return;
    }

    if (!isValidEmail(sanitizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulate API request to subscribe
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      toast.success('🎉 Welcome to AgriHarvest Weekly Farm Dispatch!', { autoClose: 3000 });
      setEmail('');
    }, 1200);
  };

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-card glass-panel reveal-on-scroll">
          <div className="newsletter-content">
            <div className="newsletter-badge">
              <FiMail /> <span>Weekly Farm Gazette</span>
            </div>
            <h2 className="newsletter-title">Get ₦10 Off Your First Harvest Basket</h2>
            <p className="newsletter-desc">
              Subscribe for seasonal crop alerts, organic recipe guides, and exclusive weekend farm box discounts. Zero spam ever.
            </p>

            {isSubscribed ? (
              <div className="subscribed-success">
                <FiCheck className="success-icon" />
                <span>You are subscribed! Check your inbox for your ₦10 discount voucher code.</span>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubmit}>
                <div className="newsletter-input-group">
                  <FiMail className="form-input-icon" />
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    aria-label="Email address for newsletter"
                    disabled={isLoading}
                    className={`newsletter-input ${error ? 'input-invalid' : ''}`}
                  />
                  <Button
                    type="submit"
                    variant="amber"
                    isLoading={isLoading}
                    icon={FiSend}
                  >
                    Subscribe
                  </Button>
                </div>
                {error && <p className="newsletter-error">{error}</p>}
              </form>
            )}
            <p className="newsletter-privacy">We respect your privacy. Unsubscribe at any time with 1 click.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { isValidEmail } from '../utils/validators';
import { sanitizeInput } from '../utils/sanitize';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!sanitizeInput(formData.name)) {
      newErrors.name = 'Your name is required.';
    }

    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!sanitizeInput(formData.subject)) {
      newErrors.subject = 'A subject is required.';
    }

    if (!sanitizeInput(formData.message)) {
      newErrors.message = 'Please write a short message.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the highlighted fields.');
      return;
    }

    setIsSubmitted(true);
    toast.success('Message sent! Our team will respond within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="static-page">
      <div className="container">
        <div className="static-page-header">
          <span className="section-tag">Get In Touch</span>
          <h1 className="page-title">Contact Us</h1>
          <p className="section-subtitle">
            Questions about an order, partnership with your farm, or anything else — we are here to help.
          </p>
        </div>

        <div className="contact-layout">
          <div className="static-card contact-info-card">
            <h2>Contact Information</h2>
            <p>Our support team responds to every message, usually within one business day.</p>

            <div className="contact-info-row">
              <div className="contact-info-icon"><FiMail /></div>
              <div>
                <h3>Email</h3>
                <p>support@agriharvest.com</p>
              </div>
            </div>

            <div className="contact-info-row">
              <div className="contact-info-icon"><FiPhone /></div>
              <div>
                <h3>Phone</h3>
                <p>+2347055180695</p>
              </div>
            </div>

            <div className="contact-info-row">
              <div className="contact-info-icon"><FiMapPin /></div>
              <div>
                <h3>Head Office</h3>
                <p>Ilorin,kwara state.</p>
              </div>
            </div>

            <div className="contact-info-row">
              <div className="contact-info-icon"><FiClock /></div>
              <div>
                <h3>Support Hours</h3>
                <p>Monday – Friday, 8:00 AM – 6:00 PM</p>
              </div>
            </div>
          </div>

          <div className="static-card contact-form-card">
            {isSubmitted ? (
              <div className="contact-success">
                <FiCheckCircle className="icon-green contact-success-icon" />
                <h2>Thank you!</h2>
                <p>Your message has been received. Our team will get back to you within 24 hours.</p>
                <button
                  type="button"
                  className="btn btn-outline btn-md"
                  onClick={() => setIsSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2>Send Us a Message</h2>
                <p>Fill in the form below and we will respond as soon as we can.</p>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="input-group">
                    <label className="input-label" htmlFor="contact-name">Full Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`input-field ${errors.name ? 'has-error' : ''}`}
                    />
                    {errors.name && <span className="input-error-msg">{errors.name}</span>}
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="contact-email">Email Address</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className={`input-field ${errors.email ? 'has-error' : ''}`}
                    />
                    {errors.email && <span className="input-error-msg">{errors.email}</span>}
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="contact-subject">Subject</label>
                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className={`input-field ${errors.subject ? 'has-error' : ''}`}
                    />
                    {errors.subject && <span className="input-error-msg">{errors.subject}</span>}
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="contact-message">Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us a little more about your question..."
                      className={`input-field contact-textarea ${errors.message ? 'has-error' : ''}`}
                      rows={5}
                    />
                    {errors.message && <span className="input-error-msg">{errors.message}</span>}
                  </div>

                  <button type="submit" className="btn btn-primary btn-md btn-full contact-submit">
                    <FiSend className="btn-icon" /> Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

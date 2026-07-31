import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiArrowRight, FiUserCheck } from 'react-icons/fi';
import { TbTractor, TbBuildingStore } from 'react-icons/tb';

export const JoinCommunityCTA = () => {
  return (
    <section className="join-cta-section">
      <div className="container">
        <div className="section-header text-center reveal-on-scroll">
          <span className="section-tag">Join Our Ecosystem</span>
          <h2 className="section-title">Get Started with AgriHarvest Today</h2>
          <p className="section-subtitle">
            Whether you're shopping for clean family nutrition, selling your regional farm crops, or sourcing wholesale produce.
          </p>
        </div>

        <div className="join-cta-grid reveal-on-scroll">
          {/* Card 1: Buyer */}
          <div className="cta-card glass-panel">
            <div className="cta-card-icon-bg buyer-bg">
              <FiShoppingBag />
            </div>
            <h3 className="cta-card-title">Join as a Buyer</h3>
            <p className="cta-card-desc">
              Shop 100% farm-traceable organic vegetables, fruits, eggs, and raw honey delivered same-day to your doorstep.
            </p>
            <Link to="/register" className="btn btn-primary btn-full" aria-label="Register as Buyer">
              <span>Register as Buyer</span>
              <FiArrowRight />
            </Link>
          </div>

          {/* Card 2: Farmer */}
          <div className="cta-card glass-panel highlight-border">
            <div className="cta-card-icon-bg farmer-bg">
              <TbTractor />
            </div>
            <h3 className="cta-card-title">Join as a Farmer</h3>
            <p className="cta-card-desc">
              Sell your field harvests directly to conscious households. Keep 85% of every dollar with transparent farm pricing.
            </p>
            <Link to="/register" className="btn btn-amber btn-full" aria-label="Register as Farmer">
              <span>Register as Farmer</span>
              <FiArrowRight />
            </Link>
          </div>

          {/* Card 3: Vendor */}
          <div className="cta-card glass-panel">
            <div className="cta-card-icon-bg vendor-bg">
              <TbBuildingStore />
            </div>
            <h3 className="cta-card-title">Join as a Wholesale Vendor</h3>
            <p className="cta-card-desc">
              Supply restaurants, commercial kitchens, and local grocers with bulk certified organic agricultural inventory.
            </p>
            <Link to="/register" className="btn btn-outline btn-full" aria-label="Register as Vendor">
              <span>Partner as Vendor</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

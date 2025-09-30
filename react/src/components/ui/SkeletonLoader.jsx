import React from 'react';
import { motion } from 'framer-motion';
import './SkeletonLoader.css';

const SkeletonLoader = ({ 
  variant = 'card',
  count = 1,
  className = ''
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="skeleton skeleton-card">
            <div className="skeleton-image" />
            <div className="skeleton-content">
              <div className="skeleton-line skeleton-title" />
              <div className="skeleton-line skeleton-subtitle" />
            </div>
          </div>
        );
      
      case 'movie-card':
        return (
          <div className="skeleton skeleton-movie-card">
            <div className="skeleton-poster" />
            <div className="skeleton-movie-info">
              <div className="skeleton-line skeleton-movie-title" />
              <div className="skeleton-line skeleton-movie-meta" />
            </div>
          </div>
        );
      
      case 'list-item':
        return (
          <div className="skeleton skeleton-list-item">
            <div className="skeleton-avatar" />
            <div className="skeleton-list-content">
              <div className="skeleton-line skeleton-list-title" />
              <div className="skeleton-line skeleton-list-subtitle" />
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className="skeleton skeleton-text">
            <div className="skeleton-line" style={{ width: '100%' }} />
            <div className="skeleton-line" style={{ width: '80%' }} />
            <div className="skeleton-line" style={{ width: '60%' }} />
          </div>
        );
      
      case 'hero':
        return (
          <div className="skeleton skeleton-hero">
            <div className="skeleton-hero-bg" />
            <div className="skeleton-hero-content">
              <div className="skeleton-line skeleton-hero-title" />
              <div className="skeleton-line skeleton-hero-subtitle" />
              <div className="skeleton-button" />
            </div>
          </div>
        );
      
      default:
        return <div className="skeleton skeleton-default" />;
    }
  };

  return (
    <motion.div 
      className={`skeleton-container ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-wrapper">
          {renderSkeleton()}
        </div>
      ))}
    </motion.div>
  );
};

export default SkeletonLoader;
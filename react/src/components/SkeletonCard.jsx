import React from 'react';
import './SkeletonCard.css';

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-card__poster" />
      <div className="skeleton-card__content">
        <div className="skeleton skeleton-card__title" />
        <div className="skeleton skeleton-card__subtitle" />
      </div>
    </div>
  );
};

export default SkeletonCard;
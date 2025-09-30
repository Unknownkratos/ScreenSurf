import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Play, Plus, Heart } from 'lucide-react';
import './Card.css';

const Card = ({ 
  movie,
  variant = 'default',
  showOverlay = true,
  onClick,
  onPlay,
  onAddToList,
  onLike,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike && onLike(movie);
  };

  const cardVariants = {
    default: {
      scale: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: { duration: 0.3 }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return '#4ade80';
    if (rating >= 6) return '#facc15';
    return '#ef4444';
  };

  return (
    <motion.div
      className={`movie-card movie-card-${variant} ${className}`}
      variants={cardVariants}
      initial="default"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      layout
    >
      <div className="card-image-wrapper">
        {!imageLoaded && (
          <div className="card-skeleton">
            <div className="skeleton-shimmer"></div>
          </div>
        )}
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className={`card-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Rating Badge */}
        <div className="card-rating" style={{ color: getRatingColor(movie.vote_average) }}>
          <Star size={14} fill="currentColor" />
          <span>{movie.vote_average.toFixed(1)}</span>
        </div>

        {/* Like Button */}
        <motion.button
          className="card-like-btn"
          onClick={handleLike}
          whileTap={{ scale: 0.8 }}
        >
          <Heart 
            size={20} 
            fill={isLiked ? '#5682B1' : 'none'}
            color={isLiked ? '#5682B1' : '#FFE8DB'}
          />
        </motion.button>

        {/* Hover Overlay */}
        <AnimatePresence>
          {isHovered && showOverlay && (
            <motion.div
              className="card-overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="overlay-content">
                <div className="overlay-actions">
                  <motion.button
                    className="overlay-btn overlay-btn-play"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlay && onPlay(movie);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Play size={24} fill="white" />
                  </motion.button>
                  <motion.button
                    className="overlay-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToList && onAddToList(movie);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus size={24} />
                  </motion.button>
                </div>
                <div className="overlay-info">
                  <h3 className="overlay-title">{movie.title}</h3>
                  {movie.release_date && (
                    <p className="overlay-year">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                  )}
                  <p className="overlay-overview">
                    {movie.overview?.substring(0, 100)}...
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {variant === 'detailed' && (
        <div className="card-details">
          <h3 className="card-title">{movie.title}</h3>
          <div className="card-meta">
            <span className="card-year">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Card;
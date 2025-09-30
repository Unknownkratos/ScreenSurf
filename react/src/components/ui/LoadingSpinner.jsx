import React from 'react';
import { motion } from 'framer-motion';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  variant = 'default',
  fullScreen = false,
  text = ''
}) => {
  const spinnerContent = (
    <>
      <div className={`spinner-container spinner-${size} spinner-${variant}`}>
        {variant === 'default' && (
          <motion.div
            className="spinner-ring"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
        
        {variant === 'dots' && (
          <div className="spinner-dots">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="spinner-dot"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              />
            ))}
          </div>
        )}
        
        {variant === 'bars' && (
          <div className="spinner-bars">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                className="spinner-bar"
                animate={{
                  scaleY: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.1
                }}
              />
            ))}
          </div>
        )}
        
        {variant === 'pulse' && (
          <motion.div
            className="spinner-pulse"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity
            }}
          />
        )}
      </div>
      
      {text && <p className="spinner-text">{text}</p>}
    </>
  );

  if (fullScreen) {
    return (
      <motion.div 
        className="spinner-fullscreen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {spinnerContent}
      </motion.div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;
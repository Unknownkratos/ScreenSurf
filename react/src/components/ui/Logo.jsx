import React from 'react';
import logoFull from '../../assets/logo.svg';
import logoIcon from '../../assets/logo-icon.svg';

const Logo = ({ variant = 'full', className = '', ...props }) => {
  const logoSrc = variant === 'icon' ? logoIcon : logoFull;

  return (
    <img
      src={logoSrc}
      alt="ScreenSurf Logo"
      className={`logo ${className}`}
      {...props}
    />
  );
};

export default Logo;

import React, { useState } from 'react';
import {
  LOGO_ICON_URL,
  LOGO_FULL_URL,
  LOGO_FULL_ALT_URL,
} from '../../lib/constants/branding';

export interface LogoProps {
  variant?: 'full' | 'icon' | 'full-alt';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: 'eager' | 'lazy';
  className?: string;
  onDark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  loading = 'lazy',
  className = '',
  onDark = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // Select image source URL based on variant
  const getLogoSrc = () => {
    switch (variant) {
      case 'icon':
        return LOGO_ICON_URL;
      case 'full-alt':
        return LOGO_FULL_ALT_URL;
      case 'full':
      default:
        return LOGO_FULL_URL;
    }
  };

  // Dimension classes to prevent Cumulative Layout Shift (CLS)
  const getSizeClasses = () => {
    if (variant === 'icon') {
      switch (size) {
        case 'sm':
          return 'h-8 w-8';
        case 'xl':
          return 'h-16 w-16';
        case 'lg':
          return 'h-12 w-12';
        case 'md':
        default:
          return 'h-10 w-10';
      }
    } else {
      switch (size) {
        case 'sm':
          return 'h-9 w-auto max-h-9';
        case 'xl':
          return 'h-20 w-auto max-h-20';
        case 'lg':
          return 'h-16 w-auto max-h-16';
        case 'md':
        default:
          return 'h-12 w-auto max-h-12';
      }
    }
  };

  // Fallback text rendering if external image URL fails to load
  if (imageError) {
    const textColor = onDark ? 'text-white' : 'text-[#001639]';
    if (variant === 'icon') {
      return (
        <span
          className={`inline-flex items-center justify-center rounded-xl bg-[#001639] font-black text-white ${
            size === 'sm' ? 'w-8 h-8 text-sm' : size === 'lg' ? 'w-12 h-12 text-xl' : size === 'xl' ? 'w-16 h-16 text-2xl' : 'w-10 h-10 text-base'
          } ${className}`}
          title="Hash Resume"
        >
          #
        </span>
      );
    }

    return (
      <span
        className={`inline-flex items-center gap-2 font-brand font-extrabold tracking-tight ${textColor} ${
          size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : size === 'xl' ? 'text-4xl' : 'text-2xl'
        } ${className}`}
      >
        <span className="bg-[#001639] text-white rounded-lg px-2 py-0.5 text-sm font-black">#</span>
        <span>Hash Resume</span>
      </span>
    );
  }

  return (
    <img
      src={getLogoSrc()}
      alt="Hash Resume"
      loading={loading}
      onError={() => setImageError(true)}
      className={`object-contain transition-all duration-200 ${getSizeClasses()} ${className}`}
    />
  );
};

export default Logo;

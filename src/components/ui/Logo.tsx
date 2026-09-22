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
  loading = 'eager',
  className = '',
  onDark = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // High-performance Vector Logo fallback (0ms load time, 100% compatible with Firefox ETP & adblockers)
  const renderVectorLogo = () => {
    const textColor = onDark ? 'text-white' : 'text-[#001639]';
    const subtextColor = onDark ? 'text-slate-300' : 'text-slate-500';

    const getBadgeSize = () => {
      switch (size) {
        case 'sm': return 'w-8 h-8 text-base rounded-lg';
        case 'lg': return 'w-12 h-12 text-2xl rounded-xl';
        case 'xl': return 'w-16 h-16 text-3xl rounded-2xl';
        case 'md':
        default: return 'w-10 h-10 text-xl rounded-xl';
      }
    };

    const getFullTextSize = () => {
      switch (size) {
        case 'sm': return 'text-lg';
        case 'lg': return 'text-3xl';
        case 'xl': return 'text-4xl';
        case 'md':
        default: return 'text-2xl';
      }
    };

    if (variant === 'icon') {
      return (
        <div
          className={`relative inline-flex shrink-0 items-center justify-center bg-gradient-to-br from-[#001639] via-[#0B2545] to-[#000F27] text-white font-black shadow-md border border-white/10 select-none ${getBadgeSize()} ${className}`}
          title="Hash Resume"
        >
          <span className="text-[#FF4D2D] font-black tracking-tight drop-shadow-sm">#</span>
        </div>
      );
    }

    return (
      <div className={`inline-flex shrink-0 items-center gap-2.5 font-brand select-none ${className}`}>
        <div className={`relative inline-flex shrink-0 items-center justify-center bg-gradient-to-br from-[#001639] via-[#0B2545] to-[#000F27] text-white font-black shadow-md border border-white/10 ${getBadgeSize()}`}>
          <span className="text-[#FF4D2D] font-black tracking-tight drop-shadow-sm">#</span>
        </div>

        <div className="flex flex-col justify-center leading-none">
          <div className={`font-black tracking-tight flex items-center gap-1 ${textColor} ${getFullTextSize()}`}>
            <span>Hash</span>
            <span className="text-[#FF4D2D]">Resume</span>
          </div>
          <span className={`text-[10px] font-extrabold tracking-widest uppercase mt-0.5 ${subtextColor}`}>
            ATS BUILDER
          </span>
        </div>
      </div>
    );
  };

  if (imageError) {
    return renderVectorLogo();
  }

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

  return (
    <div className="relative inline-flex items-center shrink-0">
      <img
        src={getLogoSrc()}
        alt="Hash Resume"
        loading={loading}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setImageError(true)}
        className={`object-contain shrink-0 transition-all duration-200 ${getSizeClasses()} ${className}`}
      />
    </div>
  );
};

export default Logo;

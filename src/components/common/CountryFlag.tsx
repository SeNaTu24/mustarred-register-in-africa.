import React from 'react';
import { CountryCode } from '../../types';

interface CountryFlagProps {
  code: CountryCode | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  code,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-2.5',
    md: 'w-5 h-3.5',
    lg: 'w-7 h-5',
  };

  const renderFlagSvg = () => {
    switch (code) {
      case 'NG':
        // Nigeria: Green, White, Green
        return (
          <svg viewBox="0 0 24 16" className="w-full h-full block" fill="none">
            <rect width="8" height="16" fill="#008751" />
            <rect x="8" width="8" height="16" fill="#FFFFFF" />
            <rect x="16" width="8" height="16" fill="#008751" />
          </svg>
        );

      case 'KE':
        // Kenya: Black, Red (white borders), Green with Maasai shield & spears
        return (
          <svg viewBox="0 0 24 16" className="w-full h-full block" fill="none">
            <rect width="24" height="4.5" fill="#000000" />
            <rect y="4.5" width="24" height="0.8" fill="#FFFFFF" />
            <rect y="5.3" width="24" height="5.4" fill="#BB0000" />
            <rect y="10.7" width="24" height="0.8" fill="#FFFFFF" />
            <rect y="11.5" width="24" height="4.5" fill="#006600" />
            {/* Crossed spears */}
            <line x1="8" y1="2" x2="16" y2="14" stroke="#FFFFFF" strokeWidth="0.6" strokeLinecap="round" />
            <line x1="16" y1="2" x2="8" y2="14" stroke="#FFFFFF" strokeWidth="0.6" strokeLinecap="round" />
            {/* Maasai shield */}
            <ellipse cx="12" cy="8" rx="2.4" ry="5" fill="#BB0000" />
            <ellipse cx="12" cy="8" rx="0.7" ry="5" fill="#000000" />
            <circle cx="12" cy="8" r="0.6" fill="#FFFFFF" />
          </svg>
        );

      case 'GH':
        // Ghana: Red, Gold, Green with Black Star
        return (
          <svg viewBox="0 0 24 16" className="w-full h-full block" fill="none">
            <rect width="24" height="5.33" fill="#CE1126" />
            <rect y="5.33" width="24" height="5.34" fill="#FCD116" />
            <rect y="10.67" width="24" height="5.33" fill="#006B3F" />
            <polygon
              points="12,5.6 12.8,7.6 15,7.7 13.3,9 13.9,11.1 12,9.8 10.1,11.1 10.7,9 9,7.7 11.2,7.6"
              fill="#000000"
            />
          </svg>
        );

      case 'RW':
        // Rwanda: Sky Blue (with golden sun), Yellow, Green
        return (
          <svg viewBox="0 0 24 16" className="w-full h-full block" fill="none">
            <rect width="24" height="8" fill="#00A3E0" />
            <rect y="8" width="24" height="4" fill="#FAD201" />
            <rect y="12" width="24" height="4" fill="#20603D" />
            <circle cx="19" cy="4" r="1.6" fill="#E5AA00" />
            <circle cx="19" cy="4" r="2.4" stroke="#E5AA00" strokeWidth="0.5" strokeDasharray="0.8 0.4" fill="none" />
          </svg>
        );

      case 'CI':
        // Côte d'Ivoire: Orange, White, Green
        return (
          <svg viewBox="0 0 24 16" className="w-full h-full block" fill="none">
            <rect width="8" height="16" fill="#FF8200" />
            <rect x="8" width="8" height="16" fill="#FFFFFF" />
            <rect x="16" width="8" height="16" fill="#009A44" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 rounded-[2px] overflow-hidden border border-black/15 shadow-2xs ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    >
      {renderFlagSvg()}
    </span>
  );
};

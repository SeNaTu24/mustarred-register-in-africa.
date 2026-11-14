import React from 'react';
import logoSrc from '../../assets/mustarred-logo.png';

interface MustarredLogoProps {
  className?: string;
  widthClass?: string;
}

/**
 * MustarredLogo renders the official Mustarred branding asset
 * using an intrinsic SVG viewport mapped precisely to the active logo bounds
 * (X: 146–493, Y: 144–226, 348 × 83 px within the 666 × 374 px source canvas).
 *
 * This guarantees:
 * 1. Zero collapse: SVG replaced-element provides native intrinsic aspect ratio (348:83).
 * 2. Perfect proportions: No image squashing, stretching, or offset drifting across resolutions.
 * 3. Exact asset reuse: Reuses official `mustarred-logo.png` bundled via Vite asset pipeline.
 * 4. High contrast & crisp rendering across all screen densities, desktop and mobile.
 */
export const MustarredLogo: React.FC<MustarredLogoProps> = ({
  className = '',
  widthClass = 'w-[120px] sm:w-[150px]',
}) => {
  const assetUrl = logoSrc || '/assets/mustarred-logo.png';

  return (
    <div className={`shrink-0 flex items-center ${widthClass} ${className}`} aria-label="Mustarred">
      <svg
        viewBox="146 144 348 83"
        className="w-full h-auto block select-none pointer-events-none"
        style={{ aspectRatio: '348 / 83' }}
        role="img"
        aria-label="Mustarred"
      >
        <title>Mustarred</title>
        <image
          href={assetUrl}
          xlinkHref={assetUrl}
          x="0"
          y="0"
          width="666"
          height="374"
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
    </div>
  );
};

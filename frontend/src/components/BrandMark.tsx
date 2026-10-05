import React, { useId } from 'react';

interface BrandMarkProps {
  size?: number;
  className?: string;
}

/**
 * Product mark: a hexagonal "seal" with a verification tick.
 * Original artwork. It deliberately avoids government emblems so the prototype
 * is never mistaken for an official portal.
 */
export const BrandMark: React.FC<BrandMarkProps> = ({ size = 36, className = '' }) => {
  const uid = useId().replace(/:/g, '');
  const gradId = `bm-g-${uid}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      role="img"
      aria-label="BIS Standards Intelligence Engine"
    >
      <defs>
        <linearGradient id={gradId} x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4262f2" />
          <stop offset="1" stopColor="#6a4dff" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#${gradId})`} />
      <rect x="0.5" y="0.5" width="39" height="39" rx="10.5" stroke="white" strokeOpacity="0.22" />
      <path
        d="M20 7.5l10.2 5.9v11.8L20 31.1l-10.2-5.9V13.4z"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M15.2 20.4l3.5 3.5 6.3-7"
        stroke="#ffb36b"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

interface BrandLockupProps {
  size?: number;
  tone?: 'dark' | 'light';
  compact?: boolean;
}

export const BrandLockup: React.FC<BrandLockupProps> = ({ size = 36, tone = 'light', compact = false }) => {
  const isDark = tone === 'dark';
  return (
    <div className="flex items-center gap-3 min-w-0">
      <BrandMark size={size} className="shrink-0 drop-shadow-[0_6px_12px_rgba(66,98,242,0.28)]" />
      <div className="min-w-0 leading-tight">
        <div className={`font-heading font-bold tracking-tight truncate ${compact ? 'text-sm' : 'text-[15px]'} ${isDark ? 'text-white' : 'text-slate-900'}`}>
          BIS Standards
        </div>
        <div className={`text-[11px] font-medium truncate ${isDark ? 'text-indigo-200/70' : 'text-slate-500'}`}>
          Intelligence Engine
        </div>
      </div>
    </div>
  );
};

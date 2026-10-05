import React from 'react';

interface AshokaEmblemProps {
  className?: string;
  size?: number;
}

export const AshokaEmblem: React.FC<AshokaEmblemProps> = ({ className = 'h-14', size = 56 }) => {
  return (
    <div className={`flex flex-col items-center justify-center shrink-0 ${className}`} style={{ minWidth: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 115"
        fill="currentColor"
        className="text-[#0b3a75] drop-shadow-xs"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="State Emblem of India"
      >
        {/* Ashoka Lion Capital Profile Silhouette */}
        {/* Central Lion Head & Mane */}
        <path d="M50 8 C46 8 43 12 43 17 C41 16 38 18 38 21 C36 21 34 23 34 26 C33 30 35 34 38 36 C37 38 37 41 39 43 C42 46 47 48 50 48 C53 48 58 46 61 43 C63 41 63 38 62 36 C65 34 67 30 66 26 C66 23 64 21 62 21 C62 18 59 16 57 17 C57 12 54 8 50 8 Z" fill="#0b3a75" />
        
        {/* Left Lion Profile */}
        <path d="M36 22 C31 22 26 26 25 32 C24 37 26 42 29 45 C32 48 37 49 41 47 C40 45 39 43 39 41 C36 39 34 35 35 31 C35 27 38 24 41 23 C39 22 38 22 36 22 Z" fill="#0b3a75" />
        
        {/* Right Lion Profile */}
        <path d="M64 22 C69 22 74 26 75 32 C76 37 74 42 71 45 C68 48 63 49 59 47 C60 45 61 43 61 41 C64 39 66 35 65 31 C65 27 62 24 59 23 C61 22 62 22 64 22 Z" fill="#0b3a75" />
        
        {/* Mane Details & Chest Structure */}
        <path d="M44 48 L41 62 L50 64 L59 62 L56 48 C54 50 52 50 50 50 C48 50 46 50 44 48 Z" fill="#0b3a75" />
        <path d="M35 48 L32 60 L40 62 L43 49 C40 49 37 48 35 48 Z" fill="#0b3a75" opacity="0.9" />
        <path d="M65 48 L68 60 L60 62 L57 49 C60 49 63 48 65 48 Z" fill="#0b3a75" opacity="0.9" />
        
        {/* Abacus / Base Platform with Ashoka Chakra */}
        <rect x="22" y="64" width="56" height="8" rx="2" fill="#0b3a75" />
        
        {/* Ashoka Chakra Center on Abacus */}
        <circle cx="50" cy="68" r="3.5" fill="#ffffff" />
        <circle cx="50" cy="68" r="2.5" fill="#0b3a75" />
        <circle cx="50" cy="68" r="0.8" fill="#ffffff" />
        {/* Left Bull / Horse Silhouettes */}
        <circle cx="34" cy="68" r="1.5" fill="#ffffff" />
        {/* Right Bull Silhouette */}
        <circle cx="66" cy="68" r="1.5" fill="#ffffff" />

        {/* Lower Bell-shaped Lotus Base */}
        <path d="M26 73 C26 73 34 81 50 81 C66 81 74 73 74 73 L76 77 C76 77 66 85 50 85 C34 85 24 77 24 77 Z" fill="#0b3a75" />
        <rect x="28" y="85" width="44" height="3" rx="1" fill="#0b3a75" />

        {/* Satyameva Jayate (सत्यमेव जयते) in Devanagari Script */}
        <text
          x="50"
          y="102"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fontFamily="'Noto Sans Devanagari', 'Noto Sans', sans-serif"
          fill="#0b3a75"
          letterSpacing="0.05em"
        >
          सत्यमेव जयते
        </text>
      </svg>
    </div>
  );
};

import React from 'react';

export const BisLogo: React.FC<{ size?: number }> = ({ size = 52 }) => {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Bureau of Indian Standards Logo"
      >
        {/* Outer Circular Boundary */}
        <circle cx="50" cy="50" r="46" stroke="#0b3a75" strokeWidth="4" fill="#ffffff" />
        
        {/* Inner Golden Rim */}
        <circle cx="50" cy="50" r="41" stroke="#f37023" strokeWidth="2.5" fill="#fdfcf8" />
        
        {/* Central Traditional Standard Gear / Mandala Pattern */}
        <circle cx="50" cy="50" r="28" stroke="#0b3a75" strokeWidth="2" strokeDasharray="4 2" fill="#ffffff" />
        
        {/* Central Core Emblem */}
        <circle cx="50" cy="50" r="18" fill="#0b3a75" />
        
        {/* BIS Standard Triangle Mark */}
        <path d="M50 36 L62 57 L38 57 Z" fill="#f37023" />
        <path d="M50 42 L58 55 L42 55 Z" fill="#ffffff" />
        <circle cx="50" cy="50" r="2.5" fill="#0b3a75" />

        {/* Top Text: मानक: पथप्रदर्शक: */}
        <path id="curve-top" d="M 22 50 A 28 28 0 0 1 78 50" fill="none" />
        <text fontSize="7" fontWeight="bold" fill="#0b3a75" letterSpacing="0.05em">
          <textPath href="#curve-top" startOffset="50%" textAnchor="middle">
            मानक: पथप्रदर्शक:
          </textPath>
        </text>

        {/* Bottom Text: BUREAU OF INDIAN STANDARDS */}
        <path id="curve-bottom" d="M 78 50 A 28 28 0 0 1 22 50" fill="none" />
        <text fontSize="6" fontWeight="bold" fill="#0b3a75" letterSpacing="0.02em">
          <textPath href="#curve-bottom" startOffset="50%" textAnchor="middle">
            BUREAU OF INDIAN STANDARDS
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export const GovLogosStrip: React.FC = () => {
  return (
    <div className="hidden xl:flex items-center gap-4 shrink-0 pl-3 border-l border-gray-200">
      {/* Azadi Ka Amrit Mahotsav Badge */}
      <div className="flex flex-col items-center justify-center p-1.5 bg-[#fdfdfc] border border-gray-200 rounded-lg shadow-2xs">
        <div className="flex items-center gap-1 font-heading font-black text-xs leading-none">
          <span className="text-[#f37023]">75</span>
          <span className="text-[10px] font-sans text-[#0b3a75] font-bold">Azadi Ka</span>
        </div>
        <span className="text-[8px] font-bold text-[#138808] uppercase tracking-wider leading-none mt-0.5">
          Amrit Mahotsav
        </span>
      </div>

      {/* Digital India Badge */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#fdfdfc] border border-gray-200 rounded-lg shadow-2xs">
        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#0b3a75] to-[#f37023] flex items-center justify-center text-white text-[9px] font-bold">
          DI
        </div>
        <div className="text-left">
          <div className="text-[10px] font-extrabold text-[#0b3a75] leading-tight">Digital India</div>
          <div className="text-[8px] text-[#64748b] leading-tight">Power To Empower</div>
        </div>
      </div>

      {/* Swachh Bharat Glasses */}
      <div className="flex flex-col items-center justify-center p-1.5 bg-[#fdfdfc] border border-gray-200 rounded-lg shadow-2xs">
        <div className="flex items-center gap-0.5">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-[#138808] flex items-center justify-center text-[7px] font-bold text-[#138808]">स्व</div>
          <div className="w-1.5 h-0.5 bg-[#138808]"></div>
          <div className="w-3.5 h-3.5 rounded-full border-2 border-[#138808] flex items-center justify-center text-[7px] font-bold text-[#138808]">च्छ</div>
        </div>
        <span className="text-[7.5px] font-bold text-[#0b3a75] uppercase mt-0.5">भारत</span>
      </div>
    </div>
  );
};

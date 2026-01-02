import React from 'react';

const RoyalDivider = () => {
  return (
    <div className="flex items-center justify-center py-12 bg-transparent overflow-hidden">
      <div className="flex items-center gap-4 w-full max-w-lg opacity-40">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C5A059]"></div>
        
        {/* Mandala Icon (SVG) */}
        <div className="text-[#C5A059]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2L14.39,4.41L12,6.8L9.61,4.41L12,2M12,22L9.61,19.59L12,17.2L14.39,19.59L12,22M2,12L4.41,9.61L6.8,12L4.41,14.39L2,12M22,12L19.59,14.39L17.2,12L19.59,9.61L22,12M12,6.8L14.41,9.21L12,11.6L9.59,9.21L12,6.8M12,17.2L9.59,14.79L12,12.4L14.41,14.79L12,17.2M6.8,12L9.21,14.41L11.6,12L9.21,9.59L6.8,12M17.2,12L14.79,9.59L12.4,12L14.79,14.41L17.2,12Z" />
          </svg>
        </div>

        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C5A059]"></div>
      </div>
    </div>
  );
};

export default RoyalDivider;
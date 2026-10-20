import React, { useState } from 'react';
import logoImg from '../assets/luancer-logo.jpg';

interface LuancerLogoProps {
  variant?: 'header' | 'full' | 'icon' | 'badge';
  className?: string;
  showTagline?: boolean;
}

export function LuancerLogo({ variant = 'header', className = '' }: LuancerLogoProps) {
  const [imageError, setImageError] = useState(false);

  // Fallback if image fails to load for any reason
  const fallbackSrc = '/assets/Logo%20Luancer%20per%20Brain%20Trainer%20Game.jpg';

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="relative rounded-2xl overflow-hidden shadow-md bg-[#DFEDE5] border border-[#BFD5C7] p-2 hover:shadow-lg transition-all duration-300">
          <img
            src={imageError ? fallbackSrc : logoImg}
            alt="Luancer Brain Trainer - Quality You Can Trust"
            className="w-auto h-24 md:h-32 object-contain select-none"
            onError={() => setImageError(true)}
            loading="eager"
          />
        </div>
      </div>
    );
  }

  // Default header variant (in cima a sinistra: cosi come è, senza alterazioni)
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={imageError ? fallbackSrc : logoImg}
        alt="Luancer Brain Trainer"
        className="h-11 md:h-13 w-auto object-contain rounded-xl select-none transition-transform duration-200 hover:scale-[1.02] shadow-2xs border border-[#CBDDD2]/70"
        onError={() => setImageError(true)}
        loading="eager"
      />
    </div>
  );
}
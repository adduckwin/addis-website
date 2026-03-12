import React from 'react';

interface AddisLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  variant?: 'black' | 'white';
}

export const AddisLogo: React.FC<AddisLogoProps> = ({ 
  className = '', 
  size = 40, 
  showText = true,
  variant = 'black'
}) => {
  const fillColor = variant === 'black' ? '#000000' : '#ffffff';
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Geometric Symbol - 4 triangles forming cross shape */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Top triangle */}
        <path 
          d="M50 0L75 25L50 50L25 25L50 0Z" 
          fill={fillColor}
        />
        {/* Right triangle */}
        <path 
          d="M100 50L75 75L50 50L75 25L100 50Z" 
          fill={fillColor}
        />
        {/* Bottom triangle */}
        <path 
          d="M50 100L25 75L50 50L75 75L50 100Z" 
          fill={fillColor}
        />
        {/* Left triangle */}
        <path 
          d="M0 50L25 25L50 50L25 75L0 50Z" 
          fill={fillColor}
        />
      </svg>
      
      {/* Text part */}
      {showText && (
        <span 
          className={`font-bold tracking-tight text-[1.2em] ${variant === 'black' ? 'text-black' : 'text-white'}`}
        >
          ADDIS
        </span>
      )}
    </div>
  );
};

export default AddisLogo;

import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "h-8", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* Shield Background */}
        <path
          d="M50 5L15 20V45C15 65.3333 26.6667 83.6667 50 95C73.3333 83.6667 85 65.3333 85 45V20L50 5Z"
          fill="currentColor"
          className="text-primary"
        />
        
        {/* Inner Lens / Eye Circle */}
        <circle cx="50" cy="45" r="22" fill="white" fillOpacity="0.2" />
        <circle cx="50" cy="45" r="16" fill="white" />
        
        {/* Lens Pupil / Center */}
        <circle cx="50" cy="45" r="8" fill="currentColor" className="text-primary" />
        
        {/* Glint */}
        <circle cx="54" cy="41" r="3" fill="white" fillOpacity="0.8" />
        
        {/* Lens Rim Detail */}
        <path
          d="M34 45C34 53.8366 41.1634 61 50 61C58.8366 61 66 53.8366 66 45"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      
      {showText && (
        <span className="font-heading font-bold text-xl tracking-tight">
          FairLens <span className="text-primary">AI</span>
        </span>
      )}
    </div>
  );
}

'use client';

import Image from 'next/image';

interface LogoWithBeamProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function LogoWithBeam({ className = '', variant = 'light' }: LogoWithBeamProps) {
  const logoSrc = variant === 'dark' ? '/logo-header-dark.png' : '/logo-header.png';

  return (
    <div className={`relative ${className}`}>
      {/* The logo image */}
      <Image
        src={logoSrc}
        alt="IQ Auto Deals - Intelligent Quality Deals"
        width={500}
        height={80}
        className="h-full w-auto"
        priority
      />

      {/* SVG overlay for the beam animation */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1159 372"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Brake light glow filter */}
          <filter id="brakeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Spinning Q tire gradient */}
          <linearGradient id="tireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="25%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#1e40af" />
            <stop offset="75%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
        </defs>

        {/* Spinning Q effect - positioned over the Q in the logo */}
        <g transform="translate(175, 215)">
          {/* Outer spinning ring */}
          <circle
            cx="0"
            cy="0"
            r="72"
            fill="none"
            stroke="url(#tireGradient)"
            strokeWidth="12"
            opacity="0.6"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 0 0"
              to="360 0 0"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Inner spinning highlights */}
          <circle
            cx="0"
            cy="0"
            r="60"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="3"
            strokeDasharray="20 30"
            opacity="0.5"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 0 0"
              to="0 0 0"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

      </svg>
    </div>
  );
}

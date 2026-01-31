'use client';

import { ReactNode } from 'react';

interface AnimatedBorderProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedBorder({ children, className = '' }: AnimatedBorderProps) {
  return (
    <div className={`relative inline-flex ${className}`}>
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div
          className="absolute inset-[-2px] animate-spin-slow"
          style={{
            background: 'conic-gradient(from 0deg, transparent, #22c55e, #15803d, #22c55e, transparent)',
          }}
        />
      </div>

      {/* Inner content with solid background */}
      <div className="relative bg-black rounded-lg px-6 py-3 z-10">
        {children}
      </div>
    </div>
  );
}

// Alternative: Beam style that travels around the border
export function BorderBeam({ children, className = '' }: AnimatedBorderProps) {
  return (
    <div className={`relative inline-flex group ${className}`}>
      {/* Container for the beam effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        {/* The rotating beam */}
        <div
          className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-border-beam"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, transparent 340deg, #22c55e 350deg, #4ade80 355deg, #22c55e 360deg)',
          }}
        />
      </div>

      {/* Border mask */}
      <div className="absolute inset-[2px] rounded-[10px] bg-black z-[1]" />

      {/* Content */}
      <div className="relative z-10 px-6 py-3">
        {children}
      </div>
    </div>
  );
}

// Glowing beam style
export function GlowingBorder({ children, className = '' }: AnimatedBorderProps) {
  return (
    <div className={`relative inline-flex ${className}`}>
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-xl blur-md opacity-75 animate-pulse-slow"
        style={{
          background: 'linear-gradient(90deg, #22c55e, #15803d, #22c55e)',
        }}
      />

      {/* Border container */}
      <div className="relative rounded-xl p-[2px] overflow-hidden">
        <div
          className="absolute inset-0 animate-spin-slow"
          style={{
            background: 'conic-gradient(from 0deg, #22c55e, #15803d, #0f5132, #15803d, #22c55e)',
          }}
        />

        {/* Inner content */}
        <div className="relative bg-black rounded-[10px] px-6 py-3 z-10">
          {children}
        </div>
      </div>
    </div>
  );
}

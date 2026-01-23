import React, { useState } from 'react';

export default function LiquidGlassButton({ text }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });   

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        className="relative overflow-hidden px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ease-out group"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
        }}
        onMouseMove={handleMouseMove}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle 120px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.25), transparent)`,
          }}
        />
        
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
          }}
        />

        <span className="relative z-10 text-lg tracking-wide">
          {text}
        </span>

        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-white to-transparent opacity-50"
        />
      </button>
    </div>
  );
}
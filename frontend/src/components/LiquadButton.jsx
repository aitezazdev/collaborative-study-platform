import React, { useState } from "react";

export default function LiquidGlassButton({ text , onClick }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
      <button
        onClick={onClick}
        className="relative block mx-auto overflow-hidden cursor-pointer px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 ease-out group"
        style={{
          background: "rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(0, 0, 0, 0.15)",
          boxShadow: isHovered
            ? "0 8px 32px 0 rgba(0, 0, 0, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.9)"
            : "0 4px 16px 0 rgba(0, 0, 0, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)",
          transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle 120px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 0, 0, 0.15), transparent)`,
          }}
        />

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)",
          }}
        />

        <span className="relative z-10 tracking-wide text-gray-800">
          {text}
        </span>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-white to-transparent opacity-50" />
      </button>
  );
}

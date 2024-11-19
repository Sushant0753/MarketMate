import React, { useState, useEffect } from 'react';

const AnimatedGridBG = ({ children, className = '' }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`relative w-full min-h-screen bg-[#090909] overflow-hidden ${className}`}>
      {/* Animated gradient following mouse */}
      <div
        className="absolute pointer-events-none transition-transform duration-1000 ease-out"
        style={{
          background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(29, 78, 216, 0.07), transparent 40%)',
          width: '100%',
          height: '100%',
          transform: 'translate(0, 0)',
          '--mouse-x': `${mousePosition.x}px`,
          '--mouse-y': `${mousePosition.y}px`,
        }}
      />

      {/* Grid Background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(75, 75, 75, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(75, 75, 75, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Grid cells that respond to mouse */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-0">
        {Array.from({ length: 72 }).map((_, index) => {
          const cell = {
            x: (index % 12) * 80,
            y: Math.floor(index / 12) * 80,
          };
          
          const distance = Math.sqrt(
            Math.pow(cell.x - mousePosition.x, 2) + 
            Math.pow(cell.y - mousePosition.y, 2)
          );
          
          const scale = Math.max(1, 1.1 - distance / 400);
          
          return (
            <div
              key={index}
              className="transition-transform duration-300 ease-out"
              style={{
                transform: `scale(${scale})`,
              }}
            />
          );
        })}
      </div>

      {/* Content passed as children */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedGridBG;
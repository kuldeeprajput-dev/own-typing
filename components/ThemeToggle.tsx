'use client';

import React, { useState, useRef } from 'react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  const [angle, setAngle] = useState(15);
  const velocityRef = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const animationRef = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    const animate = () => {
      if (!isDragging.current) {
        velocityRef.current += -angle * 0.002;
        velocityRef.current *= 0.99;
        
        const newAngle = angle + velocityRef.current;
        
        if (Math.abs(newAngle) < 0.1 && Math.abs(velocityRef.current) < 0.1) {
          setAngle(0);
        } else {
          setAngle(newAngle);
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [angle]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    isDragging.current = true;
    lastX.current = e.clientX;
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const deltaX = e.clientX - lastX.current;
        setAngle(prev => prev + deltaX * 0.25);
        velocityRef.current = deltaX * 0.1;
        lastX.current = e.clientX;
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="fixed z-50" style={{ top: '20px', right: '100px' }}>
      <div
        onMouseDown={handleMouseDown}
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: 'top center',
          cursor: 'grab',
        }}
      >
        <div className="flex flex-col items-center">
          <div className="w-0.5 bg-gradient-to-b from-amber-600 to-amber-800" style={{ height: '200px', boxShadow: '0 0 4px rgba(217, 119, 6, 0.5)' }} />
          <div className="w-3 h-3 bg-amber-700 rounded-full -mt-1 shadow-sm" />
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={`
              w-14 h-14 rounded-full flex items-center justify-center
              transition-all duration-300 shadow-lg
              hover:scale-110 active:scale-95
              ${isDark 
                ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-500/30' 
                : 'bg-indigo-400 hover:bg-indigo-300 shadow-indigo-400/30'
              }
            `}
          >
            {isDark ? (
              <svg className="w-8 h-8 text-amber-900" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.0 0010.586 10.586z" />
              </svg>
            )}
          </button>
          
          <div className="w-3 h-3 bg-amber-800 -mt-1" />
        </div>
      </div>
    </div>
  );
}
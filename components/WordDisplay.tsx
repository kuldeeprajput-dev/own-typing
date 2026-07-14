'use client';

import React, { useRef, useState, useEffect } from 'react';
import { CharState } from '@/types';
import { useKeyboardSettings, KeyboardTheme } from '@/context/KeyboardSettingsContext';

interface WordRowProps {
  charStates: CharState[];
  isDark?: boolean;
  activeCharRef?: React.RefObject<HTMLSpanElement | null>;
  isAtEnd: boolean;
}

const themeCursorStyleMap: Record<KeyboardTheme, { 
  dark: { cursor: string; shadow: string }; 
  light: { cursor: string; shadow: string } 
}> = {
  Classic: { 
    dark: { cursor: 'bg-[#EAB308]', shadow: 'shadow-[1.5px_0_3px_rgba(234,179,8,0.25)]' }, 
    light: { cursor: 'bg-[#EAB308]', shadow: 'shadow-[1.5px_0_3px_rgba(234,179,8,0.25)]' } 
  },
  Mint: { 
    dark: { cursor: 'bg-emerald-400', shadow: 'shadow-[1.5px_0_3px_rgba(52,211,153,0.25)]' }, 
    light: { cursor: 'bg-emerald-600', shadow: 'shadow-[1.5px_0_3px_rgba(5,150,105,0.25)]' } 
  },
  Royal: { 
    dark: { cursor: 'bg-blue-400', shadow: 'shadow-[1.5px_0_3px_rgba(96,165,250,0.25)]' }, 
    light: { cursor: 'bg-blue-600', shadow: 'shadow-[1.5px_0_3px_rgba(37,99,235,0.25)]' } 
  },
  Dolch: { 
    dark: { cursor: 'bg-cyan-400', shadow: 'shadow-[1.5px_0_3px_rgba(34,220,238,0.25)]' }, 
    light: { cursor: 'bg-cyan-600', shadow: 'shadow-[1.5px_0_3px_rgba(8,145,178,0.25)]' } 
  },
  Sand: { 
    dark: { cursor: 'bg-amber-600', shadow: 'shadow-[1.5px_0_3px_rgba(217,119,6,0.25)]' }, 
    light: { cursor: 'bg-amber-700', shadow: 'shadow-[1.5px_0_3px_rgba(180,83,9,0.25)]' } 
  },
  Scarlet: { 
    dark: { cursor: 'bg-red-500', shadow: 'shadow-[1.5px_0_3px_rgba(239,68,68,0.25)]' }, 
    light: { cursor: 'bg-red-600', shadow: 'shadow-[1.5px_0_3px_rgba(220,38,38,0.25)]' } 
  },
};

const WordRow = React.memo(function WordRow({ charStates, isDark = true, activeCharRef, isAtEnd }: WordRowProps) {
  return (
    <span className="inline-block select-none">
      {charStates.map((charState, index) => {
        const isTarget = isAtEnd 
          ? index === charStates.length - 1 
          : charState.status === 'current';

        return (
          <span
            key={index}
            ref={isTarget ? (activeCharRef as any) : undefined}
            className={`
              relative inline transition-colors duration-75 ease-out
              ${charState.status === 'idle' ? (isDark ? 'text-zinc-500' : 'text-gray-400') : ''}
              ${charState.status === 'correct' ? (isDark ? 'text-white' : 'text-zinc-900') : ''}
              ${charState.status === 'incorrect' ? 'text-red-500 bg-red-100 dark:bg-red-900/20' : ''}
              ${charState.status === 'current' ? (isDark ? 'text-zinc-500' : 'text-gray-400') : ''}
            `}
          >
            {charState.char}
          </span>
        );
      })}
    </span>
  );
});

WordRow.displayName = 'WordRow';

interface WordDisplayProps {
  charStates: CharState[][];
  words: string[];
  currentWordIndex: number;
  isDark?: boolean;
  activeWordRef: React.RefObject<HTMLSpanElement | null>;
}

const WordDisplay = React.memo(function WordDisplay({ 
  charStates, 
  words, 
  currentWordIndex, 
  isDark = true,
  activeWordRef
}: WordDisplayProps) {
  const { settings } = useKeyboardSettings();
  const themeStyles = themeCursorStyleMap[settings.theme] || themeCursorStyleMap.Classic;
  const cursorStyle = isDark ? themeStyles.dark : themeStyles.light;

  const activeCharRef = useRef<HTMLSpanElement>(null);
  const [cursorCoords, setCursorCoords] = useState<{ left: number; top: number; height: number } | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const activeWordChars = charStates[currentWordIndex] || [];
  const currentCharIndex = activeWordChars.findIndex(c => c.status === 'current');
  const isAtEnd = currentCharIndex === -1 && activeWordChars.length > 0;

  useEffect(() => {
    setIsTyping(true);
    const blinkTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 500);

    return () => clearTimeout(blinkTimeout);
  }, [charStates, currentWordIndex]);

  useEffect(() => {
    const updatePosition = () => {
      if (activeCharRef.current) {
        const charEl = activeCharRef.current;
        setCursorCoords({
          left: isAtEnd ? (charEl.offsetLeft + charEl.offsetWidth) : charEl.offsetLeft,
          top: charEl.offsetTop,
          height: charEl.offsetHeight,
        });
      }
    };

    updatePosition();
    
    // Set a tiny timeout to ensure webfont and layout are fully calculated
    const timer = setTimeout(updatePosition, 100);

    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      clearTimeout(timer);
    };
  }, [charStates, currentWordIndex, isAtEnd]);
  
  return (
    <div 
      className="relative text-justify leading-relaxed text-lg sm:text-xl md:text-2xl font-['JetBrains_Mono',_monospace] w-full"
      style={{ textAlignLast: 'left', textJustify: 'inter-word' }}
    >
      {/* GPU-Accelerated Sliding Cursor */}
      {cursorCoords && (
        <span 
          className={`
            absolute left-0 top-0 w-[2.5px] rounded-full z-10
            transition-all duration-[95ms] cubic-bezier(0.1, 0.9, 0.2, 1)
            ${cursorStyle.cursor}
            ${cursorStyle.shadow}
            ${isTyping ? '' : 'animate-blink'}
          `}
          style={{
            transform: `translate(${cursorCoords.left - 1}px, ${cursorCoords.top - 1}px)`,
            height: `${cursorCoords.height + 2}px`,
          }}
        />
      )}

      {words.map((word, index) => {
        const isActive = index === currentWordIndex;
        return (
          <span 
            key={index} 
            ref={isActive ? activeWordRef : undefined}
            className="inline-block mx-[0.35em] my-1"
          >
            <WordRow
              charStates={charStates[index] || []}
              isDark={isDark}
              activeCharRef={isActive ? activeCharRef : undefined}
              isAtEnd={isActive ? isAtEnd : false}
            />
          </span>
        );
      })}
    </div>
  );
});

WordDisplay.displayName = 'WordDisplay';

export default WordDisplay;
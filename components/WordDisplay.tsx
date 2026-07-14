'use client';

import React from 'react';
import { CharState } from '@/types';
import { useKeyboardSettings, KeyboardTheme } from '@/context/KeyboardSettingsContext';

interface CaretStyle {
  cursor: string;
  shadow: string;
}

interface WordRowProps {
  charStates: CharState[];
  isDark: boolean;
  showCaret: boolean;
  caretStyle: CaretStyle;
}

const themeCaretStyleMap: Record<KeyboardTheme, {
  dark: CaretStyle;
  light: CaretStyle;
}> = {
  Classic: {
    dark: { cursor: 'bg-[#EAB308]', shadow: 'shadow-[1.5px_0_3px_rgba(234,179,8,0.25)]' },
    light: { cursor: 'bg-[#EAB308]', shadow: 'shadow-[1.5px_0_3px_rgba(234,179,8,0.25)]' },
  },
  Mint: {
    dark: { cursor: 'bg-emerald-400', shadow: 'shadow-[1.5px_0_3px_rgba(52,211,153,0.25)]' },
    light: { cursor: 'bg-emerald-600', shadow: 'shadow-[1.5px_0_3px_rgba(5,150,105,0.25)]' },
  },
  Royal: {
    dark: { cursor: 'bg-blue-400', shadow: 'shadow-[1.5px_0_3px_rgba(96,165,250,0.25)]' },
    light: { cursor: 'bg-blue-600', shadow: 'shadow-[1.5px_0_3px_rgba(37,99,235,0.25)]' },
  },
  Dolch: {
    dark: { cursor: 'bg-cyan-400', shadow: 'shadow-[1.5px_0_3px_rgba(34,220,238,0.25)]' },
    light: { cursor: 'bg-cyan-600', shadow: 'shadow-[1.5px_0_3px_rgba(8,145,178,0.25)]' },
  },
  Sand: {
    dark: { cursor: 'bg-amber-600', shadow: 'shadow-[1.5px_0_3px_rgba(217,119,6,0.25)]' },
    light: { cursor: 'bg-amber-700', shadow: 'shadow-[1.5px_0_3px_rgba(180,83,9,0.25)]' },
  },
  Scarlet: {
    dark: { cursor: 'bg-red-500', shadow: 'shadow-[1.5px_0_3px_rgba(239,68,68,0.25)]' },
    light: { cursor: 'bg-red-600', shadow: 'shadow-[1.5px_0_3px_rgba(220,38,38,0.25)]' },
  },
};

const Caret = React.memo(function Caret({ style }: { style: CaretStyle }) {
  return (
    <span
      aria-hidden="true"
      className={`
        pointer-events-none absolute -left-px top-[-0.08em] z-10
        h-[1.35em] w-[2.5px] rounded-full motion-safe:animate-[blink_1s_step-end_infinite]
        ${style.cursor} ${style.shadow}
      `}
    />
  );
});

Caret.displayName = 'Caret';

const WordRow = React.memo(function WordRow({
  charStates,
  isDark,
  showCaret,
  caretStyle,
}: WordRowProps) {
  const hasCurrentChar = charStates.some((charState) => charState.status === 'current');

  return (
    <span className="inline-block select-none">
      {charStates.map((charState, index) => (
        <span
          key={index}
          className={`
            relative inline transition-colors duration-75 ease-out motion-reduce:transition-none
            ${charState.status === 'idle' ? (isDark ? 'text-zinc-500' : 'text-gray-400') : ''}
            ${charState.status === 'correct' ? (isDark ? 'text-white' : 'text-zinc-900') : ''}
            ${charState.status === 'incorrect' ? 'text-red-500 bg-red-100 dark:bg-red-900/20' : ''}
            ${charState.status === 'current' ? (isDark ? 'text-zinc-500' : 'text-gray-400') : ''}
          `}
        >
          {showCaret && charState.status === 'current' && <Caret style={caretStyle} />}
          {charState.char}
        </span>
      ))}

      {showCaret && !hasCurrentChar && (
        <span aria-hidden="true" className="relative inline-block h-[1em] w-0 align-[-0.15em]">
          <Caret style={caretStyle} />
        </span>
      )}
    </span>
  );
});

WordRow.displayName = 'WordRow';

interface WordItemProps extends Omit<WordRowProps, 'showCaret'> {
  isActive: boolean;
  activeWordRef: React.RefObject<HTMLSpanElement | null>;
}

const WordItem = React.memo(function WordItem({
  charStates,
  isDark,
  isActive,
  caretStyle,
  activeWordRef,
}: WordItemProps) {
  return (
    <span
      ref={isActive ? activeWordRef : undefined}
      className="mx-[0.35em] my-1 inline-block"
    >
      <WordRow
        charStates={charStates}
        isDark={isDark}
        showCaret={isActive}
        caretStyle={caretStyle}
      />
    </span>
  );
});

WordItem.displayName = 'WordItem';

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
  activeWordRef,
}: WordDisplayProps) {
  const { settings } = useKeyboardSettings();
  const themeStyles = themeCaretStyleMap[settings.theme] || themeCaretStyleMap.Classic;
  const caretStyle = isDark ? themeStyles.dark : themeStyles.light;

  return (
    <div
      className="relative w-full text-justify font-['JetBrains_Mono',_monospace] text-lg leading-relaxed sm:text-xl md:text-2xl"
      style={{ textAlignLast: 'left', textJustify: 'inter-word' }}
    >
      {words.map((_, index) => {
        const isActive = index === currentWordIndex;

        return (
          <WordItem
            key={index}
            charStates={charStates[index] || []}
            isDark={isDark}
            isActive={isActive}
            caretStyle={caretStyle}
            activeWordRef={activeWordRef}
          />
        );
      })}
    </div>
  );
});

WordDisplay.displayName = 'WordDisplay';

export default WordDisplay;

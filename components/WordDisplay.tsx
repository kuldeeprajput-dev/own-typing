'use client';

import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { CharState } from '@/types';
import { useKeyboardSettings, KeyboardTheme } from '@/context/KeyboardSettingsContext';

// ── Caret colors per theme ──────────────────────────────────────────────────
interface CaretColors { bg: string; shadow: string }

const CARET_COLORS: Record<KeyboardTheme, { dark: CaretColors; light: CaretColors }> = {
  Classic: {
    dark:  { bg: '#EAB308', shadow: 'rgba(234,179,8,0.25)' },
    light: { bg: '#EAB308', shadow: 'rgba(234,179,8,0.25)' },
  },
  Mint: {
    dark:  { bg: '#34d399', shadow: 'rgba(52,211,153,0.25)' },
    light: { bg: '#059669', shadow: 'rgba(5,150,105,0.25)' },
  },
  Royal: {
    dark:  { bg: '#60a5fa', shadow: 'rgba(96,165,250,0.25)' },
    light: { bg: '#2563eb', shadow: 'rgba(37,99,235,0.25)' },
  },
  Dolch: {
    dark:  { bg: '#22d3ee', shadow: 'rgba(34,220,238,0.25)' },
    light: { bg: '#0891b2', shadow: 'rgba(8,145,178,0.25)' },
  },
  Sand: {
    dark:  { bg: '#d97706', shadow: 'rgba(217,119,6,0.25)' },
    light: { bg: '#b45309', shadow: 'rgba(180,83,9,0.25)' },
  },
  Scarlet: {
    dark:  { bg: '#ef4444', shadow: 'rgba(239,68,68,0.25)' },
    light: { bg: '#dc2626', shadow: 'rgba(220,38,38,0.25)' },
  },
};

// ── Color constants ─────────────────────────────────────────────────────────
const DARK_IDLE      = '#71717a';  // zinc-500
const DARK_CORRECT   = '#ffffff';
const DARK_CURRENT   = '#71717a';
const LIGHT_IDLE     = '#9ca3af';  // gray-400
const LIGHT_CORRECT  = '#18181b';  // zinc-900
const LIGHT_CURRENT  = '#9ca3af';
const INCORRECT_TEXT = '#ef4444';
const INCORRECT_BG_DARK  = 'rgba(127,29,29,0.2)';
const INCORRECT_BG_LIGHT = '#fee2e2';

// ── Pure DOM word renderer (no React per-character components) ───────────────
function renderWordToDOM(
  container: HTMLSpanElement,
  charStates: CharState[],
  isDark: boolean,
) {
  // Reuse existing spans when possible, add/remove only if count changed
  const existing = container.children;
  const needed = charStates.length;

  // Add missing spans
  while (container.childElementCount < needed) {
    const span = document.createElement('span');
    span.style.display = 'inline';
    container.appendChild(span);
  }
  // Remove excess spans
  while (container.childElementCount > needed) {
    container.removeChild(container.lastChild!);
  }

  for (let i = 0; i < needed; i++) {
    const span = existing[i] as HTMLSpanElement;
    const cs = charStates[i];

    // Set text only if changed
    if (span.textContent !== cs.char) {
      span.textContent = cs.char;
    }

    // Apply colors directly — no CSS classes, no transitions, zero overhead
    let color: string;
    let bg = '';

    switch (cs.status) {
      case 'correct':
        color = isDark ? DARK_CORRECT : LIGHT_CORRECT;
        break;
      case 'incorrect':
        color = INCORRECT_TEXT;
        bg = isDark ? INCORRECT_BG_DARK : INCORRECT_BG_LIGHT;
        break;
      case 'current':
        color = isDark ? DARK_CURRENT : LIGHT_CURRENT;
        break;
      default: // idle
        color = isDark ? DARK_IDLE : LIGHT_IDLE;
        break;
    }

    if (span.style.color !== color) span.style.color = color;
    if (span.style.backgroundColor !== bg) span.style.backgroundColor = bg;
  }
}

// ── Main WordDisplay component ──────────────────────────────────────────────
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
  const containerRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const wordSpansRef = useRef<HTMLSpanElement[]>([]);
  const prevCharStatesRef = useRef<CharState[][] | null>(null);

  // Build word spans ONCE on mount/word-list change (not on every keystroke)
  const wordCount = words.length;

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear and rebuild word spans only if word list changed
    const existingCount = wordSpansRef.current.length;
    if (existingCount !== wordCount) {
      // Remove all children efficiently
      container.textContent = '';
      // Re-add the caret element
      if (caretRef.current) {
        container.appendChild(caretRef.current);
      }
      wordSpansRef.current = [];

      for (let i = 0; i < wordCount; i++) {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.margin = '0.25rem 0.35em';
        wordSpan.style.userSelect = 'none';
        container.appendChild(wordSpan);
        wordSpansRef.current.push(wordSpan);
      }

      prevCharStatesRef.current = null; // Force full re-render
    }
  }, [wordCount]);

  const lastIsDarkRef = useRef(isDark);
  const lastThemeRef = useRef(settings.theme);

  // Update ONLY the changed words on every keystroke — direct DOM, zero React reconciliation
  useLayoutEffect(() => {
    const prev = prevCharStatesRef.current;
    const spans = wordSpansRef.current;
    const isDarkChanged = lastIsDarkRef.current !== isDark;
    const themeChanged = lastThemeRef.current !== settings.theme;

    lastIsDarkRef.current = isDark;
    lastThemeRef.current = settings.theme;

    for (let i = 0; i < wordCount; i++) {
      const cs = charStates[i];
      if (!cs || !spans[i]) continue;

      // Skip words whose charStates reference hasn't changed (immutable check)
      // BUT do not skip if isDark or theme changed, because we need to re-color them
      if (!isDarkChanged && !themeChanged && prev && prev[i] === cs) continue;

      renderWordToDOM(spans[i], cs, isDark);
    }

    prevCharStatesRef.current = charStates;
  }, [charStates, isDark, settings.theme, wordCount]);

  // Forward activeWordRef to the current word span
  useLayoutEffect(() => {
    const spans = wordSpansRef.current;
    if (activeWordRef && 'current' in activeWordRef) {
      (activeWordRef as React.MutableRefObject<HTMLSpanElement | null>).current =
        spans[currentWordIndex] ?? null;
    }
  }, [currentWordIndex, activeWordRef]);

  // Position the caret via CSS transform (GPU-accelerated, no layout thrash)
  useLayoutEffect(() => {
    const caret = caretRef.current;
    const spans = wordSpansRef.current;
    if (!caret) return;

    const wordSpan = spans[currentWordIndex];
    if (!wordSpan) {
      caret.style.opacity = '0';
      return;
    }

    const cs = charStates[currentWordIndex];
    if (!cs) {
      caret.style.opacity = '0';
      return;
    }

    // Find the current char index within this word
    let targetCharEl: Element | null = null;
    let atEnd = true;
    for (let i = 0; i < cs.length; i++) {
      if (cs[i].status === 'current') {
        targetCharEl = wordSpan.children[i] ?? null;
        atEnd = false;
        break;
      }
    }

    if (atEnd) {
      // Caret goes after the last typed character
      const lastChild = wordSpan.lastElementChild as HTMLElement | null;
      if (lastChild) {
        const x = lastChild.offsetLeft + lastChild.offsetWidth;
        const y = lastChild.offsetTop;
        caret.style.transform = `translate3d(${x - 1}px, ${y}px, 0)`;
        caret.style.opacity = '1';
      } else {
        caret.style.opacity = '0';
      }
    } else if (targetCharEl) {
      const el = targetCharEl as HTMLElement;
      const x = el.offsetLeft;
      const y = el.offsetTop;
      caret.style.transform = `translate3d(${x - 1}px, ${y}px, 0)`;
      caret.style.opacity = '1';
    } else {
      caret.style.opacity = '0';
    }

    // Reset blink animation and keep solid while typing
    const innerCaret = caret.firstElementChild as HTMLElement | null;
    if (innerCaret) {
      innerCaret.style.animation = 'none';
      innerCaret.style.opacity = '1';
    }

    // Only start blinking after 3 seconds of inactivity
    const timeoutId = setTimeout(() => {
      if (innerCaret) {
        innerCaret.style.animation = 'blink 1s ease-in-out infinite';
      }
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [charStates, currentWordIndex]);

  // Compute caret color
  const caretColors = useMemo(() => {
    const tc = CARET_COLORS[settings.theme] || CARET_COLORS.Classic;
    return isDark ? tc.dark : tc.light;
  }, [settings.theme, isDark]);

  return (
    <div className="relative w-full">
      {/* Global Caret: Outer div handles smooth sliding transform & focus opacity. Inner handles smooth blink animation. */}
      <div
        ref={caretRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: '-0.15em',
          width: '2.5px',
          height: '1.5em',
          pointerEvents: 'none',
          zIndex: 10,
          opacity: 0,
          transform: 'translate3d(-10px, -10px, 0)',
          transition: 'transform 85ms cubic-bezier(0.25, 1, 0.5, 1), opacity 150ms ease-out',
          willChange: 'transform',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '9999px',
            backgroundColor: caretColors.bg,
            animation: 'none',
            willChange: 'opacity',
          }}
        />
      </div>

      {/* Words container */}
      <div
        ref={containerRef}
        className="w-full text-justify font-['JetBrains_Mono',_monospace] text-lg leading-relaxed sm:text-xl md:text-2xl"
        style={{ textAlignLast: 'left', textJustify: 'inter-word' }}
      />
    </div>
  );
});

WordDisplay.displayName = 'WordDisplay';

export default WordDisplay;

"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { TestMode, TestOptions } from "@/types";
import ModeSelector from "./ModeSelector";
import Stats from "./Stats";
import WordDisplay from "./WordDisplay";
import VirtualKeyboard from "./VirtualKeyboard";
import KeyboardSettingsModal from "./KeyboardSettingsModal";
import {
  useKeyboardSettings,
  KeyboardTheme,
} from "@/context/KeyboardSettingsContext";
import ResultsDashboard from "./ResultsDashboard";

interface ThemeStyles {
  bg: string;
  text: string;
  accentText: string;
  tryAgainBtn: string;
  tryAgainHover: string;
  restartBtn: string;
  focusCard: string;
}

const themeStylesMap: Record<
  KeyboardTheme,
  { dark: ThemeStyles; light: ThemeStyles }
> = {
  Classic: {
    dark: {
      bg: "bg-[#0f0f0f]",
      text: "text-zinc-100",
      accentText: "text-amber-500",
      tryAgainBtn:
        "bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]",
      tryAgainHover: "hover:scale-105 active:scale-95",
      restartBtn: "text-zinc-500 hover:text-zinc-300",
      focusCard: "bg-zinc-800/80 text-zinc-400 border border-zinc-700/50",
    },
    light: {
      bg: "bg-[#fafafa]",
      text: "text-zinc-900",
      accentText: "text-amber-600",
      tryAgainBtn:
        "bg-amber-600 text-white hover:bg-amber-500 shadow-[0_0_20px_rgba(217,119,6,0.15)]",
      tryAgainHover: "hover:scale-105 active:scale-95",
      restartBtn: "text-zinc-400 hover:text-zinc-600",
      focusCard: "bg-zinc-200/85 text-zinc-600 border border-zinc-300/50",
    },
  },
  Mint: {
    dark: {
      bg: "bg-[#0c1815]",
      text: "text-[#d1fae5]",
      accentText: "text-emerald-400",
      tryAgainBtn:
        "bg-emerald-400 text-black hover:bg-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.2)]",
      tryAgainHover: "hover:scale-105 active:scale-95",
      restartBtn: "text-emerald-600/70 hover:text-emerald-300",
      focusCard:
        "bg-[#0e211e]/90 text-emerald-300/80 border border-emerald-950/50",
    },
    light: {
      bg: "bg-[#f0fdf4]",
      text: "text-[#064e3b]",
      accentText: "text-emerald-600",
      tryAgainBtn:
        "bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_20px_rgba(5,150,105,0.15)]",
      tryAgainHover: "hover:scale-105 active:scale-95",
      restartBtn: "text-emerald-600/50 hover:text-emerald-800",
      focusCard: "bg-emerald-100/90 text-emerald-900 border border-emerald-200",
    },
  },
  Royal: {
    dark: {
      bg: "bg-[#070b13]",
      text: "text-[#dbeafe]",
      accentText: "text-blue-400",
      tryAgainBtn:
        "bg-blue-500 text-white hover:bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]",
      tryAgainHover: "hover:scale-105 active:scale-95",
      restartBtn: "text-blue-500/70 hover:text-blue-300",
      focusCard: "bg-[#0a0f1d]/90 text-blue-300/80 border border-blue-950/50",
    },
    light: {
      bg: "bg-[#f0f7ff]",
      text: "text-[#1e3a8a]",
      accentText: "text-blue-600",
      tryAgainBtn:
        "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.15)]",
      tryAgainHover: "hover:scale-105 active:scale-95",
      restartBtn: "text-blue-500/50 hover:text-blue-800",
      focusCard: "bg-blue-100/90 text-blue-900 border border-blue-200",
    },
  },
  Dolch: {
    dark: {
      bg: "bg-[#181818]",
      text: "text-[#e5e7eb]",
      accentText: "text-cyan-400",
      tryAgainBtn:
        "bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]",
      tryAgainHover: "hover:scale-105 active:scale-95",
      restartBtn: "text-zinc-500 hover:text-zinc-300",
      focusCard: "bg-[#1c1c1c]/90 text-zinc-400 border border-zinc-800/80",
    },
    light: {
      bg: "bg-[#f3f4f6]",
      text: "text-[#111827]",
      accentText: "text-cyan-600",
      tryAgainBtn:
        "bg-cyan-600 text-white hover:bg-cyan-500 shadow-[0_0_20px_rgba(8,145,178,0.15)]",
      tryAgainHover: "hover:scale-105 active:scale-95",
      restartBtn: "text-zinc-400 hover:text-zinc-700",
      focusCard: "bg-zinc-200/90 text-zinc-700 border border-zinc-300",
    },
  },
  Sand: {
    dark: {
      bg: "bg-[#14120e]",
      text: "text-[#f5f5dc]",
      accentText: "text-amber-500",
      tryAgainBtn:
        "bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]",
      tryAgainHover: "hover:scale-105 active:scale-95",
      restartBtn: "text-[#8c7853]/70 hover:text-[#f5f5dc]",
      focusCard: "bg-[#1f1a14]/90 text-[#8c7853] border border-[#3e3427]/80",
    },
    light: {
      bg: "bg-[#fdfbf7]",
      text: "text-[#451a03]",
      accentText: "text-amber-700",
      tryAgainBtn:
        "bg-amber-700 text-white hover:bg-amber-600 shadow-[0_0_20px_rgba(180,83,9,0.15)]",
      tryAgainHover: "hover:scale-105 active:scale-95",
      restartBtn: "text-[#8c7853]/60 hover:text-[#451a03]",
      focusCard: "bg-[#ebdcc3]/90 text-[#8c7853] border border-[#ebdcc3]/85",
    },
  },
  Scarlet: {
    dark: {
      bg: "bg-[#140606]",
      text: "text-[#ffe4e6]",
      accentText: "text-red-400",
      tryAgainBtn:
        "bg-red-500 text-white hover:bg-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]",
      tryAgainHover: "hover:scale-105 active:scale-95",
      restartBtn: "text-red-700/70 hover:text-[#ffe4e6]",
      focusCard: "bg-[#1e0a0a]/90 text-red-400/80 border border-red-950/80",
    },
    light: {
      bg: "bg-[#fff5f5]",
      text: "text-[#7f1d1d]",
      accentText: "text-red-600",
      tryAgainBtn:
        "bg-red-600 text-white hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.15)]",
      tryAgainHover: "hover:scale-105 active:scale-95",
      restartBtn: "text-red-500/50 hover:text-red-800",
      focusCard: "bg-red-100/90 text-red-900 border border-red-200",
    },
  },
};

export default function TypingTest() {
  const [isFocused, setIsFocused] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const containerRef = useRef<HTMLLabelElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);

  const { settings } = useKeyboardSettings();
  const isDark = settings.isDark;
  const themeStyles = themeStylesMap[settings.theme] || themeStylesMap.Classic;
  const styles = isDark ? themeStyles.dark : themeStyles.light;

  const {
    charStates,
    words,
    status,
    mode,
    options,
    stats,
    elapsed,
    currentWordIndex,
    inputValue,
    handleInput,
    restart,
    setMode,
    setOptions,
    inputRef,
    history,
  } = useTypingEngine(30);

  useEffect(() => {
    if (status === "finished") {
      const savedHistory = localStorage.getItem("owntype_results_history");
      let historyArray = [];
      if (savedHistory) {
        try {
          historyArray = JSON.parse(savedHistory);
        } catch (e) {
          console.error(e);
        }
      }

      const lastEntry = historyArray[0];
      const now = Date.now();
      if (lastEntry && now - lastEntry.id < 1000) {
        return;
      }

      const newEntry = {
        id: now,
        date: new Date().toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        mode: mode,
      };
      historyArray.unshift(newEntry);
      localStorage.setItem(
        "owntype_results_history",
        JSON.stringify(historyArray.slice(0, 50)),
      );
    }
  }, [status, stats.wpm, stats.accuracy, mode]);

  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      const activeWordEl = activeWordRef.current;
      const containerEl = containerRef.current;

      const wordTop = activeWordEl.offsetTop;
      const wordHeight = activeWordEl.offsetHeight;
      const wordBottom = wordTop + wordHeight;
      const visibleTop = containerEl.scrollTop;
      const visibleBottom = visibleTop + containerEl.clientHeight;

      if (wordTop < visibleTop || wordBottom > visibleBottom) {
        // Move one row at a time instead of stacking smooth-scroll animations.
        containerEl.scrollTop = Math.max(0, wordTop - wordHeight);
      }
    }
  }, [currentWordIndex]);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (status !== "finished") {
        handleInput(e.target.value);
      }
    },
    [handleInput, status],
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const focusTypingInput = useCallback(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const openSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const handleModeChange = useCallback(
    (newMode: TestMode) => {
      setMode(newMode);
    },
    [setMode],
  );

  const handleOptionsChange = useCallback(
    (newOptions: Partial<TestOptions>) => {
      setOptions(newOptions);
    },
    [setOptions],
  );

  const handleRestart = useCallback(() => {
    restart();
    focusTypingInput();
  }, [focusTypingInput, restart]);

  useEffect(() => {
    focusTypingInput();
  }, [focusTypingInput]);

  useEffect(() => {
    if (status === "finished") inputRef.current?.blur();
  }, [inputRef, status]);

  useEffect(() => {
    const handleTabRestart = (event: KeyboardEvent) => {
      if (
        event.code !== "Tab" ||
        event.shiftKey ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }

      const target = event.target;
      const isTypingContext =
        target === inputRef.current ||
        target === document.body ||
        target === document.documentElement;

      if (!isTypingContext) return;

      event.preventDefault();
      handleRestart();
    };

    window.addEventListener("keydown", handleTabRestart);
    return () => window.removeEventListener("keydown", handleTabRestart);
  }, [handleRestart, inputRef]);

  return (
    <div
      className={`min-h-dvh max-h-dvh w-full overflow-x-hidden overflow-y-auto [scrollbar-gutter:stable_both-edges] transition-colors duration-500 ease-in-out ${styles.bg} ${styles.text}`}
    >
      <div
        className="mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col items-center justify-start px-4 py-4 sm:px-6"
      >
        <KeyboardSettingsModal
          isOpen={isSettingsOpen}
          onClose={closeSettings}
          isDark={isDark}
        />

        <div
          className={`shrink-0 transition-all duration-300 ${status === "running" ? "pointer-events-none opacity-0" : "opacity-100"}`}
          aria-hidden={status === "running"}
          inert={status === "running"}
        >
          <ModeSelector
            mode={mode}
            options={options}
            onModeChange={handleModeChange}
            onOptionsChange={handleOptionsChange}
            onKeyboardSettingsClick={openSettings}
            onBrandClick={handleRestart}
            brandAccentText={styles.accentText}
            brandText={styles.text}
            isDark={isDark}
          />
        </div>

        {status !== "finished" && (
          <div className="w-full shrink-0">
            <Stats
              stats={stats}
              mode={mode}
              elapsed={elapsed}
              bestWpm={null}
              isDark={isDark}
            />
          </div>
        )}

        {status !== "finished" && (
          <label
            ref={containerRef}
            htmlFor="typing-input"
            onClick={focusTypingInput}
            className="relative mt-6 h-[6.984rem] w-full max-w-[1400px] shrink-0 cursor-text overflow-y-hidden px-4 text-center sm:h-[7.594rem] md:h-[8.813rem]"
          >
            <WordDisplay
              charStates={charStates}
              words={words}
              currentWordIndex={currentWordIndex}
              isDark={isDark}
              activeWordRef={activeWordRef}
            />
            {!isFocused && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`px-4 py-2 rounded-lg text-sm transition-all duration-500 ease-in-out ${styles.focusCard}`}
                >
                  Click or tap to start typing
                </div>
              </div>
            )}
          </label>
        )}

        {status === "finished" && (
          <div className="flex w-full flex-1 items-center justify-center py-4 sm:py-6">
            <ResultsDashboard
              stats={stats}
              mode={mode}
              history={history}
              words={words}
              isDark={isDark}
              onRestart={handleRestart}
            />
          </div>
        )}

        <label htmlFor="typing-input" className="sr-only">
          Typing test input
        </label>
        <p id="typing-instructions" className="sr-only">
          Type the highlighted word. Press Space to move to the next word and
          Backspace to correct the current word.
        </p>

        <input
          id="typing-input"
          ref={inputRef}
          type="text"
          value={inputValue}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 w-1 h-1 pointer-events-none"
          onChange={onInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-describedby="typing-instructions"
          aria-label="Typing test input"
        />

        <p
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {status === "finished"
            ? `Typing test complete. ${stats.wpm} words per minute with ${stats.accuracy} percent accuracy.`
            : ""}
        </p>

        {(status === "idle" || status === "running") && (
          <button
            onClick={handleRestart}
            className={`mt-1 shrink-0 transition-all duration-500 ease-in-out ${styles.restartBtn}`}
          >
            Restart
          </button>
        )}

        {status !== "finished" && (
          <div
            className="hidden w-full shrink-0 justify-center md:[@media(min-height:760px)]:flex"
            aria-hidden="true"
            inert
          >
            <VirtualKeyboard />
          </div>
        )}
      </div>

      <div
        className="pointer-events-none fixed inset-x-0 bottom-5 z-20 flex items-center justify-center gap-3 font-['JetBrains_Mono',_monospace] text-sm sm:bottom-6 mobile-hide"
        aria-hidden="true"
      >
        <kbd
          className={`inline-flex h-9 min-w-12 items-center justify-center rounded border px-2 font-medium ${styles.accentText} ${
            isDark
              ? "border-zinc-800 bg-zinc-900/80"
              : "border-zinc-200 bg-white/80"
          }`}
        >
          tab
        </kbd>
        <span className={isDark ? "text-zinc-500" : "text-zinc-400"}>
          to restart
        </span>
      </div>
    </div>
  );
}

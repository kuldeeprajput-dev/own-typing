"use client";

import React from "react";
import { TestMode, TestOptions } from "@/types";
interface ModeSelectorProps {
  mode: TestMode;
  options: TestOptions;
  onModeChange: (mode: TestMode) => void;
  onOptionsChange: (options: Partial<TestOptions>) => void;
  isDark?: boolean;
}

const modes: TestMode[] = [15, 30, 60];

const ModeSelector = React.memo(function ModeSelector({
  mode,
  options,
  onModeChange,
  onOptionsChange,
  isDark = true,
}: ModeSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-4 mb-10 group">
      <div className={`
        flex items-center gap-6 px-6 py-3 rounded-2xl shadow-xl transition-all duration-700
        ${isDark 
          ? 'bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md shadow-black/20' 
          : 'bg-white border border-zinc-200 shadow-zinc-200/50'}
      `}>
        <div className={`flex items-center gap-1 border-r pr-6 ${isDark ? 'border-zinc-800/50' : 'border-zinc-200'}`}>
          <div className="flex gap-1">
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                className={`
                  relative px-4 py-1.5 rounded-xl text-sm font-bold transition-all duration-300
                  ${
                    mode === m
                      ? "text-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                      : isDark
                        ? "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                        : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {m}s
                {mode === m && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="flex gap-2">
            {[
              { id: 'punctuation', label: '@', full: 'punctuation' },
              { id: 'capitals', label: 'Aa', full: 'capitals' },
              { id: 'numbers', label: '123', full: 'numbers' }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => onOptionsChange({ [opt.id]: !options[opt.id as keyof TestOptions] })}
                className={`
                  group/btn relative px-4 py-1.5 rounded-xl text-sm font-bold transition-all duration-300
                  ${options[opt.id as keyof TestOptions] 
                    ? 'text-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                    : isDark ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}
                `}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs opacity-50">{opt.label}</span>
                  {opt.full}
                </span>
                {options[opt.id as keyof TestOptions] && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ModeSelector;

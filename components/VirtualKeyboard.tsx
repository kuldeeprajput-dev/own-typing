'use client';

import React, { useEffect, useState } from 'react';

interface KeyConfig {
  code: string;
  width: number; // in pixels
  type: 'orange' | 'light' | 'dark';
  label: string;
  subLabel?: string;
  icon?: string;
}

const row1: KeyConfig[] = [
  { code: 'Escape', width: 50, type: 'orange', label: 'esc' },
  { code: 'F1', width: 50, type: 'light', label: 'F1', icon: 'brightness-down' },
  { code: 'F2', width: 50, type: 'light', label: 'F2', icon: 'brightness-up' },
  { code: 'F3', width: 50, type: 'light', label: 'F3', icon: 'layout-dashboard' },
  { code: 'F4', width: 50, type: 'light', label: 'F4', icon: 'search' },
  { code: 'F5', width: 50, type: 'dark', label: 'F5', icon: 'microphone' },
  { code: 'F6', width: 50, type: 'dark', label: 'F6', icon: 'moon' },
  { code: 'F7', width: 50, type: 'dark', label: 'F7', icon: 'player-track-prev' },
  { code: 'F8', width: 50, type: 'dark', label: 'F8', icon: 'player-skip-forward' },
  { code: 'F9', width: 50, type: 'dark', label: 'F9', icon: 'player-track-next' },
  { code: 'F10', width: 50, type: 'light', label: 'F10', icon: 'volume-3' },
  { code: 'F11', width: 50, type: 'light', label: 'F11', icon: 'volume-2' },
  { code: 'F12', width: 50, type: 'light', label: 'F12', icon: 'volume' },
  { code: 'F13', width: 50, type: 'dark', label: '', icon: 'frame' },
  { code: 'Delete', width: 50, type: 'dark', label: 'del' },
  { code: 'F14', width: 50, type: 'dark', label: '', icon: 'bulb' },
];

const row2: KeyConfig[] = [
  { code: 'Backquote', width: 50, type: 'light', label: '`', subLabel: '~' },
  { code: 'Digit1', width: 50, type: 'light', label: '1', subLabel: '!' },
  { code: 'Digit2', width: 50, type: 'light', label: '2', subLabel: '@' },
  { code: 'Digit3', width: 50, type: 'light', label: '3', subLabel: '#' },
  { code: 'Digit4', width: 50, type: 'light', label: '4', subLabel: '$' },
  { code: 'Digit5', width: 50, type: 'light', label: '5', subLabel: '%' },
  { code: 'Digit6', width: 50, type: 'light', label: '6', subLabel: '^' },
  { code: 'Digit7', width: 50, type: 'light', label: '7', subLabel: '&' },
  { code: 'Digit8', width: 50, type: 'light', label: '8', subLabel: '*' },
  { code: 'Digit9', width: 50, type: 'light', label: '9', subLabel: '(' },
  { code: 'Digit0', width: 50, type: 'light', label: '0', subLabel: ')' },
  { code: 'Minus', width: 50, type: 'light', label: '-', subLabel: '_' },
  { code: 'Equal', width: 50, type: 'light', label: '=', subLabel: '+' },
  { code: 'Backspace', width: 100, type: 'dark', label: '', icon: 'arrow-narrow-left' },
  { code: 'PageUp', width: 50, type: 'dark', label: 'pgup' },
];

const row3: KeyConfig[] = [
  { code: 'Tab', width: 75, type: 'dark', label: 'tab' },
  { code: 'KeyQ', width: 50, type: 'light', label: 'Q' },
  { code: 'KeyW', width: 50, type: 'light', label: 'W' },
  { code: 'KeyE', width: 50, type: 'light', label: 'E' },
  { code: 'KeyR', width: 50, type: 'light', label: 'R' },
  { code: 'KeyT', width: 50, type: 'light', label: 'T' },
  { code: 'KeyY', width: 50, type: 'light', label: 'Y' },
  { code: 'KeyU', width: 50, type: 'light', label: 'U' },
  { code: 'KeyI', width: 50, type: 'light', label: 'I' },
  { code: 'KeyO', width: 50, type: 'light', label: 'O' },
  { code: 'KeyP', width: 50, type: 'light', label: 'P' },
  { code: 'BracketLeft', width: 50, type: 'light', label: '[', subLabel: '{' },
  { code: 'BracketRight', width: 50, type: 'light', label: ']', subLabel: '}' },
  { code: 'Backslash', width: 75, type: 'dark', label: '\\', subLabel: '|' },
  { code: 'PageDown', width: 50, type: 'dark', label: 'pgdn' },
];

const row4: KeyConfig[] = [
  { code: 'CapsLock', width: 100, type: 'dark', label: 'caps lock' },
  { code: 'KeyA', width: 50, type: 'light', label: 'A' },
  { code: 'KeyS', width: 50, type: 'light', label: 'S' },
  { code: 'KeyD', width: 50, type: 'light', label: 'D' },
  { code: 'KeyF', width: 50, type: 'light', label: 'F' },
  { code: 'KeyG', width: 50, type: 'light', label: 'G' },
  { code: 'KeyH', width: 50, type: 'light', label: 'H' },
  { code: 'KeyJ', width: 50, type: 'light', label: 'J' },
  { code: 'KeyK', width: 50, type: 'light', label: 'K' },
  { code: 'KeyL', width: 50, type: 'light', label: 'L' },
  { code: 'Semicolon', width: 50, type: 'light', label: ';', subLabel: ':' },
  { code: 'Quote', width: 50, type: 'light', label: "'", subLabel: '"' },
  { code: 'Enter', width: 100, type: 'dark', label: 'return' },
  { code: 'Home', width: 50, type: 'dark', label: 'home' },
];

const row5: KeyConfig[] = [
  { code: 'ShiftLeft', width: 123, type: 'dark', label: 'shift' },
  { code: 'KeyZ', width: 50, type: 'light', label: 'Z' },
  { code: 'KeyX', width: 50, type: 'light', label: 'X' },
  { code: 'KeyC', width: 50, type: 'light', label: 'C' },
  { code: 'KeyV', width: 50, type: 'light', label: 'V' },
  { code: 'KeyB', width: 50, type: 'light', label: 'B' },
  { code: 'KeyN', width: 50, type: 'light', label: 'N' },
  { code: 'KeyM', width: 50, type: 'light', label: 'M' },
  { code: 'Comma', width: 50, type: 'light', label: ',', subLabel: '<' },
  { code: 'Period', width: 50, type: 'light', label: '.', subLabel: '>' },
  { code: 'Slash', width: 50, type: 'light', label: '/', subLabel: '?' },
  { code: 'ShiftRight', width: 77, type: 'dark', label: 'shift' },
  { code: 'ArrowUp', width: 50, type: 'light', label: '', icon: 'chevron-up' },
  { code: 'End', width: 50, type: 'dark', label: 'end' },
];

const row6: KeyConfig[] = [
  { code: 'ControlLeft', width: 62, type: 'dark', label: 'ctrl' },
  { code: 'AltLeft', width: 62, type: 'dark', label: 'option' },
  { code: 'MetaLeft', width: 62, type: 'dark', label: '', icon: 'command' },
  { code: 'Space', width: 314, type: 'light', label: '' },
  { code: 'MetaRight', width: 50, type: 'dark', label: '', icon: 'command' },
  { code: 'Fn', width: 50, type: 'dark', label: 'fn' },
  { code: 'ControlRight', width: 50, type: 'dark', label: 'ctrl' },
  { code: 'ArrowLeft', width: 50, type: 'light', label: '', icon: 'chevron-left' },
  { code: 'ArrowDown', width: 50, type: 'light', label: '', icon: 'chevron-down' },
  { code: 'ArrowRight', width: 50, type: 'light', label: '', icon: 'chevron-right' },
];

const allRows = [row1, row2, row3, row4, row5, row6];

function renderIcon(iconName: string) {
  switch (iconName) {
    case 'brightness-down':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[10px]"><path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path><path d="M12 5l0 .01"></path><path d="M17 7l0 .01"></path><path d="M19 12l0 .01"></path><path d="M17 17l0 .01"></path><path d="M12 19l0 .01"></path><path d="M7 17l0 .01"></path><path d="M5 12l0 .01"></path><path d="M7 7l0 .01"></path></svg>
      );
    case 'brightness-up':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[10px]"><path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path><path d="M12 5l0 -2"></path><path d="M17 7l1.4 -1.4"></path><path d="M19 12l2 0"></path><path d="M17 17l1.4 1.4"></path><path d="M12 19l0 2"></path><path d="M7 17l-1.4 1.4"></path><path d="M6 12l-2 0"></path><path d="M7 7l-1.4 -1.4"></path></svg>
      );
    case 'layout-dashboard':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[10px]"><path d="M5 4h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1"></path><path d="M5 16h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1"></path><path d="M15 12h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1"></path><path d="M15 4h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1"></path></svg>
      );
    case 'search':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[10px]"><path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path></svg>
      );
    case 'microphone':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[10px]"><path d="M9 5a3 3 0 0 1 3 -3a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3a3 3 0 0 1 -3 -3l0 -5"></path><path d="M5 10a7 7 0 0 0 14 0"></path><path d="M8 21l8 0"></path><path d="M12 17l0 4"></path></svg>
      );
    case 'moon':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[10px]"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008"></path></svg>
      );
    case 'player-track-prev':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[10px]"><path d="M21 5v14l-8 -7l8 -7"></path><path d="M10 5v14l-8 -7l8 -7"></path></svg>
      );
    case 'player-skip-forward':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[10px]"><path d="M4 5v14l12 -7l-12 -7"></path><path d="M20 5l0 14"></path></svg>
      );
    case 'player-track-next':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[10px]"><path d="M3 5v14l8 -7l-8 -7"></path><path d="M14 5v14l8 -7l-8 -7"></path></svg>
      );
    case 'volume-3':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[10px]"><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5"></path><path d="M16 10l4 4m0 -4l-4 4"></path></svg>
      );
    case 'volume-2':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[10px]"><path d="M15 8a5 5 0 0 1 0 8"></path><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5"></path></svg>
      );
    case 'volume':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[10px]"><path d="M15 8a5 5 0 0 1 0 8"></path><path d="M17.7 5a9 9 0 0 1 0 14"></path><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5"></path></svg>
      );
    case 'frame':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[10px]"><path d="M4 7l16 0"></path><path d="M4 17l16 0"></path><path d="M7 4l0 16"></path><path d="M17 4l0 16"></path></svg>
      );
    case 'bulb':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[12px]"><path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7"></path><path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3"></path><path d="M9.7 17l4.6 0"></path></svg>
      );
    case 'arrow-narrow-left':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[12px]"><path d="M5 12l14 0"></path><path d="M5 12l4 4"></path><path d="M5 12l4 -4"></path></svg>
      );
    case 'chevron-up':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[12px]"><path d="M6 15l6 -6l6 6"></path></svg>
      );
    case 'chevron-left':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[12px]"><path d="M15 6l-6 6l6 6"></path></svg>
      );
    case 'chevron-down':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[12px]"><path d="M6 9l6 6l6 -6"></path></svg>
      );
    case 'chevron-right':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[12px]"><path d="M9 6l6 6l-6 6"></path></svg>
      );
    case 'command':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[12px]"><path d="M7 9a2 2 0 1 1 2 -2v10a2 2 0 1 1 -2 -2h10a2 2 0 1 1 -2 2v-10a2 2 0 1 1 2 2h-10"></path></svg>
      );
    default:
      return null;
  }
}

export default function VirtualKeyboard() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let code = e.code;
      // Normalise code where needed (e.g. NumpadEnter to Enter)
      if (code === 'NumpadEnter') code = 'Enter';
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.add(code);
        return next;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      let code = e.code;
      if (code === 'NumpadEnter') code = 'Enter';
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });
    };

    const handleBlur = () => {
      setPressedKeys(new Set());
    };

    window.addEventListener('keydown', handleKeyDown, { passive: true });
    window.addEventListener('keyup', handleKeyUp, { passive: true });
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return (
    <div className="w-full overflow-x-auto flex justify-center py-6 select-none no-scrollbar">
      {/* Keyboard wrapper scaling for responsive widths */}
      <div className="scale-[0.6] origin-top sm:scale-[0.8] md:scale-95 lg:scale-100 my-[-55px] sm:my-[-25px] md:my-[-5px] lg:my-0 transition-transform duration-300">
        <div className="bg-black/70 border-2 border-black p-3 rounded-[16px] w-fit h-fit shadow-2xl">
          <div className="bg-black/80 border border-black rounded-[5px] rounded-t-[8px] h-[278px] overflow-hidden">
            <div className="-space-y-1 -translate-y-1 rounded-[5px] overflow-hidden">
              {allRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((key) => {
                    const isPressed = pressedKeys.has(key.code);
                    const innerWidth = key.width - 13;

                    // Compute styles based on key type and pressed state
                    let baseBg = 'rgba(245, 245, 245, 0.8)';
                    let innerBg = 'rgb(245, 245, 245)';
                    let textColor = 'rgba(0, 0, 0, 0.7)';
                    let borderInner = 'border-black/40';

                    if (key.type === 'orange') {
                      baseBg = 'rgba(245, 118, 68, 0.8)';
                      innerBg = 'rgb(245, 118, 68)';
                      textColor = 'rgba(0, 0, 0, 0.5)';
                    } else if (key.type === 'dark') {
                      baseBg = 'rgba(115, 115, 115, 0.8)';
                      innerBg = 'rgb(115, 115, 115)';
                      textColor = 'rgba(255, 255, 255, 0.7)';
                    }

                    // Apply pressed styles (amber accent)
                    if (isPressed) {
                      baseBg = 'rgba(245, 158, 11, 0.6)';
                      innerBg = 'rgb(245, 158, 11)';
                      textColor = 'rgba(0, 0, 0, 0.9)';
                      borderInner = 'border-amber-600/50';
                    }

                    return (
                      <button
                        key={key.code}
                        type="button"
                        aria-label={key.label || key.code}
                        className="flex items-end cursor-pointer touch-none appearance-none border-0 bg-transparent p-0 text-left focus:outline-none"
                        style={{ height: '50px', width: `${key.width}px` }}
                      >
                        <div
                          className="relative overflow-hidden h-[50px] rounded-[4px] rounded-t-[12px] border border-black/40 flex items-start justify-center transition-all duration-100"
                          style={{
                            width: `${key.width}px`,
                            backgroundColor: baseBg,
                          }}
                        >
                          <div
                            className={`relative z-10 h-[37px] rounded-[6px] border border-t-0 ${borderInner} transition-all duration-100 text-[9px] font-semibold flex flex-col items-center justify-between p-1 select-none`}
                            style={{
                              width: `${innerWidth}px`,
                              backgroundColor: innerBg,
                              color: textColor,
                              transform: isPressed ? 'translateY(5px)' : 'translateY(0px)',
                            }}
                          >
                            {/* Render different labels depending on whether subLabel or icon exists */}
                            {key.icon ? (
                              <>
                                <div className="flex items-center justify-center h-full w-full">
                                  {renderIcon(key.icon)}
                                </div>
                                {key.label && <span className="leading-none mt-[-2px]">{key.label}</span>}
                              </>
                            ) : key.subLabel ? (
                              <>
                                <span className="leading-none">{key.subLabel}</span>
                                <span className="leading-none">{key.label}</span>
                              </>
                            ) : (
                              <div className="flex items-center justify-center flex-1 w-full">
                                <span className="leading-none">{key.label}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Corner diagonals for the mechanical keycap base */}
                          <div className="absolute z-0 bottom-0 right-0 h-px w-8 rotate-70 translate-x-3.5 bg-black/30 transition-all duration-100"></div>
                          <div className="absolute z-0 bottom-0 left-0 h-px w-8 -rotate-70 -translate-x-3.5 bg-black/30 transition-all duration-100"></div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

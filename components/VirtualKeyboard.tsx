'use client';

import React, { useEffect, useState } from 'react';
import { useKeyboardSettings } from '@/context/KeyboardSettingsContext';

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

const KEY_DOWN_SOUNDS: Record<string, [number, number]> = {
  Escape: [9069, 115],
  F1: [2754, 104],
  F2: [3155, 99],
  F3: [3545, 103],
  F4: [3913, 100],
  F5: [4305, 96],
  F6: [4666, 103],
  F7: [5034, 110],
  F8: [5433, 103],
  F9: [7795, 109],
  F10: [6146, 105],
  F11: [7322, 97],
  F12: [7699, 98],
  F13: [2754, 104],
  Delete: [14199, 100],
  F14: [3155, 99],
  Backquote: [9069, 115],
  Digit1: [2280, 109],
  Digit2: [9444, 102],
  Digit3: [9833, 103],
  Digit4: [10185, 107],
  Digit5: [10551, 108],
  Digit6: [10899, 107],
  Digit7: [11282, 99],
  Digit8: [11623, 103],
  Digit9: [11976, 110],
  Digit0: [12337, 108],
  Minus: [12667, 107],
  Equal: [13058, 105],
  Backspace: [13765, 101],
  PageUp: [14522, 108],
  Tab: [15916, 97],
  KeyQ: [16284, 83],
  KeyW: [16637, 97],
  KeyE: [16964, 105],
  KeyR: [17275, 102],
  KeyT: [17613, 108],
  KeyY: [17957, 95],
  KeyU: [18301, 105],
  KeyI: [18643, 110],
  KeyO: [18994, 98],
  KeyP: [19331, 108],
  BracketLeft: [19671, 94],
  BracketRight: [20020, 96],
  Backslash: [20387, 97],
  PageDown: [14852, 93],
  CapsLock: [22560, 100],
  KeyA: [22869, 109],
  KeyS: [23237, 98],
  KeyD: [23586, 103],
  KeyF: [23898, 98],
  KeyG: [24237, 102],
  KeyH: [24550, 106],
  KeyJ: [24917, 103],
  KeyK: [25274, 102],
  KeyL: [25625, 101],
  Semicolon: [25989, 100],
  Quote: [26335, 99],
  Enter: [26703, 100],
  Home: [20766, 102],
  ShiftLeft: [28109, 99],
  KeyZ: [28550, 92],
  KeyX: [28855, 101],
  KeyC: [29557, 112],
  KeyV: [29557, 112],
  KeyB: [29909, 98],
  KeyN: [30252, 112],
  KeyM: [30605, 101],
  Comma: [30965, 117],
  Period: [31315, 97],
  Slash: [31659, 96],
  ShiftRight: [28109, 99],
  ArrowUp: [32429, 96],
  End: [21409, 83],
  ControlLeft: [8036, 92],
  AltLeft: [34551, 96],
  MetaLeft: [34551, 96],
  Space: [33857, 100],
  MetaRight: [34181, 97],
  Fn: [8036, 92],
  ControlRight: [8036, 92],
  ArrowLeft: [36907, 90],
  ArrowDown: [37267, 94],
  ArrowRight: [37586, 88],
  AltRight: [35878, 90],
};

const KEY_UP_SOUNDS: Record<string, [number, number]> = {
  Escape: [9184, 94],
  F1: [2858, 85],
  F2: [3254, 81],
  F3: [3648, 84],
  F4: [4013, 83],
  F5: [4401, 78],
  F6: [4769, 84],
  F7: [5144, 90],
  F8: [5536, 84],
  F9: [7904, 89],
  F10: [6251, 86],
  F11: [7419, 80],
  F12: [7797, 80],
  F13: [2858, 85],
  Delete: [14299, 81],
  F14: [3254, 81],
  Backquote: [9184, 94],
  Digit1: [2389, 90],
  Digit2: [9546, 83],
  Digit3: [9936, 84],
  Digit4: [10292, 87],
  Digit5: [10659, 88],
  Digit6: [11006, 87],
  Digit7: [11381, 81],
  Digit8: [11726, 85],
  Digit9: [12086, 90],
  Digit0: [12445, 89],
  Minus: [12774, 87],
  Equal: [13163, 86],
  Backspace: [13866, 83],
  PageUp: [14630, 88],
  Tab: [16013, 79],
  KeyQ: [16367, 67],
  KeyW: [16734, 79],
  KeyE: [17069, 85],
  KeyR: [17377, 83],
  KeyT: [17721, 88],
  KeyY: [18052, 78],
  KeyU: [18406, 85],
  KeyI: [18753, 90],
  KeyO: [19092, 80],
  KeyP: [19439, 89],
  BracketLeft: [19765, 77],
  BracketRight: [20116, 79],
  Backslash: [20484, 79],
  PageDown: [14945, 76],
  CapsLock: [22660, 81],
  KeyA: [22978, 89],
  KeyS: [23335, 80],
  KeyD: [23689, 84],
  KeyF: [23996, 81],
  KeyG: [24339, 83],
  KeyH: [24656, 86],
  KeyJ: [25020, 85],
  KeyK: [25376, 83],
  KeyL: [25726, 82],
  Semicolon: [26089, 82],
  Quote: [26434, 81],
  Enter: [26803, 81],
  Home: [20868, 83],
  ShiftLeft: [28208, 81],
  KeyZ: [28642, 75],
  KeyX: [28956, 83],
  KeyC: [29669, 92],
  KeyV: [29669, 92],
  KeyB: [30007, 81],
  KeyN: [30364, 91],
  KeyM: [30706, 83],
  Comma: [31082, 95],
  Period: [31412, 79],
  Slash: [31755, 79],
  ShiftRight: [28208, 81],
  ArrowUp: [32525, 78],
  End: [21492, 68],
  ControlLeft: [8128, 76],
  AltLeft: [34647, 79],
  MetaLeft: [34647, 79],
  Space: [33957, 82],
  MetaRight: [34278, 80],
  Fn: [8128, 76],
  ControlRight: [8128, 76],
  ArrowLeft: [36997, 73],
  ArrowDown: [37361, 76],
  ArrowRight: [37674, 72],
  AltRight: [35968, 74],
};

let audioBuffer: AudioBuffer | null = null;
let audioCtx: AudioContext | null = null;

const initAudio = async () => {
  if (typeof window === 'undefined' || audioBuffer) return;
  try {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
    if (!audioCtx) return;
    const response = await fetch('/sound.ogg');
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  } catch (err) {
    console.error('Failed to load/decode audio:', err);
  }
};

const triggerHaptic = () => {
  if (typeof window !== 'undefined' && navigator.vibrate) {
    try {
      const saved = localStorage.getItem('keyboard-settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.enableHaptics === false) {
          return;
        }
      }
      navigator.vibrate(15);
    } catch {}
  }
};

export const playSound = (code: string, type: 'down' | 'up') => {
  if (typeof window === 'undefined') return;
  
  try {
    const saved = localStorage.getItem('keyboard-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.enableSound === false) {
        return;
      }
    }
  } catch {}

  if (type === 'down') {
    triggerHaptic();
  }

  if (!audioCtx || !audioBuffer) {
    initAudio();
    return;
  }
  
  const map = type === 'down' ? KEY_DOWN_SOUNDS : KEY_UP_SOUNDS;
  const audioInfo = map[code];
  if (!audioInfo) return;
  
  const [startMs, durationMs] = audioInfo;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.65; // comfortable keystroke volume
  
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  source.start(0, startMs / 1000, durationMs / 1000);
};

export const playErrorSound = () => {
  if (typeof window === 'undefined') return;
  
  try {
    const saved = localStorage.getItem('keyboard-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.enableSound === false) {
        return;
      }
    }
  } catch {}

  triggerHaptic();

  try {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    const ctx = audioCtx || (AudioContextClass ? new AudioContextClass() : null);
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch (err) {
    console.error('Audio API error:', err);
  }
};

const isTypingKey = (code: string): boolean => {
  return (
    code.startsWith('Key') ||
    code.startsWith('Digit') ||
    [
      'Space',
      'Backspace',
      'Semicolon',
      'Quote',
      'Comma',
      'Period',
      'Slash',
      'Minus',
      'Equal',
      'BracketLeft',
      'BracketRight',
      'Backslash',
      'Backquote',
    ].includes(code)
  );
};

const themeChassisMap = {
  Classic: { wrapper: 'bg-black/70 border-black', inner: 'bg-black/80 border-black' },
  Mint: { wrapper: 'bg-[#0e211e]/70 border-[#183934]', inner: 'bg-[#132c28]/80 border-[#183934]' },
  Royal: { wrapper: 'bg-[#0a0f1d]/70 border-[#1e293b]', inner: 'bg-[#0f172a]/80 border-[#1e293b]' },
  Dolch: { wrapper: 'bg-[#1c1c1c]/70 border-[#333333]', inner: 'bg-[#242424]/80 border-[#333333]' },
  Sand: { wrapper: 'bg-[#1f1a14]/70 border-[#3e3427]', inner: 'bg-[#2a241c]/80 border-[#3e3427]' },
  Scarlet: { wrapper: 'bg-[#1e0a0a]/70 border-[#3d1414]', inner: 'bg-[#2c0f0f]/80 border-[#3d1414]' },
};

const themeKeysMap = {
  Classic: {
    light: { base: 'rgba(245, 245, 245, 0.8)', inner: 'rgb(245, 245, 245)', text: 'rgba(0, 0, 0, 0.7)' },
    orange: { base: 'rgba(245, 118, 68, 0.8)', inner: 'rgb(245, 118, 68)', text: 'rgba(0, 0, 0, 0.5)' },
    dark: { base: 'rgba(115, 115, 115, 0.8)', inner: 'rgb(115, 115, 115)', text: 'rgba(255, 255, 255, 0.7)' },
    pressed: { base: 'rgba(245, 158, 11, 0.6)', inner: 'rgb(245, 158, 11)', text: 'rgba(0, 0, 0, 0.9)', border: 'border-amber-600/50' }
  },
  Mint: {
    light: { base: 'rgba(209, 250, 229, 0.8)', inner: 'rgb(209, 250, 229)', text: 'rgba(6, 78, 59, 0.8)' },
    orange: { base: 'rgba(52, 211, 153, 0.8)', inner: 'rgb(52, 211, 153)', text: 'rgba(6, 78, 59, 0.7)' },
    dark: { base: 'rgba(75, 85, 99, 0.8)', inner: 'rgb(75, 85, 99)', text: 'rgba(209, 250, 229, 0.8)' },
    pressed: { base: 'rgba(5, 150, 105, 0.6)', inner: 'rgb(5, 150, 105)', text: 'rgba(255, 255, 255, 0.9)', border: 'border-emerald-600/50' }
  },
  Royal: {
    light: { base: 'rgba(219, 234, 254, 0.8)', inner: 'rgb(219, 234, 254)', text: 'rgba(30, 58, 138, 0.8)' },
    orange: { base: 'rgba(59, 130, 246, 0.8)', inner: 'rgb(59, 130, 246)', text: 'rgba(255, 255, 255, 0.8)' },
    dark: { base: 'rgba(71, 85, 105, 0.8)', inner: 'rgb(71, 85, 105)', text: 'rgba(219, 234, 254, 0.8)' },
    pressed: { base: 'rgba(245, 158, 11, 0.6)', inner: 'rgb(245, 158, 11)', text: 'rgba(0, 0, 0, 0.9)', border: 'border-amber-600/50' }
  },
  Dolch: {
    light: { base: 'rgba(156, 163, 175, 0.8)', inner: 'rgb(156, 163, 175)', text: 'rgba(17, 24, 39, 0.8)' },
    orange: { base: 'rgba(6, 182, 212, 0.8)', inner: 'rgb(6, 182, 212)', text: 'rgba(17, 24, 39, 0.8)' },
    dark: { base: 'rgba(75, 85, 99, 0.8)', inner: 'rgb(75, 85, 99)', text: 'rgba(243, 244, 246, 0.8)' },
    pressed: { base: 'rgba(14, 165, 233, 0.6)', inner: 'rgb(14, 165, 233)', text: 'rgba(255, 255, 255, 0.9)', border: 'border-cyan-600/50' }
  },
  Sand: {
    light: { base: 'rgba(245, 245, 220, 0.8)', inner: 'rgb(245, 245, 220)', text: 'rgba(67, 56, 42, 0.8)' },
    orange: { base: 'rgba(168, 85, 24, 0.8)', inner: 'rgb(168, 85, 24)', text: 'rgba(255, 255, 255, 0.8)' },
    dark: { base: 'rgba(120, 113, 108, 0.8)', inner: 'rgb(120, 113, 108)', text: 'rgba(245, 245, 220, 0.8)' },
    pressed: { base: 'rgba(220, 38, 38, 0.6)', inner: 'rgb(220, 38, 38)', text: 'rgba(255, 255, 255, 0.9)', border: 'border-red-600/50' }
  },
  Scarlet: {
    light: { base: 'rgba(255, 228, 230, 0.8)', inner: 'rgb(255, 228, 230)', text: 'rgba(136, 19, 55, 0.8)' },
    orange: { base: 'rgba(239, 68, 68, 0.8)', inner: 'rgb(239, 68, 68)', text: 'rgba(255, 255, 255, 0.8)' },
    dark: { base: 'rgba(159, 18, 57, 0.8)', inner: 'rgb(159, 18, 57)', text: 'rgba(255, 228, 230, 0.8)' },
    pressed: { base: 'rgba(245, 158, 11, 0.6)', inner: 'rgb(245, 158, 11)', text: 'rgba(0, 0, 0, 0.9)', border: 'border-amber-600/50' }
  }
};

export default function VirtualKeyboard() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const { settings } = useKeyboardSettings();

  useEffect(() => {
    initAudio();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      let code = e.code;
      if (code === 'NumpadEnter') code = 'Enter';
      
      if (!isTypingKey(code)) {
        playSound(code, 'down');
      }
      
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.add(code);
        return next;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      let code = e.code;
      if (code === 'NumpadEnter') code = 'Enter';
      
      playSound(code, 'up');
      
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });
    };

    const handleBlur = () => {
      setPressedKeys(new Set());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  if (!settings.displayKeyboard) return null;

  const chassis = themeChassisMap[settings.theme] || themeChassisMap.Classic;
  const keyTheme = themeKeysMap[settings.theme] || themeKeysMap.Classic;

  return (
    <div className="w-full overflow-x-auto flex justify-center py-6 select-none no-scrollbar">
      {/* Keyboard wrapper scaling for responsive widths */}
      <div className="scale-[0.6] origin-top sm:scale-[0.8] md:scale-95 lg:scale-100 my-[-55px] sm:my-[-25px] md:my-[-5px] lg:my-0 transition-transform duration-300">
        <div className={`p-3 rounded-[16px] w-fit h-fit shadow-2xl border-2 transition-all duration-500 ease-in-out ${chassis.wrapper}`}>
          <div className={`rounded-[5px] rounded-t-[8px] h-[278px] overflow-hidden border transition-all duration-500 ease-in-out ${chassis.inner}`}>
            <div className="-space-y-1 -translate-y-1 rounded-[5px] overflow-hidden">
              {allRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((key) => {
                    const isPressed = pressedKeys.has(key.code);
                    const innerWidth = key.width - 13;

                    // Compute styles based on key type and pressed state
                    let baseBg = keyTheme.light.base;
                    let innerBg = keyTheme.light.inner;
                    let textColor = keyTheme.light.text;
                    let borderInner = 'border-black/40';

                    if (key.type === 'orange') {
                      baseBg = keyTheme.orange.base;
                      innerBg = keyTheme.orange.inner;
                      textColor = keyTheme.orange.text;
                    } else if (key.type === 'dark') {
                      baseBg = keyTheme.dark.base;
                      innerBg = keyTheme.dark.inner;
                      textColor = keyTheme.dark.text;
                    }

                    // Apply pressed styles
                    if (isPressed) {
                      baseBg = keyTheme.pressed.base;
                      innerBg = keyTheme.pressed.inner;
                      textColor = keyTheme.pressed.text;
                      borderInner = keyTheme.pressed.border;
                    }

                    return (
                      <button
                        key={key.code}
                        type="button"
                        aria-label={key.label || key.code}
                        className="flex items-end cursor-pointer touch-none appearance-none border-0 bg-transparent p-0 text-left focus:outline-none"
                        style={{ height: '50px', width: `${key.width}px` }}
                        onPointerDown={(e) => {
                          e.preventDefault();
                          playSound(key.code, 'down');
                          setPressedKeys((prev) => {
                            const next = new Set(prev);
                            next.add(key.code);
                            return next;
                          });
                        }}
                        onPointerUp={(e) => {
                          e.preventDefault();
                          if (pressedKeys.has(key.code)) {
                            playSound(key.code, 'up');
                          }
                          setPressedKeys((prev) => {
                            const next = new Set(prev);
                            next.delete(key.code);
                            return next;
                          });
                        }}
                        onPointerLeave={(e) => {
                          e.preventDefault();
                          if (pressedKeys.has(key.code)) {
                            playSound(key.code, 'up');
                          }
                          setPressedKeys((prev) => {
                            const next = new Set(prev);
                            next.delete(key.code);
                            return next;
                          });
                        }}
                      >
                        <div
                          className="relative overflow-hidden h-[50px] rounded-[4px] rounded-t-[12px] border border-black/40 flex items-start justify-center"
                          style={{
                            width: `${key.width}px`,
                            backgroundColor: baseBg,
                            transition: 'background-color 500ms ease-in-out, border-color 500ms ease-in-out',
                          }}
                        >
                          <div
                            className={`relative z-10 h-[37px] rounded-[6px] border border-t-0 ${borderInner} text-[9px] font-semibold flex flex-col items-center justify-between p-1 select-none`}
                            style={{
                              width: `${innerWidth}px`,
                              backgroundColor: innerBg,
                              color: textColor,
                              transform: isPressed ? 'translateY(5px)' : 'translateY(0px)',
                              transition: 'background-color 500ms ease-in-out, color 500ms ease-in-out, border-color 500ms ease-in-out, transform 75ms ease-out',
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

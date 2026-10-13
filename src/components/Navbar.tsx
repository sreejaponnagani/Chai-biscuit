import React from 'react';
import { GameMode } from '../types/game';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface Props {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  coins: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentMode,
  onSelectMode,
  coins,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-amber-900/30 bg-[#160f0a]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => onSelectMode('MENU')}
        className="text-lg font-black tracking-tight text-amber-200 hover:text-amber-100 whitespace-nowrap shrink-0 flex items-center gap-2 transition-colors cursor-pointer"
      >
        <span className="text-xl">🫖</span>
        <span>Chai &amp; Osmania</span>
      </button>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-amber-200/70">
        <button
          onClick={() => onSelectMode('BISCUIT_ARCADE')}
          className={`hover:text-amber-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentMode === 'BISCUIT_ARCADE' ? 'text-amber-300 underline underline-offset-4' : ''
          }`}
        >
          Biscuit Catcher
        </button>

        <button
          onClick={() => onSelectMode('CHAI_RUSH')}
          className={`hover:text-amber-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentMode === 'CHAI_RUSH' ? 'text-amber-300 underline underline-offset-4' : ''
          }`}
        >
          Chai Rush
        </button>

        <button
          onClick={() => onSelectMode('UPGRADES')}
          className={`hover:text-amber-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentMode === 'UPGRADES' ? 'text-amber-300 underline underline-offset-4' : ''
          }`}
        >
          Bazaar Upgrades
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-600/30 text-xs font-bold text-yellow-300">
          <span>{coins}</span>
          <span>🪙</span>
        </div>

        <button
          onClick={onToggleSound}
          className="p-2 text-amber-200/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={() => onSelectMode('BISCUIT_ARCADE')}
          className="px-4 py-2 text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg transition-all shadow-md shadow-amber-500/20 whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
        >
          Play Arcade
        </button>
      </div>
    </header>
  );
};

import React from 'react';
import { DifficultyMode } from '../types/game';
import { DIFFICULTY_CONFIGS } from '../data/modesAndEvents';
import { sound } from '../utils/audio';

interface Props {
  selectedMode: DifficultyMode;
  onSelectMode: (mode: DifficultyMode) => void;
}

export const ModeSelector: React.FC<Props> = ({ selectedMode, onSelectMode }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8 p-4 rounded-2xl bg-[#1d120a]/80 border border-amber-900/40 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-black uppercase tracking-wider text-amber-400">
          Select Player Mode
        </span>
        <span className="text-xs text-amber-200/60 font-medium">
          Choose your speed, rules &amp; challenge
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {DIFFICULTY_CONFIGS.map((cfg) => {
          const isSelected = selectedMode === cfg.id;

          return (
            <button
              key={cfg.id}
              onClick={() => {
                sound.playCrunch();
                onSelectMode(cfg.id);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-950/90 border-amber-400 ring-1 ring-amber-400/80 shadow-lg shadow-amber-950'
                  : 'bg-black/30 border-white/5 hover:border-amber-700/60 hover:bg-black/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-white">
                    {cfg.badge}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-amber-200 mb-1 leading-snug">
                  {cfg.name}
                </h4>
                <p className="text-[11px] text-white/50 leading-tight mb-2">
                  {cfg.description}
                </p>
              </div>

              <div className="text-[10px] font-bold text-amber-400/90 pt-1 border-t border-white/5">
                {cfg.pointsMultiplier}x Points Multiplier
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

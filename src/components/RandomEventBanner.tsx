import React from 'react';
import { ActiveRandomEvent } from '../types/game';

interface Props {
  activeEvent: ActiveRandomEvent | null;
}

export const RandomEventBanner: React.FC<Props> = ({ activeEvent }) => {
  if (!activeEvent) return null;

  const pct = Math.max(0, (activeEvent.timeLeft / activeEvent.duration) * 100);

  return (
    <>
      {/* Top Floating Event Card */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md pointer-events-none animate-bounce duration-500">
        <div
          className={`px-4 py-2.5 rounded-xl border backdrop-blur-md shadow-2xl flex items-center justify-between gap-3 ${activeEvent.colorScheme.bg} ${activeEvent.colorScheme.border}`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-2xl p-1.5 rounded-lg bg-black/40 border border-white/10 shrink-0">
              {activeEvent.icon}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wide text-white truncate">
                  {activeEvent.hyderabadiTitle}
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/50 text-amber-300">
                  {activeEvent.timeLeft}s
                </span>
              </div>
              <p className="text-[11px] text-amber-100/80 truncate">
                {activeEvent.description}
              </p>
            </div>
          </div>

          {/* Progress Bar Circle / Indicator */}
          <div className="w-12 h-2 rounded-full bg-black/60 overflow-hidden shrink-0 border border-white/10">
            <div
              className="h-full bg-amber-400 transition-all duration-300 rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visual Overlay Effects based on event */}
      {activeEvent.type === 'POWER_CUT' && (
        <div className="absolute inset-0 pointer-events-none z-30 bg-black/65 transition-opacity duration-700 flex items-center justify-center">
          {/* Subtle central lantern glow */}
          <div className="w-96 h-96 rounded-full bg-amber-500/15 blur-3xl animate-pulse pointer-events-none" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-xs font-bold text-amber-300/80 tracking-widest uppercase bg-black/80 px-3 py-1 rounded-full border border-amber-500/30">
            🏮 Laaltain Mode · +50% Bravery Bonus
          </div>
        </div>
      )}

      {activeEvent.type === 'TRAFFIC_JAM' && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-orange-500/60 z-30 animate-pulse pointer-events-none" />
      )}

      {activeEvent.type === 'BISCUIT_BAARISH' && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-400/80 z-30 animate-pulse pointer-events-none shadow-lg shadow-amber-500/50" />
      )}
    </>
  );
};

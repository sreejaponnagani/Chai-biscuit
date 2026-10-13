import React, { useState } from 'react';
import { GameMode, PlayerStats, DifficultyMode } from '../types/game';
import { LANDMARKS } from '../data/landmarks';
import { ModeSelector } from './ModeSelector';
import { sound } from '../utils/audio';
import { Play, ShoppingBag, MapPin, RefreshCw, Flame, Sparkles } from 'lucide-react';

interface Props {
  stats: PlayerStats;
  onSelectMode: (mode: GameMode) => void;
  onSelectDifficulty: (diff: DifficultyMode) => void;
}

const DAILY_HYDERABADI_SAYINGS = [
  "Ustaad, chai thandi hori jaldi dalo, biryani ka time hogaya!",
  "Baigan me miladiya! Nimrah ke biscuit nahi khaye to kya Hyderabad dekhe?",
  "Light le lo miyan, subah subah Charminar pe garam chai aur do biscuit ka koi mukabla nahi!",
  "Kaiku tension lere ustaad? Ek cup kadak Irani chai piyo, saare dukh gayab!",
  "Arey miyan, Osmania biscuit ko chai me doobana ek art hai, girna nahi chahiye!",
  "Tank Bund pe thandi hawa aur hath me garma garam Irani cup... seedha sukoon!",
];

export const TitleMenu: React.FC<Props> = ({ stats, onSelectMode, onSelectDifficulty }) => {
  const [jokeIdx, setJokeIdx] = useState(0);

  const activeLandmark = LANDMARKS.find((l) => l.id === stats.activeLandmark) || LANDMARKS[0];

  const handleNextJoke = () => {
    sound.playCrunch();
    setJokeIdx((prev) => (prev + 1) % DAILY_HYDERABADI_SAYINGS.length);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col items-center select-none">
      {/* Hero Welcome Lockup */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
          <span className="text-sm">🫖</span>
          <span>Authentic Hyderabad Irani Chai &amp; Osmania Experience</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-amber-100 tracking-tight leading-[1.15] mb-3 text-balance">
          Kaiku Re Miyan!
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200">
            Chai &amp; Osmania Time!
          </span>
        </h1>

        <p className="text-xs md:text-sm text-amber-200/75 leading-relaxed">
          Catch falling Osmania biscuits or brew rapid-fire cups of Irani chai before the timer
          runs out. Watch out for random Old City street events every 35s!
        </p>

        {/* Ustaad's Fun Daily Dialogue Card */}
        <div className="mt-4 p-3.5 rounded-xl bg-black/40 border border-amber-600/30 max-w-lg mx-auto flex items-center gap-3 text-left shadow-lg">
          <div className="text-2xl p-2 rounded-lg bg-amber-500/20 shrink-0">
            👳‍♂️
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
              Ustaad Nimrah's Street Banter
            </span>
            <p className="text-xs text-amber-100 font-medium italic">
              "{DAILY_HYDERABADI_SAYINGS[jokeIdx]}"
            </p>
          </div>
          <button
            onClick={handleNextJoke}
            className="p-1.5 text-amber-300/70 hover:text-amber-200 bg-white/5 hover:bg-white/10 rounded-lg transition-colors shrink-0 cursor-pointer"
            title="Next Banter"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Player Mode Selector Strip */}
      <ModeSelector
        selectedMode={stats.selectedDifficulty}
        onSelectMode={onSelectDifficulty}
      />

      {/* Primary Game Mode Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-6">
        {/* Mode 1: Falling Biscuit Catcher Arcade */}
        <div className="relative group p-6 rounded-2xl bg-gradient-to-b from-[#2a170d] to-[#1a0e07] border border-amber-700/50 hover:border-amber-400/80 transition-all duration-300 shadow-xl flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl p-2.5 rounded-xl bg-black/40 border border-white/5 inline-block">
                🍪
              </span>
              <span className="text-xs font-mono font-bold text-amber-300 bg-black/40 px-2.5 py-1 rounded-md border border-white/5">
                Record: {stats.highScoreArcade} pts
              </span>
            </div>

            <h3 className="text-xl font-black text-amber-100 mb-1.5">
              Osmania Biscuit Catcher
            </h3>
            <p className="text-xs text-amber-200/70 mb-4 leading-relaxed">
              Fast-paced reflex action! Slide your Irani saucer to catch fresh falling biscuits.
              Experience events like Biscuit Baarish and Old City Power Cuts!
            </p>

            <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-amber-300/80 mb-5">
              <span className="bg-amber-950/60 px-2.5 py-1 rounded border border-amber-700/40">
                · Biscuit Baarish Events
              </span>
              <span className="bg-amber-950/60 px-2.5 py-1 rounded border border-amber-700/40">
                · Power Cut Lanterns
              </span>
              <span className="bg-amber-950/60 px-2.5 py-1 rounded border border-amber-700/40">
                · Funny Drop Roasts
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playCrunch();
              onSelectMode('BISCUIT_ARCADE');
            }}
            className="w-full py-3.5 px-6 rounded-xl font-black text-sm text-amber-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Play Biscuit Catcher</span>
          </button>
        </div>

        {/* Mode 2: Irani Chai Rush */}
        <div className="relative group p-6 rounded-2xl bg-gradient-to-b from-[#2a170d] to-[#1a0e07] border border-amber-700/50 hover:border-amber-400/80 transition-all duration-300 shadow-xl flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-orange-500/20 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl p-2.5 rounded-xl bg-black/40 border border-white/5 inline-block">
                🫖
              </span>
              <span className="text-xs font-mono font-bold text-amber-300 bg-black/40 px-2.5 py-1 rounded-md border border-white/5">
                Record: {stats.highScoreRush} pts
              </span>
            </div>

            <h3 className="text-xl font-black text-amber-100 mb-1.5">
              Continuous Chai Rush
            </h3>
            <p className="text-xs text-amber-200/70 mb-4 leading-relaxed">
              Speed brewing incremental challenge! Regulate your brass samovar flame, pour strong
              decoction, and serve customers during traffic jams and inspections!
            </p>

            <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-amber-300/80 mb-5">
              <span className="bg-amber-950/60 px-2.5 py-1 rounded border border-amber-700/40">
                · Samovar Heat Gauge
              </span>
              <span className="bg-amber-950/60 px-2.5 py-1 rounded border border-amber-700/40">
                · Traffic Jam 2x Tips
              </span>
              <span className="bg-amber-950/60 px-2.5 py-1 rounded border border-amber-700/40">
                · Royal Food Inspections
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playPour();
              onSelectMode('CHAI_RUSH');
            }}
            className="w-full py-3.5 px-6 rounded-xl font-black text-sm text-amber-950 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-300 hover:to-amber-300 shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Flame className="w-4 h-4 fill-current text-orange-950" />
            <span>Start Chai Rush Hour</span>
          </button>
        </div>
      </div>

      {/* Secondary Quick Links / Active Landmark Strip */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-black/40 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/50 block">
              Active Hyderabad Setting
            </span>
            <span className="text-xs font-bold text-amber-200">
              {activeLandmark.name}
            </span>
          </div>
        </div>

        <button
          onClick={() => onSelectMode('UPGRADES')}
          className="px-4 py-2 text-xs font-bold text-amber-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
          <span>Open Bazaar &amp; Landmarks Shop</span>
        </button>
      </div>
    </div>
  );
};

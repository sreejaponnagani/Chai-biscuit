import React from 'react';
import { PlayerStats, ShopUpgrade, LandmarkId } from '../types/game';
import { LANDMARKS, INITIAL_UPGRADES } from '../data/landmarks';
import { sound } from '../utils/audio';
import { Flame, Cookie, UserCheck, Sparkles, Maximize2, MapPin, Check, Lock, ArrowLeft, Trophy } from 'lucide-react';

interface Props {
  stats: PlayerStats;
  onBuyUpgrade: (upgradeId: string, cost: number) => void;
  onUnlockLandmark: (landmarkId: LandmarkId, cost: number) => void;
  onSelectLandmark: (landmarkId: LandmarkId) => void;
  onBackToMenu: () => void;
}

export const UpgradesShop: React.FC<Props> = ({
  stats,
  onBuyUpgrade,
  onUnlockLandmark,
  onSelectLandmark,
  onBackToMenu,
}) => {
  const getUpgradeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Cookie':
        return <Cookie className="w-5 h-5 text-amber-400" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-cyan-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-yellow-300" />;
      case 'Maximize2':
        return <Maximize2 className="w-5 h-5 text-emerald-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  const getUpgradeCost = (upgrade: ShopUpgrade) => {
    const currentLevel = stats.upgrades[upgrade.id] || 0;
    return Math.round(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
  };

  const handlePurchase = (upgrade: ShopUpgrade) => {
    const cost = getUpgradeCost(upgrade);
    const currentLevel = stats.upgrades[upgrade.id] || 0;
    if (stats.coins >= cost && currentLevel < upgrade.maxLevel) {
      sound.playChime(1.5);
      onBuyUpgrade(upgrade.id, cost);
    } else {
      sound.playErrorBuzzer();
    }
  };

  const handleLandmarkAction = (landmark: typeof LANDMARKS[0]) => {
    const isUnlocked = stats.unlockedLandmarks.includes(landmark.id);
    if (isUnlocked) {
      sound.playChime(1.1);
      onSelectLandmark(landmark.id);
    } else if (stats.coins >= landmark.cost) {
      sound.playFanfare();
      onUnlockLandmark(landmark.id, landmark.cost);
    } else {
      sound.playErrorBuzzer();
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-amber-900/40 bg-black/60 shadow-2xl backdrop-blur-md p-6 select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-200/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Menu</span>
          </button>
          <div>
            <h2 className="text-xl font-black text-amber-100 leading-tight">
              Nimrah Bazaar &amp; Royal Upgrades
            </h2>
            <p className="text-xs text-amber-300/70">
              Spend your Chai Paisa to boost brewing speeds, catch sizes, and visit historic spots.
            </p>
          </div>
        </div>

        {/* Current Coins Wallet */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-950/60 border border-amber-500/40 shadow-inner">
          <span className="text-xl">🪙</span>
          <div>
            <span className="text-[10px] text-amber-300/80 uppercase font-bold block">
              Chai Paisa Balance
            </span>
            <span className="font-mono text-xl font-black text-yellow-300 tabular-nums leading-none">
              {stats.coins}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Upgrades List & Hyderabad Landmark Tours */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Equipment & Bakery Upgrades (7 cols) */}
        <div className="lg:col-span-7 space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-2">
            <span>Cafe &amp; Bakery Enhancements</span>
          </h3>

          <div className="space-y-3">
            {INITIAL_UPGRADES.map((upgrade) => {
              const currentLevel = stats.upgrades[upgrade.id] || 0;
              const cost = getUpgradeCost(upgrade);
              const isMaxed = currentLevel >= upgrade.maxLevel;
              const canAfford = stats.coins >= cost && !isMaxed;

              return (
                <div
                  key={upgrade.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#23150b]/80 border border-amber-800/40 hover:border-amber-600/60 transition-all shadow-md"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 shrink-0">
                      {getUpgradeIcon(upgrade.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-amber-100">
                          {upgrade.name}
                        </h4>
                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/30">
                          Lv. {currentLevel}/{upgrade.maxLevel}
                        </span>
                      </div>
                      <p className="text-xs text-amber-200/60 mb-1">
                        {upgrade.description}
                      </p>
                      <span className="text-[11px] font-semibold text-emerald-400">
                        {upgrade.effect}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchase(upgrade)}
                    disabled={!canAfford || isMaxed}
                    className={`ml-4 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                      isMaxed
                        ? 'bg-white/10 text-white/40 cursor-default'
                        : canAfford
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 shadow-md shadow-amber-500/20 active:scale-95'
                        : 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed'
                    }`}
                  >
                    {isMaxed ? (
                      'MAX'
                    ) : (
                      <span className="flex items-center gap-1">
                        <span>{cost}</span>
                        <span>🪙</span>
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Hyderabad Landmark Tours (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Hyderabad Landmarks (Select Active Spot)</span>
          </h3>

          <div className="space-y-3">
            {LANDMARKS.map((landmark) => {
              const isUnlocked = stats.unlockedLandmarks.includes(landmark.id);
              const isActive = stats.activeLandmark === landmark.id;
              const canAfford = stats.coins >= landmark.cost;

              return (
                <div
                  key={landmark.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-amber-950/80 border-amber-400 ring-1 ring-amber-400 shadow-lg'
                      : isUnlocked
                      ? 'bg-[#1b120c]/80 border-amber-900/40 hover:border-amber-700/60'
                      : 'bg-black/40 border-white/5 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div>
                      <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                        {landmark.name}
                        {isActive && (
                          <span className="text-[10px] bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded font-black uppercase">
                            Active
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-amber-300/70">{landmark.subtitle}</p>
                    </div>

                    <button
                      onClick={() => handleLandmarkAction(landmark)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                        isActive
                          ? 'bg-amber-400/20 text-amber-300 cursor-default'
                          : isUnlocked
                          ? 'bg-white/10 hover:bg-white/20 text-white'
                          : canAfford
                          ? 'bg-yellow-400 hover:bg-yellow-300 text-amber-950 font-black shadow-md'
                          : 'bg-white/5 text-white/30 cursor-not-allowed'
                      }`}
                    >
                      {isActive ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : isUnlocked ? (
                        'Select'
                      ) : (
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>{landmark.cost} 🪙</span>
                        </span>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-white/50 mb-2 leading-relaxed">
                    {landmark.description}
                  </p>

                  <div className="text-[10px] font-bold text-cyan-300 bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-800/40 inline-block">
                    Spot Perk: {landmark.bonusText}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lifetime Cafe Achievements / Stats */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 mt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-2.5 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Career Record</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-white/5">
                <span className="text-[10px] text-white/40 block">Biscuits Caught</span>
                <span className="font-mono font-bold text-amber-300">
                  {stats.totalBiscuitsCaught}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <span className="text-[10px] text-white/40 block">Cups Brewed</span>
                <span className="font-mono font-bold text-amber-300">
                  {stats.totalChaiBrewed}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <span className="text-[10px] text-white/40 block">Best Catch Score</span>
                <span className="font-mono font-bold text-emerald-400">
                  {stats.highScoreArcade}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <span className="text-[10px] text-white/40 block">Best Chai Rush</span>
                <span className="font-mono font-bold text-emerald-400">
                  {stats.highScoreRush}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

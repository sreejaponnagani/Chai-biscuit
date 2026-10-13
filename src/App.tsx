import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, PlayerStats, LandmarkId, BanterMessage, DifficultyMode } from './types/game';
import { sound } from './utils/audio';
import { BanterQuote } from './data/banter';
import { Navbar } from './components/Navbar';
import { LandmarkBackground } from './components/LandmarkBackground';
import { TitleMenu } from './components/TitleMenu';
import { BiscuitArcade } from './components/BiscuitArcade';
import { ChaiRush } from './components/ChaiRush';
import { UpgradesShop } from './components/UpgradesShop';
import { HumorousToast } from './components/HumorousToast';

const STORAGE_KEY = 'chai_osmania_save_v1';

const DEFAULT_STATS: PlayerStats = {
  coins: 50,
  highScoreArcade: 0,
  highScoreRush: 0,
  totalBiscuitsCaught: 0,
  totalChaiBrewed: 0,
  roastsReceivedCount: 0,
  combosAchieved: 0,
  unlockedLandmarks: ['charminar'],
  activeLandmark: 'charminar',
  selectedDifficulty: 'STANDARD',
  soundEnabled: true,
  upgrades: {
    brass_samovar: 1,
    nimrah_oven: 1,
    chotu_assistant: 0,
    zafran_blend: 0,
    saucer_width: 1,
  },
};

export default function App() {
  const [stats, setStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_STATS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_STATS;
  });

  const [currentMode, setCurrentMode] = useState<GameMode>('MENU');
  const [currentToast, setCurrentToast] = useState<BanterMessage | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [stats]);

  // Sync sound settings with SoundManager
  useEffect(() => {
    sound.enabled = stats.soundEnabled;
  }, [stats.soundEnabled]);

  // Chotu Assistant Idle Coin Generator
  useEffect(() => {
    const chotuLevel = stats.upgrades['chotu_assistant'] || 0;
    if (chotuLevel <= 0) return;

    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        coins: prev.coins + chotuLevel * 2,
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, [stats.upgrades]);

  // Trigger Banter Modal Toast
  const handleTriggerBanter = useCallback((quote: BanterQuote, tagline: string) => {
    setStats((prev) => ({
      ...prev,
      roastsReceivedCount: prev.roastsReceivedCount + 1,
    }));
    setCurrentToast({
      id: Date.now(),
      speaker: quote.speaker,
      tagline,
      message: quote.text,
      mood: quote.mood,
      timestamp: Date.now(),
    });
  }, []);

  const handleDismissToast = () => {
    setCurrentToast(null);
  };

  // Coins update
  const handleUpdateCoins = (amount: number) => {
    setStats((prev) => ({
      ...prev,
      coins: prev.coins + amount,
    }));
  };

  // Arcade Score Record
  const handleRecordArcadeScore = (score: number, biscuitsCaught: number) => {
    setStats((prev) => ({
      ...prev,
      highScoreArcade: Math.max(prev.highScoreArcade, score),
      totalBiscuitsCaught: prev.totalBiscuitsCaught + biscuitsCaught,
    }));
  };

  // Chai Rush Score Record
  const handleRecordRushScore = (score: number, cupsBrewed: number) => {
    setStats((prev) => ({
      ...prev,
      highScoreRush: Math.max(prev.highScoreRush, score),
      totalChaiBrewed: prev.totalChaiBrewed + cupsBrewed,
    }));
  };

  // Buy Shop Upgrade
  const handleBuyUpgrade = (upgradeId: string, cost: number) => {
    setStats((prev) => ({
      ...prev,
      coins: Math.max(0, prev.coins - cost),
      upgrades: {
        ...prev.upgrades,
        [upgradeId]: (prev.upgrades[upgradeId] || 0) + 1,
      },
    }));
  };

  // Unlock Landmark
  const handleUnlockLandmark = (landmarkId: LandmarkId, cost: number) => {
    setStats((prev) => ({
      ...prev,
      coins: Math.max(0, prev.coins - cost),
      unlockedLandmarks: [...prev.unlockedLandmarks, landmarkId],
      activeLandmark: landmarkId,
    }));
  };

  // Select Landmark
  const handleSelectLandmark = (landmarkId: LandmarkId) => {
    setStats((prev) => ({
      ...prev,
      activeLandmark: landmarkId,
    }));
  };

  // Select Difficulty Mode
  const handleSelectDifficulty = (mode: DifficultyMode) => {
    setStats((prev) => ({
      ...prev,
      selectedDifficulty: mode,
    }));
  };

  // Toggle Sound
  const handleToggleSound = () => {
    setStats((prev) => {
      const nextSound = !prev.soundEnabled;
      sound.enabled = nextSound;
      return { ...prev, soundEnabled: nextSound };
    });
  };

  return (
    <div className="min-h-screen bg-[#140b06] text-amber-50 flex flex-col font-sans select-none antialiased">
      {/* Top Bar following Top Bar Contract */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={(mode) => {
          sound.playChime(1.1);
          setCurrentMode(mode);
        }}
        coins={stats.coins}
        soundEnabled={stats.soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Humorous Banter Toast Modal */}
      <HumorousToast toast={currentToast} onDismiss={handleDismissToast} />

      {/* Main Game Stage wrapped in Hyderabad Landmark Background */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-3 sm:p-6 overflow-hidden">
        <LandmarkBackground landmarkId={stats.activeLandmark}>
          {currentMode === 'MENU' && (
            <TitleMenu
              stats={stats}
              onSelectMode={(mode) => setCurrentMode(mode)}
              onSelectDifficulty={handleSelectDifficulty}
            />
          )}

          {currentMode === 'BISCUIT_ARCADE' && (
            <BiscuitArcade
              stats={stats}
              onUpdateCoins={handleUpdateCoins}
              onRecordScore={handleRecordArcadeScore}
              onTriggerBanter={handleTriggerBanter}
              onBackToMenu={() => setCurrentMode('MENU')}
            />
          )}

          {currentMode === 'CHAI_RUSH' && (
            <ChaiRush
              stats={stats}
              onUpdateCoins={handleUpdateCoins}
              onRecordScore={handleRecordRushScore}
              onTriggerBanter={handleTriggerBanter}
              onBackToMenu={() => setCurrentMode('MENU')}
            />
          )}

          {currentMode === 'UPGRADES' && (
            <UpgradesShop
              stats={stats}
              onBuyUpgrade={handleBuyUpgrade}
              onUnlockLandmark={handleUnlockLandmark}
              onSelectLandmark={handleSelectLandmark}
              onBackToMenu={() => setCurrentMode('MENU')}
            />
          )}
        </LandmarkBackground>
      </main>

      {/* Bottom Quiet Footer */}
      <footer className="py-3 px-6 text-center text-xs text-amber-400/40 border-t border-amber-950/40 bg-[#0f0703]">
        <span>Chai &amp; Osmania · Hyderabadi Street Arcade · Charminar &amp; Nimrah Cafe Vibes</span>
      </footer>
    </div>
  );
}

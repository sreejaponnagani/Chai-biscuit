import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { PlayerStats, ActiveRandomEvent, RandomEventType } from '../types/game';
import { DIFFICULTY_CONFIGS, RANDOM_EVENT_PRESETS } from '../data/modesAndEvents';
import { CUSTOMER_PROFILES, CHAI_MISTAKE_ROASTS, STREAK_PRAISE, BanterQuote } from '../data/banter';
import { RandomEventBanner } from './RandomEventBanner';
import { sound } from '../utils/audio';
import { Flame, Clock, Trophy, RotateCcw, Volume2, VolumeX, ArrowLeft, Sparkles, Heart, Infinity as InfinityIcon } from 'lucide-react';

interface Props {
  stats: PlayerStats;
  onUpdateCoins: (amount: number) => void;
  onRecordScore: (score: number, cupsBrewed: number) => void;
  onTriggerBanter: (quote: BanterQuote, tagline: string) => void;
  onBackToMenu: () => void;
}

interface CupState {
  decoction: number;
  milk: number;
  hasMalai: boolean;
}

export const ChaiRush: React.FC<Props> = ({
  stats,
  onUpdateCoins,
  onRecordScore,
  onTriggerBanter,
  onBackToMenu,
}) => {
  const diffConfig = DIFFICULTY_CONFIGS.find((d) => d.id === stats.selectedDifficulty) || DIFFICULTY_CONFIGS[0];

  // Game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [cupsBrewed, setCupsBrewed] = useState(0);
  const [lives, setLives] = useState(diffConfig.initialLives);
  const [timeLeft, setTimeLeft] = useState(diffConfig.timerSeconds + (stats.activeLandmark === 'hussain_sagar' ? 5 : 0));
  const [survivalSeconds, setSurvivalSeconds] = useState(0);
  const [streak, setStreak] = useState(0);
  const [soundOn, setSoundOn] = useState(stats.soundEnabled);

  // Samovar temperature (0 to 100)
  const [temp, setTemp] = useState(72);
  const [isOverboiling, setIsOverboiling] = useState(false);

  // Current active customer
  const [customerIdx, setCustomerIdx] = useState(0);
  const [patience, setPatience] = useState(100);

  // Current tea cup being brewed
  const [currentCup, setCurrentCup] = useState<CupState>({
    decoction: 0,
    milk: 0,
    hasMalai: false,
  });

  // Active Random Event state (triggers every 30-40s)
  const [activeEvent, setActiveEvent] = useState<ActiveRandomEvent | null>(null);
  const nextEventTimerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sound.enabled = next;
  };

  const currentCustomer = CUSTOMER_PROFILES[customerIdx % CUSTOMER_PROFILES.length];

  // Schedule Next Random Event
  const scheduleRandomEvent = useCallback(() => {
    if (nextEventTimerRef.current) clearTimeout(nextEventTimerRef.current);

    const delay = (30 + Math.random() * 10) * 1000;
    nextEventTimerRef.current = setTimeout(() => {
      const eventKeys: (Exclude<RandomEventType, 'NONE'>)[] = [
        'BISCUIT_BAARISH',
        'TRAFFIC_JAM',
        'POWER_CUT',
        'SURPRISE_INSPECTION',
      ];
      const pickedKey = eventKeys[Math.floor(Math.random() * eventKeys.length)];
      const preset = RANDOM_EVENT_PRESETS[pickedKey];

      if (pickedKey === 'TRAFFIC_JAM') {
        sound.playAutoHonk();
      } else if (pickedKey === 'POWER_CUT') {
        sound.playPowerZap();
      } else {
        sound.playEventStart();
      }

      onTriggerBanter(
        {
          text: preset.banterText,
          speaker: preset.speaker,
          mood: pickedKey === 'POWER_CUT' ? 'warn' : 'funny',
        },
        preset.name
      );

      const newEvent: ActiveRandomEvent = {
        ...preset,
        timeLeft: preset.duration,
      };
      setActiveEvent(newEvent);

      const eventInterval = setInterval(() => {
        setActiveEvent((prev) => {
          if (!prev) return null;
          if (prev.timeLeft <= 1) {
            clearInterval(eventInterval);
            scheduleRandomEvent();
            return null;
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }, delay);
  }, [onTriggerBanter]);

  // Pick Next Customer
  const nextCustomer = useCallback(() => {
    setCustomerIdx((prev) => (prev + 1) % CUSTOMER_PROFILES.length);
    setPatience(100);
  }, []);

  // Reset & Start
  const startShift = useCallback(() => {
    setScore(0);
    setCoinsEarned(0);
    setCupsBrewed(0);
    setLives(diffConfig.initialLives);
    setTimeLeft(diffConfig.timerSeconds + (stats.activeLandmark === 'hussain_sagar' ? 5 : 0));
    setSurvivalSeconds(0);
    setStreak(0);
    setTemp(72);
    setIsOverboiling(false);
    setPatience(100);
    setCurrentCup({ decoction: 0, milk: 0, hasMalai: false });
    setIsGameOver(false);
    setIsPlaying(true);
    setActiveEvent(null);
    sound.playChime(1.2);
    scheduleRandomEvent();
  }, [diffConfig, stats.activeLandmark, scheduleRandomEvent]);

  // End Game
  const endShift = useCallback(() => {
    setIsPlaying(false);
    setIsGameOver(true);
    setActiveEvent(null);
    if (nextEventTimerRef.current) clearTimeout(nextEventTimerRef.current);
    sound.playErrorBuzzer();
    onRecordScore(score, cupsBrewed);
    if (coinsEarned > 0) {
      onUpdateCoins(coinsEarned);
    }
    if (score > stats.highScoreRush) {
      confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 } });
    }
  }, [score, cupsBrewed, coinsEarned, stats.highScoreRush, onRecordScore, onUpdateCoins]);

  // Game countdown or survival timer
  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    const timer = setInterval(() => {
      if (diffConfig.hasTimer) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endShift();
            return 0;
          }
          return prev - 1;
        });
      } else {
        setSurvivalSeconds((s) => s + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, isGameOver, diffConfig.hasTimer, endShift]);

  // Samovar natural heat cooling & overboil checks
  useEffect(() => {
    if (!isPlaying) return;
    const heatTick = setInterval(() => {
      setTemp((t) => {
        const cooler = Math.max(10, t - 2);
        if (cooler > 92 && !isOverboiling) {
          setIsOverboiling(true);
          sound.playSteam();
          const roast = CHAI_MISTAKE_ROASTS[0];
          onTriggerBanter(roast, 'Overboil Alert!');
        } else if (cooler <= 90) {
          setIsOverboiling(false);
        }
        return cooler;
      });
    }, 600);
    return () => clearInterval(heatTick);
  }, [isPlaying, isOverboiling, onTriggerBanter]);

  // Customer patience countdown
  useEffect(() => {
    if (!isPlaying) return;
    const patienceInterval = setInterval(() => {
      setPatience((p) => {
        const zenModifier = diffConfig.id === 'ZEN' ? 0.45 : diffConfig.speedMultiplier;
        const speed = currentCustomer.patienceSpeed * zenModifier * (stats.upgrades['zafran_blend'] ? 0.75 : 1);
        const nextVal = p - speed;
        if (nextVal <= 0) {
          sound.playErrorBuzzer();
          setStreak(0);
          if (diffConfig.id !== 'ZEN') {
            setLives((l) => {
              const remaining = l - 1;
              if (remaining <= 0) {
                endShift();
              }
              return Math.max(0, remaining);
            });
          }
          const roast = CHAI_MISTAKE_ROASTS[1];
          onTriggerBanter(roast, `${currentCustomer.name} Walked Out!`);
          nextCustomer();
          return 100;
        }
        return nextVal;
      });
    }, 150);

    return () => clearInterval(patienceInterval);
  }, [isPlaying, currentCustomer, stats.upgrades, diffConfig, nextCustomer, onTriggerBanter, endShift]);

  // Tap: Heat up Samovar
  const handleStokeFire = () => {
    if (!isPlaying) return;
    sound.playSteam();
    setTemp((t) => Math.min(100, t + 12));
  };

  // Step 1: Pour Decoction
  const handlePourDecoction = () => {
    if (!isPlaying) return;
    if (temp < 35) {
      sound.playErrorBuzzer();
      onTriggerBanter(CHAI_MISTAKE_ROASTS[2], 'Cold Samovar!');
      return;
    }
    sound.playPour();
    setCurrentCup((prev) => ({
      ...prev,
      decoction: Math.min(50, prev.decoction + 25),
    }));
  };

  // Step 2: Pour Creamy Boiled Milk
  const handlePourMilk = () => {
    if (!isPlaying) return;
    if (currentCup.decoction < 25) {
      sound.playErrorBuzzer();
      onTriggerBanter(
        {
          text: "Pehle decoction to dalo ustaad! Khaali doodh peenay aaye kya public?",
          speaker: "Ustaad Nimrah",
          mood: "warn",
        },
        'Chai Sequence Mistake!'
      );
      return;
    }
    sound.playPour();
    setCurrentCup((prev) => ({
      ...prev,
      milk: Math.min(45, prev.milk + 25),
    }));
  };

  // Step 3: Add Malai
  const handleAddMalai = () => {
    if (!isPlaying) return;
    if (currentCup.decoction < 25 || currentCup.milk < 25) {
      sound.playErrorBuzzer();
      onTriggerBanter(
        {
          text: "Arey ustaad, bina chai ke malai kisme daalre? Hawa me?",
          speaker: "Saleem Pheku",
          mood: "funny",
        },
        'Malai Spooning Mistake!'
      );
      return;
    }
    sound.playCrunch();
    setCurrentCup((prev) => ({
      ...prev,
      hasMalai: true,
    }));
  };

  const handleDumpCup = () => {
    if (!isPlaying) return;
    sound.playErrorBuzzer();
    setCurrentCup({ decoction: 0, milk: 0, hasMalai: false });
  };

  // Serve the finished cup
  const handleServeChai = () => {
    if (!isPlaying) return;

    const isComplete = currentCup.decoction >= 50 && currentCup.milk >= 40;
    if (!isComplete) {
      sound.playErrorBuzzer();
      onTriggerBanter(
        {
          text: "Adhoori chai kaun deta miyan? Glass to bharo poora!",
          speaker: "Chotu Chaiwala",
          mood: "warn",
        },
        'Incomplete Cup!'
      );
      return;
    }

    sound.playChime(1.4);
    const speedBonus = patience > 50 ? 15 : 5;
    const malaiBonus = currentCup.hasMalai ? 20 : 0;
    const basePts = currentCustomer.points;

    // Event Multipliers
    let eventPointsMultiplier = 1;
    if (activeEvent?.type === 'SURPRISE_INSPECTION') eventPointsMultiplier = 3;
    if (activeEvent?.type === 'POWER_CUT') eventPointsMultiplier = 1.5;
    if (activeEvent?.type === 'BISCUIT_BAARISH') eventPointsMultiplier = 1.5;

    const totalEarned = Math.round(
      (basePts + speedBonus + malaiBonus) * diffConfig.pointsMultiplier * eventPointsMultiplier
    );

    const coinMultiplier = activeEvent?.type === 'TRAFFIC_JAM' ? 2 : 1;
    const earnedCoin = (currentCustomer.coins + (currentCup.hasMalai ? 5 : 0)) * coinMultiplier;

    setScore((s) => s + totalEarned);
    setCoinsEarned((c) => c + earnedCoin);
    setCupsBrewed((b) => b + 1);

    if (diffConfig.hasTimer) {
      setTimeLeft((t) => t + 3);
    }

    setStreak((st) => {
      const nextSt = st + 1;
      if (nextSt % 4 === 0) {
        sound.playFanfare();
        const praise = STREAK_PRAISE[Math.floor(Math.random() * STREAK_PRAISE.length)];
        onTriggerBanter(praise, 'Speed Master!');
      }
      return nextSt;
    });

    setCurrentCup({ decoction: 0, milk: 0, hasMalai: false });
    nextCustomer();
  };

  const isCupReady = currentCup.decoction >= 50 && currentCup.milk >= 40;

  return (
    <div className="relative w-full h-[620px] max-w-5xl mx-auto rounded-2xl overflow-hidden border border-amber-900/40 bg-black/45 shadow-2xl backdrop-blur-sm select-none flex flex-col justify-between">
      {/* Random Triggering Event Floating Banner */}
      <RandomEventBanner activeEvent={activeEvent} />

      {/* Top HUD */}
      <div className="flex items-center justify-between px-6 py-3 bg-black/60 border-b border-white/10 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-200/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Menu</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
              Cups:
            </span>
            <span className="font-mono text-base font-bold text-white tabular-nums">
              {cupsBrewed} 🫖
            </span>
          </div>

          <div className="flex items-center gap-1" title="Customer Strikes / Lives">
            {diffConfig.id === 'ZEN' ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                <Heart className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                <InfinityIcon className="w-3.5 h-3.5" />
              </span>
            ) : (
              [...Array(diffConfig.initialLives)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 transition-transform duration-200 ${
                    i < lives
                      ? 'text-red-500 fill-red-500 scale-100'
                      : 'text-stone-600 fill-stone-800 scale-90'
                  }`}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-amber-400/80">
              Rush Score
            </span>
            <span className="font-mono text-2xl font-black text-amber-300 tabular-nums">
              {score}
            </span>
          </div>

          <div className="text-center">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-yellow-400/80">
              Paisa / Coins
            </span>
            <span className="font-mono text-xl font-bold text-yellow-300 tabular-nums">
              +{coinsEarned} 🪙
            </span>
          </div>

          <div className="text-center">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-orange-400/80">
              {diffConfig.hasTimer ? 'Shift Clock' : 'Survived'}
            </span>
            <span
              className={`font-mono text-2xl font-black tabular-nums ${
                diffConfig.hasTimer && timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'
              }`}
            >
              {diffConfig.hasTimer ? `${timeLeft}s` : `${survivalSeconds}s`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-amber-300 bg-black/50 px-2.5 py-1 rounded-md border border-white/10 hidden sm:inline-block">
            {diffConfig.badge}
          </span>

          <button
            onClick={toggleSound}
            className="p-2 text-amber-200/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle Sound"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Rush Play Arena */}
      <div className="relative flex-1 p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: Customer Order & Patience Bar (4 cols) */}
        <div className="md:col-span-4 h-full flex flex-col justify-between p-5 rounded-2xl bg-[#23150b]/80 border border-amber-800/40 shadow-xl backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Current Customer
              </span>
              <span className="text-xs font-mono text-amber-300/80">
                Streak: x{streak}
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600/40 to-amber-950 flex items-center justify-center text-3xl shadow-inner border border-amber-500/30">
                {currentCustomer.avatarEmoji}
              </div>
              <div>
                <h3 className="font-black text-amber-100 text-base leading-tight">
                  {currentCustomer.name}
                </h3>
                <span className="text-xs text-amber-300/70 font-medium">
                  {currentCustomer.title}
                </span>
              </div>
            </div>

            <div className="relative p-3.5 rounded-xl bg-black/40 border border-white/5 mb-4 text-xs font-medium text-amber-100 italic leading-snug">
              "{currentCustomer.dialogue}"
            </div>

            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/30 mb-4">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-amber-200 font-bold">Wants:</span>
                <span className="text-yellow-400 font-black tracking-wide uppercase">
                  {currentCustomer.orderType.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[11px] text-amber-200/60">
                Requires: Strong decoction + Creamy milk {currentCustomer.orderType === 'MALAI_CHAI' ? '+ Extra Malai' : ''}
              </p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-amber-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Customer Patience
              </span>
              <span
                className={`font-mono text-xs tabular-nums ${
                  patience < 30 ? 'text-red-400' : 'text-amber-300'
                }`}
              >
                {Math.round(patience)}%
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-black/60 overflow-hidden border border-white/5">
              <div
                className={`h-full transition-all duration-150 rounded-full ${
                  patience > 50
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                    : patience > 25
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                    : 'bg-gradient-to-r from-red-600 to-red-500 animate-pulse'
                }`}
                style={{ width: `${Math.max(0, patience)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center Column: The Majestic Brass Samovar (4 cols) */}
        <div className="md:col-span-4 h-full flex flex-col items-center justify-between p-5 rounded-2xl bg-black/30 border border-amber-900/30">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              Samovar Heat
            </span>
            <span
              className={`font-mono text-xs font-bold tabular-nums ${
                temp > 90 ? 'text-red-400' : temp < 40 ? 'text-blue-400' : 'text-amber-300'
              }`}
            >
              {temp}°C {temp > 90 ? '(OVERBOIL!)' : temp < 40 ? '(COLD!)' : '(KADAK)'}
            </span>
          </div>

          <div className="relative w-48 h-56 flex items-center justify-center">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-none">
              <div className="w-2.5 h-10 bg-amber-200/30 rounded-full blur-sm animate-steam" />
              <div
                className="w-3 h-12 bg-amber-100/40 rounded-full blur-sm animate-steam"
                style={{ animationDelay: '0.4s' }}
              />
            </div>

            <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-2xl">
              <circle cx="100" cy="22" r="8" fill="#fbbf24" stroke="#78350f" strokeWidth="2" />
              <ellipse cx="100" cy="36" rx="36" ry="12" fill="#d97706" stroke="#92400e" strokeWidth="2" />
              <rect x="75" y="42" width="50" height="14" fill="#b45309" rx="2" />

              <path
                d="M 50 65 Q 40 120 70 170 L 130 170 Q 160 120 150 65 Z"
                fill="url(#brassGrad2)"
                stroke="#78350f"
                strokeWidth="2.5"
              />

              <defs>
                <linearGradient id="brassGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#92400e" />
                  <stop offset="35%" stopColor="#f59e0b" />
                  <stop offset="65%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>

              <path d="M 45 90 Q 20 105 45 125" fill="none" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
              <path d="M 155 90 Q 180 105 155 125" fill="none" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />

              <rect x="94" y="140" width="12" height="18" fill="#451a03" />
              <polygon points="90,158 110,158 100,172" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />

              <path d="M 65 170 L 60 200 L 140 200 L 135 170 Z" fill="#92400e" />
              <ellipse cx="100" cy="204" rx="48" ry="12" fill="#78350f" />

              <ellipse
                cx="100"
                cy="195"
                rx="35"
                ry="8"
                fill={temp > 80 ? '#f97316' : temp > 50 ? '#eab308' : '#3b82f6'}
                opacity={temp / 120}
              />
            </svg>
          </div>

          <button
            onClick={handleStokeFire}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-amber-950 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-300 hover:to-amber-400 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 cursor-pointer"
          >
            <Flame className="w-4 h-4 text-orange-950" />
            <span>Stoke Flame (+Heat)</span>
          </button>
        </div>

        {/* Right Column: Tea Glass Assembly & Serve Station (4 cols) */}
        <div className="md:col-span-4 h-full flex flex-col justify-between p-5 rounded-2xl bg-[#23150b]/80 border border-amber-800/40 shadow-xl backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Glass Assembly
              </span>
              <button
                onClick={handleDumpCup}
                className="text-[11px] text-red-400 hover:text-red-300 hover:underline cursor-pointer"
              >
                Dump Cup
              </button>
            </div>

            <div className="relative w-32 h-44 mx-auto my-2 rounded-lg border-2 border-white/20 bg-white/5 overflow-hidden shadow-inner flex flex-col justify-end p-1">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 pointer-events-none" />

              {currentCup.hasMalai && (
                <div className="w-full h-5 bg-gradient-to-b from-[#fefce8] to-[#fef08a] border-b border-amber-200/50 rounded-t flex items-center justify-center animate-crunch">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                </div>
              )}

              <div
                className="w-full bg-gradient-to-b from-[#fef08a] to-[#fde047] transition-all duration-200"
                style={{ height: `${currentCup.milk * 0.9}px` }}
              />

              <div
                className="w-full bg-gradient-to-b from-[#92400e] to-[#451a03] transition-all duration-200"
                style={{ height: `${currentCup.decoction * 1.3}px` }}
              />

              {currentCup.decoction === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-white/40 italic">
                  Empty Glass
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handlePourDecoction}
                className="py-2 px-1 text-[11px] font-bold text-amber-100 bg-amber-900/80 hover:bg-amber-800 border border-amber-700/50 rounded-lg active:scale-95 transition-all text-center leading-tight cursor-pointer"
              >
                1. Decoction
                <span className="block text-[9px] text-amber-300/80 font-normal">
                  ({currentCup.decoction}%)
                </span>
              </button>

              <button
                onClick={handlePourMilk}
                className="py-2 px-1 text-[11px] font-bold text-amber-950 bg-amber-200 hover:bg-amber-100 border border-amber-300 rounded-lg active:scale-95 transition-all text-center leading-tight cursor-pointer"
              >
                2. Boiled Milk
                <span className="block text-[9px] text-amber-900/80 font-normal">
                  ({currentCup.milk}%)
                </span>
              </button>

              <button
                onClick={handleAddMalai}
                className={`py-2 px-1 text-[11px] font-bold rounded-lg active:scale-95 transition-all text-center leading-tight cursor-pointer ${
                  currentCup.hasMalai
                    ? 'bg-emerald-600 text-white'
                    : 'bg-yellow-400 text-amber-950 hover:bg-yellow-300'
                }`}
              >
                3. Malai
                <span className="block text-[9px] font-normal">
                  {currentCup.hasMalai ? 'Added ✓' : '+Top'}
                </span>
              </button>
            </div>

            <button
              onClick={handleServeChai}
              disabled={!isCupReady}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                isCupReady
                  ? 'text-amber-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-lg shadow-amber-500/25 active:scale-95 animate-pulse cursor-pointer'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              <span>Serve Kadak Chai!</span>
            </button>
          </div>
        </div>
      </div>

      {/* Zero State / Start Rush Modal */}
      {!isPlaying && !isGameOver && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#24150b] border border-amber-600/40 text-center shadow-2xl">
            <span className="text-4xl block mb-3">☕</span>
            <div className="inline-block px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold mb-2">
              Mode: {diffConfig.name}
            </div>
            <h2 className="text-2xl font-black text-amber-200 mb-2">
              Irani Chai Rush Hour!
            </h2>
            <p className="text-xs text-amber-100/70 mb-5 leading-relaxed">
              {diffConfig.description}
            </p>

            <div className="space-y-2 mb-6 text-left text-xs bg-black/40 p-3.5 rounded-xl border border-white/5 text-amber-200/90">
              <div className="flex items-center gap-2">
                <span className="font-bold text-orange-400">1.</span>
                <span>Keep Samovar heated between 60°C and 85°C.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-orange-400">2.</span>
                <span>Tap 1. Decoction → 2. Boiled Milk → 3. Malai.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-orange-400">3.</span>
                <span>Random events trigger every 35s (Power cut, Traffic jam)!</span>
              </div>
            </div>

            <button
              onClick={startShift}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-base text-amber-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              Start {diffConfig.name}!
            </button>
          </div>
        </div>
      )}

      {/* Game Over Shift Summary Modal */}
      {isGameOver && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/85 backdrop-blur-md">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#24150b] border border-amber-600/50 text-center shadow-2xl animate-shake">
            <span className="text-4xl mb-3 block">🏪</span>
            <h2 className="text-2xl font-black text-amber-200 mb-1">
              Tea Stall Counter Closed!
            </h2>
            <p className="text-xs text-amber-400 font-semibold mb-6">
              "Kya kadak service diye ustaad! Chalo ab hisab karenge!"
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[11px] text-white/60 uppercase font-semibold block">
                  Cups Brewed
                </span>
                <span className="text-2xl font-black font-mono text-amber-300 tabular-nums">
                  {cupsBrewed} 🫖
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[11px] text-white/60 uppercase font-semibold block">
                  Chai Paisa Earned
                </span>
                <span className="text-2xl font-black font-mono text-yellow-400 tabular-nums">
                  +{coinsEarned} 🪙
                </span>
              </div>
            </div>

            {score > stats.highScoreRush && (
              <div className="mb-6 py-2 px-4 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span>Naya Rush Record: {score} pts!</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={startShift}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-amber-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Brew Again</span>
              </button>
              <button
                onClick={onBackToMenu}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                Return to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

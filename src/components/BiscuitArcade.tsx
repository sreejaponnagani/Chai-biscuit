import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { FallingItem, Particle, FloatingText, ItemType, PlayerStats, ActiveRandomEvent, RandomEventType } from '../types/game';
import { DIFFICULTY_CONFIGS, RANDOM_EVENT_PRESETS } from '../data/modesAndEvents';
import { sound } from '../utils/audio';
import { MISSED_BISCUIT_ROASTS, CAUGHT_CHILLI_ROASTS, STREAK_PRAISE, BanterQuote } from '../data/banter';
import { RandomEventBanner } from './RandomEventBanner';
import { Heart, Trophy, Timer, Play, RotateCcw, Volume2, VolumeX, ArrowLeft, Infinity as InfinityIcon } from 'lucide-react';

interface Props {
  stats: PlayerStats;
  onUpdateCoins: (amount: number) => void;
  onRecordScore: (score: number, biscuitsCaught: number) => void;
  onTriggerBanter: (quote: BanterQuote, tagline: string) => void;
  onBackToMenu: () => void;
}

export const BiscuitArcade: React.FC<Props> = ({
  stats,
  onUpdateCoins,
  onRecordScore,
  onTriggerBanter,
  onBackToMenu,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const diffConfig = DIFFICULTY_CONFIGS.find((d) => d.id === stats.selectedDifficulty) || DIFFICULTY_CONFIGS[0];

  // Game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(diffConfig.initialLives);
  const [timeLeft, setTimeLeft] = useState(diffConfig.timerSeconds + (stats.activeLandmark === 'hussain_sagar' ? 5 : 0));
  const [survivalSeconds, setSurvivalSeconds] = useState(0);
  const [combo, setCombo] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [isMalaiRush, setIsMalaiRush] = useState(false);
  const [soundOn, setSoundOn] = useState(stats.soundEnabled);

  // Active Random Event state (triggers every 30-40s)
  const [activeEvent, setActiveEvent] = useState<ActiveRandomEvent | null>(null);
  const nextEventTimerRef = useRef<NodeJS.Timeout | null>(null);
  const eventDurationRef = useRef<NodeJS.Timeout | null>(null);

  // References for the 60fps render loop
  const paddleRef = useRef({
    x: 300,
    y: 500,
    width: 110 + (stats.upgrades['saucer_width'] || 0) * 15,
    height: 38,
  });

  const itemsRef = useRef<FallingItem[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatTextsRef = useRef<FloatingText[]>([]);
  const nextItemIdRef = useRef(1);
  const lastSpawnTimeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const keysPressedRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const biscuitsCaughtCountRef = useRef(0);
  const malaiRushTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle Sound
  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sound.enabled = next;
  };

  // Trigger Banter Roast helper
  const triggerRoast = useCallback((type: 'miss' | 'mirchi' | 'streak') => {
    let pool: BanterQuote[] = MISSED_BISCUIT_ROASTS;
    let tagline = 'Biscuit Drop Fail!';
    if (type === 'mirchi') {
      pool = CAUGHT_CHILLI_ROASTS;
      tagline = 'Mirchi Trap Caught!';
    } else if (type === 'streak') {
      pool = STREAK_PRAISE;
      tagline = 'Kirrak Catching Streak!';
    }
    const randomPick = pool[Math.floor(Math.random() * pool.length)];
    onTriggerBanter(randomPick, tagline);
  }, [onTriggerBanter]);

  // Schedule Next Random Event (Every 30-40 seconds)
  const scheduleRandomEvent = useCallback(() => {
    if (nextEventTimerRef.current) clearTimeout(nextEventTimerRef.current);

    const delay = (30 + Math.random() * 10) * 1000; // 30 to 40 seconds
    nextEventTimerRef.current = setTimeout(() => {
      const eventKeys: (Exclude<RandomEventType, 'NONE'>)[] = [
        'BISCUIT_BAARISH',
        'TRAFFIC_JAM',
        'POWER_CUT',
        'SURPRISE_INSPECTION',
      ];
      const pickedKey = eventKeys[Math.floor(Math.random() * eventKeys.length)];
      const preset = RANDOM_EVENT_PRESETS[pickedKey];

      // Audio cue
      if (pickedKey === 'TRAFFIC_JAM') {
        sound.playAutoHonk();
      } else if (pickedKey === 'POWER_CUT') {
        sound.playPowerZap();
      } else {
        sound.playEventStart();
      }

      // Banter quote
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

      // Countdown the active event
      const eventInterval = setInterval(() => {
        setActiveEvent((prev) => {
          if (!prev) return null;
          if (prev.timeLeft <= 1) {
            clearInterval(eventInterval);
            scheduleRandomEvent(); // schedule next event in 30-40s
            return null;
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }, delay);
  }, [onTriggerBanter]);

  // Spawn Biscuit Crumb Particles
  const spawnCrumbs = (x: number, y: number, color: string = '#d97706') => {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        radius: 2 + Math.random() * 3.5,
        color,
        alpha: 1,
        decay: 0.03 + Math.random() * 0.03,
      });
    }
  };

  // Add Floating Text
  const addFloatText = (x: number, y: number, text: string, color: string = '#fef08a') => {
    floatTextsRef.current.push({
      id: Math.random(),
      x,
      y,
      text,
      color,
      alpha: 1,
      scale: 1,
    });
  };

  // Reset Game
  const startNewGame = useCallback(() => {
    setScore(0);
    setLives(diffConfig.initialLives);
    setTimeLeft(diffConfig.timerSeconds + (stats.activeLandmark === 'hussain_sagar' ? 5 : 0));
    setSurvivalSeconds(0);
    setCombo(0);
    setMultiplier(1);
    setIsMalaiRush(false);
    setIsGameOver(false);
    setIsPlaying(true);
    setActiveEvent(null);
    itemsRef.current = [];
    particlesRef.current = [];
    floatTextsRef.current = [];
    biscuitsCaughtCountRef.current = 0;
    if (malaiRushTimerRef.current) clearTimeout(malaiRushTimerRef.current);
    sound.playChime(1.2);
    scheduleRandomEvent();
  }, [diffConfig, stats.activeLandmark, scheduleRandomEvent]);

  // Handle Game Over
  const endGame = useCallback(() => {
    setIsPlaying(false);
    setIsGameOver(true);
    setActiveEvent(null);
    if (nextEventTimerRef.current) clearTimeout(nextEventTimerRef.current);
    sound.playErrorBuzzer();
    onRecordScore(score, biscuitsCaughtCountRef.current);
    const earnedCoins = Math.floor(score / 5);
    if (earnedCoins > 0) {
      onUpdateCoins(earnedCoins);
    }
    if (score > stats.highScoreArcade) {
      confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
    }
  }, [score, stats.highScoreArcade, onRecordScore, onUpdateCoins]);

  // Game Clock Tick
  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    const interval = setInterval(() => {
      if (diffConfig.hasTimer) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      } else {
        // Survival mode counts up seconds
        setSurvivalSeconds((s) => s + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, diffConfig.hasTimer, endGame]);

  // Check lives effect
  useEffect(() => {
    if (diffConfig.id !== 'ZEN' && lives <= 0 && isPlaying) {
      endGame();
    }
  }, [lives, isPlaying, diffConfig.id, endGame]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressedRef.current.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressedRef.current.right = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressedRef.current.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressedRef.current.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Mouse & Touch paddle tracking
  const updatePaddlePos = (clientX: number) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const paddleWidth = paddleRef.current.width;
    paddleRef.current.x = Math.max(
      paddleWidth / 2,
      Math.min(canvasRef.current.width - paddleWidth / 2, relativeX)
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying) return;
    updatePaddlePos(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isPlaying || e.touches.length === 0) return;
    updatePaddlePos(e.touches[0].clientX);
  };

  // Main Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        paddleRef.current.y = canvas.height - 56;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        const moveSpeed = 620 * dt;
        const paddleWidth = paddleRef.current.width;
        if (keysPressedRef.current.left) {
          paddleRef.current.x = Math.max(paddleWidth / 2, paddleRef.current.x - moveSpeed);
        }
        if (keysPressedRef.current.right) {
          paddleRef.current.x = Math.min(canvas.width - paddleWidth / 2, paddleRef.current.x + moveSpeed);
        }

        // Spawn Items with active event modifiers
        const isBaarish = activeEvent?.type === 'BISCUIT_BAARISH';
        const isTraffic = activeEvent?.type === 'TRAFFIC_JAM';

        // Baarish spawns very fast, traffic slightly slower
        const spawnInterval = isBaarish || isMalaiRush ? 220 : isTraffic ? 700 : Math.max(380, 850 - score * 1.5);

        if (currentTime - lastSpawnTimeRef.current > spawnInterval) {
          lastSpawnTimeRef.current = currentTime;

          let type: ItemType = 'OSMANIA';
          let points = 10 + (stats.upgrades['nimrah_oven'] || 0) * 5;
          let radius = 22;

          const rand = Math.random();

          if (isBaarish) {
            // Biscuit Baarish: Only Osmania and Double Butter, 0 chillies!
            type = Math.random() > 0.45 ? 'DOUBLE_BUTTER' : 'OSMANIA';
            points = type === 'DOUBLE_BUTTER' ? 30 : 15;
            radius = type === 'DOUBLE_BUTTER' ? 24 : 22;
          } else if (isMalaiRush) {
            type = Math.random() > 0.4 ? 'DOUBLE_BUTTER' : 'MALAI_DROP';
            points = 25;
          } else if (rand < 0.58) {
            type = 'OSMANIA';
            points = 10 + (stats.upgrades['nimrah_oven'] || 0) * 5;
          } else if (rand < 0.76) {
            type = 'DOUBLE_BUTTER';
            points = 25;
            radius = 24;
          } else if (rand < 0.87) {
            type = 'MALAI_DROP';
            points = 15;
            radius = 20;
          } else if (rand < 0.94) {
            type = 'CHAI_GLASS';
            points = 50;
            radius = 22;
          } else {
            type = 'MIRCHI';
            points = -20;
            radius = 18;
          }

          // Speed modified by DifficultyMode + Survival progress
          const baseSpeed = 180 + Math.random() * 160 + Math.min(250, score * 0.4);
          const progressiveSurvival = diffConfig.id === 'SURVIVAL' ? 1 + survivalSeconds * 0.005 : 1;
          const finalSpeed = baseSpeed * diffConfig.speedMultiplier * progressiveSurvival * (isBaarish ? 1.25 : 1);

          itemsRef.current.push({
            id: nextItemIdRef.current++,
            x: 40 + Math.random() * (canvas.width - 80),
            y: -30,
            speed: finalSpeed,
            radius,
            type,
            rotation: Math.random() * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 3,
            scale: 1,
            points,
          });
        }

        // Update & Render Falling Items
        const paddle = paddleRef.current;
        const currentItems = [...itemsRef.current];
        const remainingItems: FallingItem[] = [];

        currentItems.forEach((item) => {
          item.y += item.speed * dt;
          item.rotation += item.rotSpeed * dt;

          const paddleTop = paddle.y - paddle.height / 2;
          const paddleLeft = paddle.x - paddle.width / 2;
          const paddleRight = paddle.x + paddle.width / 2;

          const hasHitPaddle =
            item.y + item.radius >= paddleTop &&
            item.y - item.radius <= paddleTop + 24 &&
            item.x >= paddleLeft - 10 &&
            item.x <= paddleRight + 10;

          if (hasHitPaddle) {
            if (item.type === 'MIRCHI') {
              sound.playErrorBuzzer();
              if (diffConfig.id !== 'ZEN') {
                setLives((l) => Math.max(0, l - 1));
              }
              setCombo(0);
              setMultiplier(1);
              spawnCrumbs(item.x, item.y, '#ef4444');
              addFloatText(item.x, item.y, 'OUCH! MIRCHI! -1 LIFE', '#ef4444');
              triggerRoast('mirchi');
            } else {
              sound.playCrunch();
              biscuitsCaughtCountRef.current++;

              // Active Event multipliers
              let eventMultiplier = 1;
              if (activeEvent?.type === 'SURPRISE_INSPECTION') eventMultiplier = 3;
              if (activeEvent?.type === 'POWER_CUT') eventMultiplier = 1.5;

              const totalMultiplier = multiplier * diffConfig.pointsMultiplier * eventMultiplier;
              const earnedPts = Math.round(item.points * totalMultiplier);
              setScore((s) => s + earnedPts);

              // Coin tip calculation (Traffic Jam gives 2x coins)
              const coinMultiplier = activeEvent?.type === 'TRAFFIC_JAM' ? 2 : 1;
              const coinsEarned = (item.type === 'DOUBLE_BUTTER' ? 3 : 1) * coinMultiplier;
              onUpdateCoins(coinsEarned);

              setCombo((c) => {
                const nextCombo = c + 1;
                if (nextCombo % 5 === 0) {
                  sound.playChime(1.4);
                  setMultiplier((m) => Math.min(5, m + 1));
                  addFloatText(paddle.x, paddle.y - 40, `KIRRAK STREAK! x${Math.min(5, multiplier + 1)}`, '#38bdf8');
                  if (nextCombo === 10 && !isMalaiRush) {
                    setIsMalaiRush(true);
                    triggerRoast('streak');
                    sound.playFanfare();
                    addFloatText(canvas.width / 2, canvas.height / 3, 'MALAI RUSH ACTIVATED!', '#fbbf24');
                    malaiRushTimerRef.current = setTimeout(() => {
                      setIsMalaiRush(false);
                    }, 8000);
                  }
                }
                return nextCombo;
              });

              if (item.type === 'MALAI_DROP') {
                if (diffConfig.hasTimer) setTimeLeft((t) => t + 2);
                addFloatText(item.x, item.y, '+2s TIME & MALAI!', '#fef08a');
                spawnCrumbs(item.x, item.y, '#fef9c3');
              } else if (item.type === 'CHAI_GLASS') {
                sound.playPour();
                addFloatText(item.x, item.y, `+${earnedPts} ROYAL CHAI!`, '#38bdf8');
                spawnCrumbs(item.x, item.y, '#67e8f9');
              } else {
                addFloatText(item.x, item.y, `+${earnedPts}`, item.type === 'DOUBLE_BUTTER' ? '#f59e0b' : '#fef08a');
                spawnCrumbs(item.x, item.y, item.type === 'DOUBLE_BUTTER' ? '#fbbf24' : '#d97706');
              }
            }
          } else if (item.y > canvas.height + 40) {
            if (item.type === 'OSMANIA' || item.type === 'DOUBLE_BUTTER') {
              setCombo(0);
              setMultiplier(1);
              if (diffConfig.id !== 'ZEN') {
                setLives((l) => Math.max(0, l - 1));
              }
              sound.playErrorBuzzer();
              triggerRoast('miss');
            }
          } else {
            remainingItems.push(item);
          }

          // Draw the falling item
          ctx.save();
          ctx.translate(item.x, item.y);
          ctx.rotate(item.rotation);

          if (item.type === 'OSMANIA' || item.type === 'DOUBLE_BUTTER') {
            const isDouble = item.type === 'DOUBLE_BUTTER';
            ctx.beginPath();
            ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
            ctx.fillStyle = isDouble ? '#f59e0b' : '#d97706';
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = isDouble ? '#fbbf24' : '#b45309';
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, item.radius * 0.72, 0, Math.PI * 2);
            ctx.strokeStyle = isDouble ? '#fef08a' : '#fde68a';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([3, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fillStyle = isDouble ? '#fef3c7' : '#92400e';
            ctx.fill();

            if (isDouble) {
              ctx.beginPath();
              ctx.arc(-item.radius * 0.35, -item.radius * 0.35, 4, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
              ctx.fill();
            }
          } else if (item.type === 'MALAI_DROP') {
            ctx.beginPath();
            ctx.arc(0, 4, item.radius * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = '#fefce8';
            ctx.fill();
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(-2, 0, 6, 0, Math.PI * 1.5);
            ctx.strokeStyle = '#eab308';
            ctx.lineWidth = 2;
            ctx.stroke();
          } else if (item.type === 'CHAI_GLASS') {
            ctx.beginPath();
            ctx.rect(-12, -16, 24, 32);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fill();
            ctx.strokeStyle = '#93c5fd';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.rect(-10, -4, 20, 18);
            ctx.fillStyle = '#b45309';
            ctx.fill();

            ctx.beginPath();
            ctx.rect(-10, -8, 20, 5);
            ctx.fillStyle = '#fef08a';
            ctx.fill();
          } else if (item.type === 'MIRCHI') {
            ctx.beginPath();
            ctx.moveTo(0, -18);
            ctx.bezierCurveTo(12, -8, 10, 12, 0, 18);
            ctx.bezierCurveTo(-10, 12, -12, -8, 0, -18);
            ctx.fillStyle = '#ef4444';
            ctx.fill();
            ctx.strokeStyle = '#b91c1c';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, -18);
            ctx.lineTo(-4, -24);
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 3;
            ctx.stroke();
          }

          ctx.restore();
        });

        itemsRef.current = remainingItems;

        // Render Particles
        particlesRef.current = particlesRef.current.filter((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12;
          p.alpha -= p.decay;

          if (p.alpha <= 0) return false;

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          ctx.restore();
          return true;
        });

        // Render Floating Texts
        floatTextsRef.current = floatTextsRef.current.filter((ft) => {
          ft.y -= 1.2;
          ft.alpha -= 0.02;

          if (ft.alpha <= 0) return false;

          ctx.save();
          ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = ft.color;
          ctx.globalAlpha = ft.alpha;
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 4;
          ctx.fillText(ft.text, ft.x, ft.y);
          ctx.restore();
          return true;
        });

        // Render Paddle Saucer & Irani Chai Cup
        ctx.save();
        ctx.translate(paddle.x, paddle.y);

        ctx.beginPath();
        ctx.ellipse(0, 14, paddle.width / 2, 16, 0, 0, Math.PI * 2);
        const saucerGrad = ctx.createLinearGradient(0, 0, 0, 28);
        saucerGrad.addColorStop(0, '#f8fafc');
        saucerGrad.addColorStop(0.5, '#cbd5e1');
        saucerGrad.addColorStop(1, '#64748b');
        ctx.fillStyle = saucerGrad;
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(0, 14, paddle.width * 0.38, 10, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-18, 14);
        ctx.lineTo(-24, -14);
        ctx.lineTo(24, -14);
        ctx.lineTo(18, 14);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-17, 12);
        ctx.lineTo(-22, -4);
        ctx.lineTo(22, -4);
        ctx.lineTo(17, 12);
        ctx.closePath();
        ctx.fillStyle = '#b45309';
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(0, -4, 21, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#fef08a';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-8, -18);
        ctx.quadraticCurveTo(-14, -28, -8, -36);
        ctx.moveTo(8, -18);
        ctx.quadraticCurveTo(14, -28, 8, -36);
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.5)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, isMalaiRush, score, multiplier, stats.upgrades, activeEvent, diffConfig, survivalSeconds, triggerRoast, onUpdateCoins]);

  return (
    <div className="relative w-full h-[620px] max-w-5xl mx-auto rounded-2xl overflow-hidden border border-amber-900/40 bg-black/40 shadow-2xl backdrop-blur-sm select-none">
      {/* Random Triggering Event Floating Banner */}
      <RandomEventBanner activeEvent={activeEvent} />

      {/* Top HUD Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3 bg-black/60 border-b border-white/10 backdrop-blur-md">
        {/* Left: Back & Lives */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-200/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Menu</span>
          </button>

          <div className="flex items-center gap-1.5" title="Chai Saucer Lives">
            {diffConfig.id === 'ZEN' ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                <Heart className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                <InfinityIcon className="w-3.5 h-3.5" />
              </span>
            ) : (
              [...Array(diffConfig.initialLives)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 transition-transform duration-200 ${
                    i < lives
                      ? 'text-red-500 fill-red-500 scale-100'
                      : 'text-stone-600 fill-stone-800 scale-90'
                  }`}
                />
              ))
            )}
          </div>
        </div>

        {/* Center: Score & Combo & Timer */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-amber-400/80">
              Score
            </span>
            <span className="font-mono text-2xl font-black text-amber-300 tabular-nums">
              {score}
            </span>
          </div>

          <div className="text-center">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-cyan-400/80">
              Streak
            </span>
            <span className="font-mono text-xl font-bold text-cyan-300 tabular-nums">
              x{multiplier} <span className="text-xs text-white/50">({combo})</span>
            </span>
          </div>

          <div className="text-center">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-orange-400/80">
              {diffConfig.hasTimer ? 'Shift Time' : 'Survived'}
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

        {/* Right: Mode Badge & Audio */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-amber-300 bg-black/50 px-2.5 py-1 rounded-md border border-white/10 hidden sm:inline-block">
            {diffConfig.badge}
          </span>

          {isMalaiRush && (
            <span className="px-2.5 py-1 text-xs font-black uppercase tracking-wider text-amber-950 bg-amber-400 rounded-md animate-pulse shadow-md">
              Malai Rush!
            </span>
          )}

          <button
            onClick={toggleSound}
            className="p-2 text-amber-200/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle Sound"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Zero State / Start Game Modal */}
      {!isPlaying && !isGameOver && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/75 backdrop-blur-sm">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#24150b] border border-amber-600/40 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl">
              🍪
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold mb-2">
              Mode: {diffConfig.name}
            </div>
            <h2 className="text-2xl font-extrabold text-amber-200 mb-2">
              Osmania Biscuit Catcher
            </h2>
            <p className="text-xs text-amber-100/70 mb-5 leading-relaxed">
              {diffConfig.description}
            </p>

            <div className="grid grid-cols-2 gap-2.5 mb-6 text-left text-xs text-amber-200/90 bg-black/40 p-3.5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-base">🍪</span>
                <span>Osmania: +10 pts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">✨</span>
                <span>Double Butter: +25 pts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">🛺</span>
                <span className="text-cyan-300">Street Events: Every 35s</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">🌶️</span>
                <span className="text-red-400">Mirchi: Avoid!</span>
              </div>
            </div>

            <button
              onClick={startNewGame}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-base text-amber-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start {diffConfig.name}!</span>
            </button>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#24150b] border border-amber-600/50 text-center shadow-2xl animate-shake">
            <span className="text-4xl mb-3 block">🫖</span>
            <h2 className="text-2xl font-black text-amber-200 mb-1">Shift Over, Ustaad!</h2>
            <p className="text-xs text-amber-400 font-semibold mb-6">
              "Baigan me miladiya ya record tod diya?!"
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[11px] text-white/60 uppercase font-semibold block">
                  Final Score
                </span>
                <span className="text-2xl font-black font-mono text-amber-300 tabular-nums">
                  {score}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[11px] text-white/60 uppercase font-semibold block">
                  Coins Earned
                </span>
                <span className="text-2xl font-black font-mono text-yellow-400 tabular-nums">
                  +{Math.floor(score / 5)} 🪙
                </span>
              </div>
            </div>

            {score > stats.highScoreArcade && (
              <div className="mb-6 py-2 px-4 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span>Naya Record! New High Score: {score}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={startNewGame}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-amber-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
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

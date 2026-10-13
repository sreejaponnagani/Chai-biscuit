export type GameMode = 'MENU' | 'BISCUIT_ARCADE' | 'CHAI_RUSH' | 'UPGRADES' | 'LANDMARKS';

export type DifficultyMode = 'STANDARD' | 'SURVIVAL' | 'ZEN' | 'KIRRAK_HARDCORE';

export interface DifficultyConfig {
  id: DifficultyMode;
  name: string;
  hyderabadiTag: string;
  description: string;
  initialLives: number;
  hasTimer: boolean;
  timerSeconds: number;
  speedMultiplier: number;
  pointsMultiplier: number;
  badge: string;
}

export type RandomEventType = 'NONE' | 'BISCUIT_BAARISH' | 'TRAFFIC_JAM' | 'POWER_CUT' | 'SURPRISE_INSPECTION';

export interface ActiveRandomEvent {
  type: RandomEventType;
  name: string;
  hyderabadiTitle: string;
  description: string;
  banterText: string;
  speaker: string;
  duration: number; // in seconds
  timeLeft: number;
  icon: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
  };
}

export type LandmarkId = 'charminar' | 'golconda' | 'hussain_sagar' | 'chowmahalla';

export interface Landmark {
  id: LandmarkId;
  name: string;
  subtitle: string;
  unlocked: boolean;
  cost: number;
  bonusText: string;
  skyColor: string;
  description: string;
}

export type ItemType = 'OSMANIA' | 'DOUBLE_BUTTER' | 'MALAI_DROP' | 'CHAI_GLASS' | 'MIRCHI' | 'PESKY_FLY';

export interface FallingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  radius: number;
  type: ItemType;
  rotation: number;
  rotSpeed: number;
  scale: number;
  points: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  scale: number;
}

export interface Customer {
  id: string;
  name: string;
  title: string;
  avatarEmoji: string;
  dialogue: string;
  patience: number; // 0 to 100
  patienceSpeed: number;
  orderType: 'CUT_CHAI' | 'KADAK_CHAI' | 'MALAI_CHAI' | 'SPECIAL_ZAFRAN';
  points: number;
  coins: number;
}

export interface ShopUpgrade {
  id: string;
  name: string;
  hyderabadiName: string;
  description: string;
  level: number;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  icon: string;
  effect: string;
}

export interface PlayerStats {
  coins: number;
  highScoreArcade: number;
  highScoreRush: number;
  totalBiscuitsCaught: number;
  totalChaiBrewed: number;
  roastsReceivedCount: number;
  combosAchieved: number;
  unlockedLandmarks: LandmarkId[];
  activeLandmark: LandmarkId;
  selectedDifficulty: DifficultyMode;
  soundEnabled: boolean;
  upgrades: Record<string, number>;
}

export interface BanterMessage {
  id: number;
  speaker: string;
  tagline: string;
  message: string;
  mood: 'angry' | 'funny' | 'proud' | 'warn';
  timestamp: number;
}

import { Landmark, ShopUpgrade } from '../types/game';

export const LANDMARKS: Landmark[] = [
  {
    id: 'charminar',
    name: 'Nimrah Cafe & Charminar',
    subtitle: 'The Historic Heart of Irani Chai & Osmania Biscuits',
    unlocked: true,
    cost: 0,
    bonusText: '+10% Bonus Coin Tips',
    skyColor: 'from-[#1c120c] via-[#2d1b11] to-[#452210]',
    description: 'Bustling morning aroma of freshly baked Osmania biscuits right under the iconic minarets of Charminar.'
  },
  {
    id: 'golconda',
    name: 'Golconda Fort Ramparts',
    subtitle: 'Acoustic Clapping Echo Arena',
    unlocked: false,
    cost: 150,
    bonusText: '+20% Streak Combo Multiplier',
    skyColor: 'from-[#10141a] via-[#1a2332] to-[#24354a]',
    description: 'Perched high on the granite hill of Golconda. Every biscuit catch echoes through the historic royal arches!'
  },
  {
    id: 'hussain_sagar',
    name: 'Hussain Sagar & Tank Bund',
    subtitle: 'Sunset Breeze & Lake Shore Stall',
    unlocked: false,
    cost: 350,
    bonusText: '+5s Extra Shift Timer',
    skyColor: 'from-[#160c1d] via-[#2a133b] to-[#4e1b54]',
    description: 'Evening tea with the illuminated Buddha statue reflecting over the gentle waters and vintage lamp posts.'
  },
  {
    id: 'chowmahalla',
    name: 'Chowmahalla Palace Durbar',
    subtitle: 'Royal Nizami Grand Courtyard',
    unlocked: false,
    cost: 750,
    bonusText: 'Double Coins on All Orders',
    skyColor: 'from-[#17130a] via-[#2d2210] to-[#543b17]',
    description: 'Regal Belgian crystal chandeliers, Persian carpets, and royal tea served on heritage silver platters.'
  }
];

export const INITIAL_UPGRADES: ShopUpgrade[] = [
  {
    id: 'brass_samovar',
    name: 'Vintage Brass Samovar',
    hyderabadiName: 'Shandar Peetal Samovar',
    description: 'High-grade polished brass vessel that boils decoction 25% faster.',
    level: 1,
    maxLevel: 5,
    baseCost: 40,
    costMultiplier: 1.8,
    icon: 'Flame',
    effect: '+25% Brewing Speed'
  },
  {
    id: 'nimrah_oven',
    name: 'Nimrah Brick Bakery Oven',
    hyderabadiName: 'Bhatti Wala Special Oven',
    description: 'Bakes crunchier Osmania biscuits with higher point values and golden double-butter drops.',
    level: 1,
    maxLevel: 5,
    baseCost: 60,
    costMultiplier: 2.0,
    icon: 'Cookie',
    effect: '+5 Points per Biscuit'
  },
  {
    id: 'chotu_assistant',
    name: 'Chotu the Fast Helper',
    hyderabadiName: 'Chotu Speedmaster',
    description: 'Chotu automatically catches 1 close miss every 30 seconds and generates passive coins.',
    level: 0,
    maxLevel: 5,
    baseCost: 100,
    costMultiplier: 2.2,
    icon: 'UserCheck',
    effect: 'Auto-saves misses & +2 coins/sec'
  },
  {
    id: 'zafran_blend',
    name: 'Royal Zafran & Cardamom',
    hyderabadiName: 'Asli Kesar & Elaichi Mix',
    description: 'Exotic Kashmiri saffron and green cardamom that delights customers and extends patience.',
    level: 1,
    maxLevel: 5,
    baseCost: 75,
    costMultiplier: 1.9,
    icon: 'Sparkles',
    effect: '+30% Customer Patience'
  },
  {
    id: 'saucer_width',
    name: 'Wide Nizami Silver Thali',
    hyderabadiName: 'Chodi Silver Thali Saucer',
    description: 'Expands the width of your catching saucer, making it easier to catch fast biscuits.',
    level: 1,
    maxLevel: 5,
    baseCost: 80,
    costMultiplier: 2.1,
    icon: 'Maximize2',
    effect: '+15% Saucer Catch Area'
  }
];

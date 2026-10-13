# Chai & Osmania: Hyderabadi Street Clicker & Arcade

An energetic, humorous, fast-paced arcade and incremental clicker game celebrating Hyderabadi tea culture. Players catch falling Osmania biscuits against iconic Hyderabad cityscapes and brew rapid-fire cups of Irani chai before the timer expires, fueled by authentic Hyderabadi banter, hilarious error roasts, and an incremental cafe upgrade empire.

## User Review & Critical Decisions

> [!IMPORTANT]
> The plan unifies both requested game loops into a seamless experience: an action arcade mode (Catching Falling Osmania Biscuits with a Chai Cup/Plate) and an incremental rush clicker (Brewing Continuous Irani Chai & Managing Samovar Steam before the timer runs out), wrapped in iconic Hyderabad city landmarks (Charminar, Golconda, Hussain Sagar) with local Hyderabadi comedy and banter.

- **Confirmed Experience**: Fast-paced falling Osmania biscuit catching + continuous Irani chai brewing before the timer expires.
- **Confirmed Aesthetic**: Warm Hyderabadi heritage aesthetic featuring iconic places (Charminar / Nimrah Cafe, Golconda Fort, Hussain Sagar Tank Bund), golden tea hues, vintage Irani cafe tiles, and rich royal accents.
- **Confirmed Comedy Engine**: Authentic, affectionate Hyderabadi slang & banter for misses, warnings, and streak errors (*"Baigan me miladiya!", "Kaiku re biscuit gira diya?", "Ustaad chai thandi hori jaldi dalo!", "Light le lo miyan!"*).
- **Audio & Haptics**: Built-in synthesized Web Audio sound effects (tea pouring splash, biscuit crunch, samovar steam hiss, combo chimes, and comedic error buzzers) with zero external audio assets required.

---

## 1. Overview & Core Concept

- **What It Does**:
  - **Biscuit Catcher Arcade**: Fast-action mode where players slide an Irani chai saucer/cup across the screen to catch golden Osmania biscuits falling past Charminar and Golconda. Dodge obstacles (like flies or rogue mirchi), chain combo catches, and trigger "Malai Rush" fever mode!
  - **Irani Chai Rush Clicker**: Fast-paced incremental clicker where players tap to boil milk, brew strong decoction, layer rich malai, and fill classic cut glasses for waiting customers before the 60-second shift timer runs out.
  - **Nimrah Cafe Upgrades (Incremental Progression)**: Earn "Chai Paisa" (coins) to buy cafe improvements (Brass Samovar, Chotu the Delivery Boy, Secret Cardamom Blend, Golconda Echo Stand) boosting points and auto-brew rates.
  - **Hyderabadi Landmark Tour**: Progress through Hyderabad spots (Nimrah Cafe & Charminar, Hussain Sagar Sunset, Golconda Fort Ramparts, Chowmahalla Palace).
- **Target Audience**: Casual arcade gamers, nostalgic foodies, and anyone who loves fast-paced reflex challenges with warm regional charm and humor.
- **Key Value**: Addictive gameplay loop, immediate tactile feedback, crisp graphics, and genuine local cultural comedy.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Title & Landmark Select**: Vibrant welcome screen with Nimrah Cafe backdrop, play mode selection (*Biscuit Catcher* or *Irani Chai Rush*), high score ledger, and audio toggle.
2. **Biscuit Catching Gameplay**:
   - Smooth mouse/touch drag (and Arrow/AD keys) controls the saucer.
   - Falling items: Classic Osmania Biscuits (+10 pts), Double Butter Gold Biscuits (+25 pts), Malai Drops (+Combo Multiplier), and spicy Chili Peppers (-Penalty / Hilarious error warning).
   - Dynamic timer count-down with time bonuses for clean streaks.
3. **Irani Chai Brewer Gameplay**:
   - Interactive Samovar with heat gauge, continuous glass filling mechanic, and quick topping taps (Tea Decoction -> Creamy Milk -> Malai swirl).
   - "Order Rush" customer counter with quirky Hyderabadi characters asking for "One by Two Chai!"
4. **Humorous Dialog & Error System**:
   - Whenever a biscuit drops, tea boils over, or wrong tap occurs, a comedic pop-up notification roasts the player with authentic Hyderabadi street sayings (*"Arey miyan, dhyan kidhar hai?", "Biscuit chai me doob ke toot gaya!", "Ustaad naraz hore ab!"*).
5. **Round Summary & Shop**:
   - High score display, stats (Biscuits Caught, Chai Poured, Comedy Roasts earned), and Nimrah Shop to buy permanent upgrades or unlock new Hyderabad backgrounds.

### Visual Identity & Theme
- **Aesthetic Direction**: Nostalgic Hyderabadi Irani Cafe meets modern arcade polish. Vintage checkered floor motifs, warm brass samovars, steaming glass silhouettes, and stylized architectural vectors of Charminar, Golconda Fort, and Hussain Sagar.
- **Color Palette**:
  - *Dominant Canvas (60%)*: Rich dark tea amber (`#1A120B`), warm sepia night (`#26190D`), and heritage cream (`#FBF7F0`).
  - *Structural Surfaces (30%)*: Vintage cafe mahogany (`#3E2723`), brass gold accents (`#D4AF37`), and Irani mint border tiles (`#2D5A4C`).
  - *Accent Budget (10%)*: Saffron orange (`#F97316`), steaming chai amber (`#EAB308`), and streak emerald (`#10B981`).
- **Typography & Hierarchy**:
  - *Display / Titles*: `Plus Jakarta Sans` bold with warm tracking and high-contrast styling.
  - *Prose & Humorous Dialogs*: Clean sans-serif with speech bubble styling.
  - *Numbers & Timers*: Monospaced tabular numerals (`font-mono tabular-nums`) for jitter-free scoreboards and countdown clocks.
- **Interactive Feedback & Motion**:
  - Biscuit physics: Smooth requestAnimationFrame ticker with gravity, wobble, and particle burst upon catch.
  - Steam particle generator floating from the chai cups.
  - Screen shake and playful comic bounce on mistakes and milestones.

---

## 3. Key Product Decisions & Trade-Offs

- **Pure Canvas + React Hybrid vs DOM-Only**:
  - *Decision*: Hybrid approach — HTML5 Canvas engine for ultra-smooth 60fps falling biscuits and particle effects in the arcade mode; reactive UI layer for HUD, menus, upgrades shop, and dialog toasts.
  - *Why*: Ensures zero input lag, perfect collision detection, and instant responsiveness on both mobile touch and desktop trackpads/mice.
- **Synthesized Web Audio vs External MP3s**:
  - *Decision*: Native HTML5 Web Audio API procedural sound engine with zero external asset dependencies.
  - *Why*: Eliminates loading delays, avoids broken asset URLs, and provides immediate crisp sound (steam hiss, biscuit crunch, tea pour, ding, buzzer) with a mute button.
- **Persistence Strategy**:
  - *Decision*: LocalStorage for high scores, lifetime biscuits caught, unlocked Hyderabad landmarks, and cafe upgrades.
  - *Why*: Instant resumption across reloads without requiring server accounts or complex auth.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       App Container                         │
│   (Mode Switcher, Sound Manager, LocalStorage State Sync)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
┌──────────────────────────────┐       ┌──────────────────────────────┐
│    Arcade Biscuit Catcher    │       │     Irani Chai Rush Mode     │
│  - HTML5 Canvas Physics      │       │  - Incremental Clicker Loop  │
│  - Saucer Control & Traps    │       │  - Samovar Steam & Decant    │
│  - Combo & Malai Rush        │       │  - 60s Shift Timer           │
│  - Collision Detection       │       │  - Customer Order Queue      │
└──────────────┬───────────────┘       └──────────────┬───────────────┘
               │                                      │
               └───────────────────────┬──────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Hyderabadi Comedy Engine                 │
│  - Contextual Roasts & Praise based on streak / mistakes    │
│  - Humorous Street Slang Toast Modals                       │
│  - Dynamic Character Reactions (Nimrah Ustaad, Chai Lovers) │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Landmark & Shop Upgrades                   │
│  - Charminar & Nimrah Cafe  · Golconda Fort  · Tank Bund    │
│  - Brass Samovar · Biscuit Machine · Chotu Helper           │
└─────────────────────────────────────────────────────────────┘
```

### Core Entities & State
- **GameMode**: `'MENU' | 'BISCUIT_CATCHER' | 'CHAI_RUSH' | 'UPGRADE_SHOP' | 'ROUND_OVER'`
- **ArcadeState**: Score, Combo, Multiplier, Health/Lives, TimeRemaining, FallingBiscuits list, FloatingParticles list.
- **ChaiRushState**: SamovarTemperature, CupsBrewed, CurrentCupProgress (Tea, Milk, Malai), CustomerPatience, CoinsEarned.
- **PlayerProgression**: Coins, HighScores per mode, UnlockedLandmarks, Upgrades purchased, Achievements unlocked.
- **ComedyRoasts**: Curated list of classic Hyderabadi expressions categorized by `MISS_BISCUIT`, `OVERBOIL_CHAI`, `COLD_TEA`, `HIGH_COMBO`, `ROUND_WIN`.

---

## Verification & Execution Plan
1. Scaffold clean component architecture and Web Audio sound synthesizer.
2. Build Hyderabad Landmark visual backgrounds (Charminar, Golconda Fort, Hussain Sagar).
3. Implement 60fps Biscuit Catcher canvas game engine with touch/mouse controls, combo system, and falling items.
4. Implement Irani Chai Rush clicker with interactive samovar and continuous cup brewing.
5. Integrate funny Hyderabadi banter dialogs and error alerts.
6. Add shop upgrades, high score persistence, and test compilation cleanly.

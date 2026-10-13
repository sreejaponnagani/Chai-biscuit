import React from 'react';
import { LandmarkId } from '../types/game';

interface Props {
  landmarkId: LandmarkId;
  children?: React.ReactNode;
}

export const LandmarkBackground: React.FC<Props> = ({ landmarkId, children }) => {
  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#120b06]">
      {/* Background Skyline Visuals based on landmark */}
      {landmarkId === 'charminar' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Gradient sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b0f07] via-[#2c170b] to-[#140a05]" />
          
          {/* Distant warm street glow & stars */}
          <div className="absolute top-12 left-1/4 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-8 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Charminar Silhouette Vector */}
          <svg
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[420px] text-amber-950/40 opacity-75"
            viewBox="0 0 1000 600"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Base platform */}
            <rect x="250" y="440" width="500" height="160" rx="4" />
            
            {/* Grand Arches */}
            <path d="M 370 600 L 370 420 Q 500 300 630 420 L 630 600 Z" fill="#120803" opacity="0.9" />
            <path d="M 410 600 L 410 440 Q 500 350 590 440 L 590 600 Z" fill="#0d0502" />
            
            {/* Upper gallery */}
            <rect x="290" y="320" width="420" height="120" rx="4" />
            {/* Gallery windows */}
            <rect x="330" y="340" width="30" height="60" rx="15" fill="#1c0f08" />
            <rect x="400" y="340" width="30" height="60" rx="15" fill="#1c0f08" />
            <rect x="470" y="340" width="30" height="60" rx="15" fill="#1c0f08" />
            <rect x="540" y="340" width="30" height="60" rx="15" fill="#1c0f08" />
            <rect x="610" y="340" width="30" height="60" rx="15" fill="#1c0f08" />

            {/* Central Clock & Crown parapet */}
            <rect x="380" y="270" width="240" height="50" rx="2" />
            <circle cx="500" cy="295" r="16" fill="#f59e0b" opacity="0.5" />

            {/* 4 Iconic Minarets */}
            {/* Minaret 1 (Far Left) */}
            <rect x="220" y="160" width="45" height="340" rx="4" />
            <circle cx="242" cy="155" r="28" />
            <path d="M 230 130 L 242 70 L 254 130 Z" />
            <circle cx="242" cy="70" r="4" fill="#f59e0b" />
            <rect x="210" y="260" width="65" height="12" rx="2" />
            <rect x="210" y="360" width="65" height="12" rx="2" />

            {/* Minaret 2 (Inner Left) */}
            <rect x="310" y="200" width="40" height="260" rx="4" opacity="0.8" />
            <circle cx="330" cy="195" r="24" opacity="0.8" />
            <path d="M 320 175 L 330 115 L 340 175 Z" opacity="0.8" />

            {/* Minaret 3 (Inner Right) */}
            <rect x="650" y="200" width="40" height="260" rx="4" opacity="0.8" />
            <circle cx="670" cy="195" r="24" opacity="0.8" />
            <path d="M 660 175 L 670 115 L 680 175 Z" opacity="0.8" />

            {/* Minaret 4 (Far Right) */}
            <rect x="735" y="160" width="45" height="340" rx="4" />
            <circle cx="757" cy="155" r="28" />
            <path d="M 745 130 L 757 70 L 769 130 Z" />
            <circle cx="757" cy="70" r="4" fill="#f59e0b" />
            <rect x="725" y="260" width="65" height="12" rx="2" />
            <rect x="725" y="360" width="65" height="12" rx="2" />

            {/* Nimrah Cafe Signboard on side */}
            <rect x="60" y="470" width="160" height="80" rx="6" fill="#381b0a" opacity="0.9" />
            <text x="140" y="505" fill="#fef08a" fontSize="16" fontWeight="bold" textAnchor="middle">NIMRAH CAFE</text>
            <text x="140" y="528" fill="#fdba74" fontSize="11" textAnchor="middle">ESTD. CHARMINAR</text>
          </svg>
        </div>
      )}

      {landmarkId === 'golconda' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Deep royal night gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a111a] via-[#121c29] to-[#090e15]" />
          <div className="absolute top-10 left-1/3 w-96 h-96 bg-cyan-700/10 rounded-full blur-3xl pointer-events-none" />

          {/* Golconda Fort Battlements and Hills */}
          <svg
            className="absolute bottom-0 left-0 w-full h-[380px] text-slate-900/80"
            viewBox="0 0 1000 400"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Granite hill contour */}
            <path d="M 0 400 L 0 240 Q 250 160 500 220 T 1000 180 L 1000 400 Z" fill="#0f1722" />
            
            {/* Fort wall Crenellations (Ramparts) */}
            <path d="M 100 280 L 100 230 L 120 230 L 120 245 L 140 245 L 140 230 L 160 230 L 160 245 L 180 245 L 180 230 L 200 230 L 200 280 Z" fill="#1e293b" />
            <path d="M 350 250 L 350 190 L 375 190 L 375 205 L 400 205 L 400 190 L 425 190 L 425 205 L 450 205 L 450 190 L 475 190 L 475 250 Z" fill="#1e293b" />
            
            {/* Fateh Darwaza & Royal Arches */}
            <rect x="600" y="210" width="220" height="190" fill="#15202d" rx="6" />
            <path d="M 660 400 L 660 300 Q 710 240 760 300 L 760 400 Z" fill="#090e15" />
            
            {/* Clapping Portico (Echo spot) */}
            <circle cx="710" cy="270" r="14" fill="#38bdf8" opacity="0.4" />
            <text x="710" y="275" fill="#bae6fd" fontSize="10" textAnchor="middle" fontWeight="bold">ECHO</text>
            
            {/* Top Baradari Pavilion */}
            <rect x="360" y="110" width="120" height="70" fill="#15202d" rx="4" />
            <polygon points="350,110 420,70 490,110" fill="#0f1722" />
          </svg>
        </div>
      )}

      {landmarkId === 'hussain_sagar' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Sunset dusk gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b0924] via-[#2f103b] to-[#14061a]" />
          
          {/* Sunset glow behind statue */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Buddha Statue & Lake Shore SVG */}
          <svg
            className="absolute bottom-0 left-0 w-full h-[400px]"
            viewBox="0 0 1000 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Water reflections */}
            <rect x="0" y="260" width="1000" height="140" fill="#0c0411" opacity="0.9" />
            <path d="M 100 300 Q 300 295 500 300 T 900 300" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.25" />
            <path d="M 50 330 Q 300 325 550 330 T 950 330" stroke="#c084fc" strokeWidth="1" strokeOpacity="0.2" />

            {/* Rock of Gibraltar pedestal in water */}
            <polygon points="430,280 570,280 590,320 410,320" fill="#1d1124" />

            {/* Iconic Monolithic Buddha Statue Silhouette */}
            <g transform="translate(500, 150) scale(0.95)">
              {/* Halos */}
              <circle cx="0" cy="20" r="38" fill="#f59e0b" opacity="0.15" />
              {/* Head & Ushnisha */}
              <circle cx="0" cy="5" r="14" fill="#2d1738" />
              <path d="M -4 5 Q 0 -6 4 5 Z" fill="#2d1738" />
              {/* Robe & Torso */}
              <path d="M -22 30 Q 0 25 22 30 L 26 110 Q 0 115 -26 110 Z" fill="#25122f" />
              {/* Raised Right Hand (Abhaya Mudra blessing) */}
              <rect x="14" y="42" width="14" height="26" rx="4" fill="#351a43" />
              <circle cx="21" cy="40" r="6" fill="#351a43" />
            </g>

            {/* Tank Bund street lamps */}
            {[80, 220, 360, 640, 780, 920].map((lx, i) => (
              <g key={i}>
                <line x1={lx} y1={230} x2={lx} y2={280} stroke="#4a225a" strokeWidth="3" />
                <circle cx={lx} cy={228} r="5" fill="#fde68a" opacity="0.75" />
                <circle cx={lx} cy={228} r="14" fill="#fde68a" opacity="0.15" />
              </g>
            ))}
          </svg>
        </div>
      )}

      {landmarkId === 'chowmahalla' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Royal Nizami gold & emerald twilight */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#141209] via-[#241e0d] to-[#100d05]" />
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Chowmahalla Palace Facade */}
          <svg
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[390px] text-yellow-950/40"
            viewBox="0 0 1000 400"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Palace terrace */}
            <rect x="100" y="240" width="800" height="160" fill="#1f180a" />
            {/* Grand columns */}
            {[140, 200, 260, 320, 380, 440, 500, 560, 620, 680, 740, 800].map((colX, idx) => (
              <rect key={idx} x={colX} y={150} width="16" height="110" rx="3" fill="#2d220e" />
            ))}
            {/* Upper Pediment & Nizami Coat of Arms */}
            <polygon points="350,150 500,70 650,150" fill="#2d220e" />
            <circle cx="500" cy="118" r="16" fill="#eab308" opacity="0.5" />
            
            {/* Chandelier Glow */}
            <circle cx="500" cy="180" r="12" fill="#fef08a" opacity="0.6" />
            <circle cx="500" cy="180" r="32" fill="#fef08a" opacity="0.15" />
          </svg>
        </div>
      )}

      {/* Floating Steam Visual Layer */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none overflow-hidden">
        <div className="absolute bottom-4 left-1/4 w-12 h-20 bg-amber-200/5 rounded-full blur-xl animate-steam" />
        <div className="absolute bottom-6 right-1/3 w-16 h-24 bg-amber-100/5 rounded-full blur-xl animate-steam" style={{ animationDelay: '1s' }} />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

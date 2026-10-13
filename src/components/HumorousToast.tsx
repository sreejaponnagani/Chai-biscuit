import React, { useEffect } from 'react';
import { BanterMessage } from '../types/game';
import { X, Flame, Sparkles, AlertCircle, Smile } from 'lucide-react';

interface Props {
  toast: BanterMessage | null;
  onDismiss: () => void;
}

export const HumorousToast: React.FC<Props> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const getMoodStyles = () => {
    switch (toast.mood) {
      case 'angry':
        return {
          bg: 'bg-red-950/95 border-red-500/60 text-red-100',
          badge: 'bg-red-500/20 text-red-300 border-red-500/40',
          icon: <Flame className="w-5 h-5 text-red-400 shrink-0" />,
        };
      case 'proud':
        return {
          bg: 'bg-emerald-950/95 border-emerald-500/60 text-emerald-100',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />,
        };
      case 'warn':
        return {
          bg: 'bg-amber-950/95 border-amber-500/60 text-amber-100',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
        };
      case 'funny':
      default:
        return {
          bg: 'bg-[#29170e]/95 border-amber-600/60 text-amber-100',
          badge: 'bg-amber-600/20 text-amber-300 border-amber-600/40',
          icon: <Smile className="w-5 h-5 text-amber-400 shrink-0" />,
        };
    }
  };

  const style = getMoodStyles();

  return (
    <aside
      aria-label="Hyderabadi Banter Notification"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-lg shadow-2xl animate-bounce duration-300 pointer-events-auto"
    >
      <div
        className={`relative flex items-start gap-3.5 p-4 rounded-xl border backdrop-blur-md shadow-xl ${style.bg}`}
      >
        <div className="p-2 rounded-lg bg-black/40 border border-white/5 shrink-0">
          {style.icon}
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wide uppercase text-amber-300">
              {toast.speaker}
            </span>
            <span className="text-xs text-white/40">·</span>
            <span className="text-xs text-amber-200/60 italic truncate">
              {toast.tagline}
            </span>
          </div>
          <p className="text-sm font-semibold leading-snug tracking-tight text-white/95">
            "{toast.message}"
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          aria-label="Close message"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

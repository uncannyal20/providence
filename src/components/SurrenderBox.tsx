import React, { useState, useRef } from 'react';
import { Feather, CheckCircle2, Trash2, HeartHandshake, History, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { SurrenderedBurden } from '../types';

interface SurrenderBoxProps {
  dayNumber: number;
  dayTheme: string;
  burdens: SurrenderedBurden[];
  dayBurdens: SurrenderedBurden[];
  onSurrender: (text: string, dayTheme: string) => void;
  onRemove: (burdenId: string) => void;
}

export const SurrenderBox: React.FC<SurrenderBoxProps> = ({
  dayNumber,
  dayTheme,
  burdens,
  dayBurdens,
  onSurrender,
  onRemove,
}) => {
  const [burdenText, setBurdenText] = useState('');
  const [isReleasing, setIsReleasing] = useState(false);
  const [justReleasedText, setJustReleasedText] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!burdenText.trim() || isReleasing) return;

    const releasingContent = burdenText.trim();
    setIsReleasing(true);
    setJustReleasedText(releasingContent);

    // Trigger subtle, warm parchment/gold confetti
    try {
      confetti({
        particleCount: 28,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#D4AF37', '#CBBBA0', '#8E7C5D', '#FAF6EE', '#E2D6C0'],
        ticks: 200,
        gravity: 0.8,
        scalar: 0.85,
      });
    } catch {
      // Fallback gracefully if canvas confetti is unavailable
    }

    // After animation, persist to state
    setTimeout(() => {
      onSurrender(releasingContent, dayTheme);
      setBurdenText('');
      setIsReleasing(false);
      setTimeout(() => {
        setJustReleasedText(null);
      }, 3500);
    }, 700);
  };

  const pastBurdens = burdens.filter(b => b.day !== dayNumber);

  return (
    <div className="bg-white/85 border border-parchment-300 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
      
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-sacred-100/60 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-parchment-200/50 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-parchment-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sacred-50 border border-sacred-200 flex items-center justify-center text-sacred-700 shadow-2xs">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              The Surrender Box
            </h3>
            <p className="text-xs text-stone-500">
              Name what you are clinging to or carrying today, and release it into the hands of Divine Providence.
            </p>
          </div>
        </div>

        {burdens.length > 0 && (
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 bg-parchment-100/70 hover:bg-parchment-200 border border-parchment-200 transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-sacred-600" />
            <span>{showHistory ? "Hide Archive" : `All Released Burdens (${burdens.length})`}</span>
          </button>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleRelease} className="relative z-10 space-y-4">
        <div className="relative">
          <label htmlFor="surrender-input" className="sr-only">
            What are you releasing to Providence today?
          </label>
          <input
            id="surrender-input"
            ref={inputRef}
            type="text"
            value={burdenText}
            onChange={(e) => setBurdenText(e.target.value)}
            disabled={isReleasing}
            placeholder="Name an anxiety, plan, resentment, or fear to release..."
            className="w-full px-4 py-3.5 rounded-xl border border-parchment-300 bg-parchment-50/60 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sacred-400 focus:border-sacred-500 text-stone-800 placeholder-stone-400 text-sm sm:text-base font-serif transition-all shadow-2xs"
          />

          {/* Floating affirmative animation during release */}
          {isReleasing && (
            <div className="absolute inset-0 flex items-center justify-center bg-sacred-50/95 backdrop-blur-xs rounded-xl border border-sacred-300 text-sacred-800 font-serif text-base italic animate-fade-out-up shadow-sm">
              <Sparkles className="w-4 h-4 mr-2 text-sacred-500 animate-spin" />
              Releasing into the Father's care...
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <p className="text-xs text-stone-400 italic">
            "Cast all your anxiety on Him, because He cares for you." — 1 Peter 5:7
          </p>

          <button
            type="submit"
            disabled={!burdenText.trim() || isReleasing}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-2xs ${
              burdenText.trim() && !isReleasing
                ? 'bg-sacred-700 hover:bg-sacred-800 text-white shadow-sacred-900/10 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Release to Providence</span>
          </button>
        </div>
      </form>

      {/* Immediate affirmative message banner */}
      {justReleasedText && !isReleasing && (
        <div className="mt-4 p-3 bg-sacred-50 border border-sacred-200/80 rounded-xl text-xs sm:text-sm text-sacred-800 flex items-start gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-sacred-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Burdens surrendered: </span>
            <span className="italic">"{justReleasedText}"</span> has been handed over.
            Rest in the peace of the present moment.
          </div>
        </div>
      )}

      {/* Today's Surrendered Burdens Record */}
      {dayBurdens.length > 0 && (
        <div className="mt-6 pt-5 border-t border-parchment-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-sacred-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sacred-500"></span>
              Surrendered Today (Day {dayNumber})
            </span>
            <span className="text-xs text-stone-400">
              {dayBurdens.length} {dayBurdens.length === 1 ? 'burden' : 'burdens'} released
            </span>
          </div>

          <div className="space-y-2">
            {dayBurdens.map((burden) => (
              <div
                key={burden.id}
                className="group flex items-center justify-between p-3 rounded-xl bg-parchment-100/50 hover:bg-parchment-100/90 border border-parchment-200/80 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-stone-700 text-sm font-serif">
                  <CheckCircle2 className="w-4 h-4 text-sacred-600 shrink-0" />
                  <span className="line-through decoration-sacred-400/80 text-stone-600">
                    {burden.text}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-400 font-sans hidden sm:inline">
                    {new Date(burden.surrenderedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(burden.id)}
                    title="Remove from archive"
                    className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-red-600 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complete Historical Archive View (Collapsible) */}
      {showHistory && (
        <div className="mt-6 pt-5 border-t border-parchment-200 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Providence Archive (All Past Surrenders)
            </span>
            <span className="text-xs text-stone-500">
              {burdens.length} total releases
            </span>
          </div>

          {pastBurdens.length === 0 ? (
            <p className="text-xs text-stone-400 italic py-2">
              All your current surrendered burdens are from today. As you continue the 30 days, your past releases will appear here as a testimony of trust.
            </p>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {pastBurdens.map((burden) => (
                <div
                  key={burden.id}
                  className="p-2.5 rounded-lg bg-white border border-parchment-200 text-xs flex items-center justify-between gap-3 text-stone-600"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded-sm bg-sacred-100 text-sacred-800 font-semibold text-[10px]">
                      Day {burden.day}
                    </span>
                    <span className="line-through text-stone-600 font-serif">
                      {burden.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-stone-400">
                      {new Date(burden.surrenderedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemove(burden.id)}
                      className="text-stone-300 hover:text-red-500 transition-colors cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

import React from 'react';
import { Database, HelpCircle, Sun, Moon, Coffee, HeartHandshake, Lock } from 'lucide-react';

interface HeaderProps {
  currentDay: number;
  completedDaysCount: number;
  burdensCount: number;
  themeMode: 'light' | 'sepia' | 'dark';
  onThemeChange: (mode: 'light' | 'sepia' | 'dark') => void;
  onOpenBackup: () => void;
  onOpenAbout: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDay,
  completedDaysCount,
  burdensCount,
  themeMode,
  onThemeChange,
  onOpenBackup,
  onOpenAbout,
  onLogout,
}) => {
  return (
    <header className="border-b border-parchment-200/80 bg-parchment-50/90 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Logo / Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sacred-100 border border-sacred-200/80 flex items-center justify-center text-sacred-800 shadow-2xs">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5" fill="none">
              <circle cx="16" cy="16" r="14" stroke="#876326" strokeWidth="1.5" strokeDasharray="1.5 2"/>
              <path d="M16 7V25M10 14H22" stroke="#694B1E" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="16" cy="14" r="2" fill="#A78036"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-lg sm:text-xl tracking-wider text-stone-900 leading-none">
                PROVIDENCE
              </h1>
              <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-sacred-100 text-sacred-800 text-[10px] font-semibold tracking-wide uppercase">
                Divine Will
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-serif italic hidden sm:block">
              30-Day Contemplative Journal • Fr. Jean-Pierre de Caussade
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Day & Progress Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-parchment-100/90 border border-parchment-200 text-xs text-stone-700">
            <span className="font-semibold text-sacred-800">Day {currentDay}</span>
            <span className="text-stone-400">•</span>
            <span>{completedDaysCount}/30 done</span>
            {burdensCount > 0 && (
              <>
                <span className="text-stone-400">•</span>
                <span className="inline-flex items-center gap-1 text-sacred-700 font-medium">
                  <HeartHandshake className="w-3 h-3 text-sacred-600" />
                  {burdensCount} released
                </span>
              </>
            )}
          </div>

          {/* Theme switcher */}
          <div className="flex items-center bg-parchment-200/60 p-0.5 rounded-lg border border-parchment-300/60 text-xs">
            <button
              type="button"
              onClick={() => onThemeChange('sepia')}
              title="Parchment theme"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                themeMode === 'sepia' 
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold' 
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onThemeChange('light')}
              title="Light theme"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                themeMode === 'light' 
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold' 
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onThemeChange('dark')}
              title="Monastic dark theme"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                themeMode === 'dark' 
                  ? 'bg-stone-800 text-amber-200 shadow-2xs font-semibold' 
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* About Modal Opener */}
          <button
            type="button"
            onClick={onOpenAbout}
            title="About Jean-Pierre de Caussade & the 4 Phases"
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-parchment-200/80 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Backup & Data Opener */}
          <button
            type="button"
            onClick={onOpenBackup}
            title="Backup & Restore (JSON)"
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-parchment-200/80 transition-colors cursor-pointer"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Lock / Sign Out */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title="Lock Journal"
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-parchment-200/80 transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>
    </header>
  );
};

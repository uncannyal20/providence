import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { useJournalProgress } from './hooks/useJournalProgress';
import { getDayData } from './data/providenceService';
import { Header } from './components/Header';
import { DayNavigator } from './components/DayNavigator';
import { ReadingPane } from './components/ReadingPane';
import { JournalEditor } from './components/JournalEditor';
import { SurrenderBox } from './components/SurrenderBox';
import { ChapterReaderDrawer } from './components/ChapterReaderDrawer';
import { DataManagementModal } from './components/DataManagementModal';
import { AboutModal } from './components/AboutModal';
import { LoginPage } from './components/LoginPage';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function App() {
  const [activeDay, setActiveDay] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('fiat_providence_journal_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.currentDay === 'number' && parsed.currentDay >= 1 && parsed.currentDay <= 30) {
          return parsed.currentDay;
        }
      }
    } catch {}
    return 1;
  });

  // Password authentication state (persisted in localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('providence_auth') === 'true';
    } catch {
      return false;
    }
  });

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('providence_auth');
    } catch {}
    setIsAuthenticated(false);
  }, []);

  // Master persistence hook
  const {
    state,
    currentEntry,
    completedDays,
    burdens,
    dayBurdens,
    saveStatus,
    themeMode,
    setCurrentDay,
    updatePromptResponse,
    updateFreeformNotes,
    toggleDayCompleted,
    surrenderBurden,
    removeBurden,
    setThemeMode,
    exportDataAsJSON,
    importDataFromJSON,
    resetAllProgress,
  } = useJournalProgress(activeDay);

  // Chapter Reader Drawer state
  const [drawerState, setDrawerState] = useState<{
    isOpen: boolean;
    chapterSlug: string;
    sectionId: string;
    excerpt: string;
  }>({
    isOpen: false,
    chapterSlug: 'book-1-chap-1',
    sectionId: '',
    excerpt: '',
  });

  // Modal states
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Sync activeDay with persistence
  const handleSelectDay = useCallback((day: number) => {
    setActiveDay(day);
    setCurrentDay(day);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentDay]);

  const dayData = getDayData(activeDay);

  // Open Chapter Reader Drawer
  const handleOpenChapter = (chapterSlug: string, sectionId: string, excerpt: string) => {
    setDrawerState({
      isOpen: true,
      chapterSlug,
      sectionId,
      excerpt,
    });
  };

  const handleCloseChapter = () => {
    setDrawerState(prev => ({ ...prev, isOpen: false }));
  };

  // Keyboard navigation for previous / next days
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only navigate if not currently typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft' && activeDay > 1 && !drawerState.isOpen) {
        handleSelectDay(activeDay - 1);
      } else if (e.key === 'ArrowRight' && activeDay < 30 && !drawerState.isOpen) {
        handleSelectDay(activeDay + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDay, drawerState.isOpen, handleSelectDay]);

  const themeClass = {
    sepia: 'theme-sepia parchment-texture',
    light: 'theme-light',
    dark: 'theme-dark',
  }[themeMode];

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${themeClass}`}>
      
      {/* 1. Header */}
      <Header
        currentDay={activeDay}
        completedDaysCount={completedDays.length}
        burdensCount={burdens.length}
        themeMode={themeMode}
        onThemeChange={setThemeMode}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        
        {/* 2. Day Navigator & Progress Progression */}
        <DayNavigator
          currentDay={activeDay}
          completedDays={completedDays}
          onSelectDay={handleSelectDay}
        />

        {/* 3. Section 1 & 2: Daily Scripture & Caussade Excerpt */}
        <section aria-label="Daily Readings">
          <ReadingPane
            day={dayData}
            onOpenChapter={handleOpenChapter}
          />
        </section>

        {/* 4. Section 3: Reflect & Surrender Flow */}
        <section aria-label="Reflection and Surrender" className="space-y-6">
          
          {/* Reflect (Journal Editor with Markdown Support & Prompts) */}
          <JournalEditor
            dayNumber={activeDay}
            prompts={dayData.reflection_prompts}
            responses={currentEntry.responses}
            freeformNotes={currentEntry.freeformNotes}
            saveStatus={saveStatus}
            isCompleted={completedDays.includes(activeDay)}
            onResponseChange={(idx, text) => updatePromptResponse(idx, text)}
            onFreeformChange={(notes) => updateFreeformNotes(notes)}
            onToggleCompleted={() => toggleDayCompleted(activeDay)}
          />

          {/* Surrender Box (Anchor Area) */}
          <SurrenderBox
            dayNumber={activeDay}
            dayTheme={dayData.theme}
            burdens={burdens}
            dayBurdens={dayBurdens}
            onSurrender={(text, theme) => surrenderBurden(text, theme)}
            onRemove={(id) => removeBurden(id)}
          />

        </section>

        {/* Bottom Quick Step Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-parchment-300/80">
          <button
            type="button"
            onClick={() => handleSelectDay(activeDay - 1)}
            disabled={activeDay <= 1}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeDay <= 1
                ? 'text-stone-300 cursor-not-allowed'
                : 'text-stone-700 hover:bg-parchment-200/80 bg-white/70 border border-parchment-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous: Day {activeDay - 1}</span>
          </button>

          <span className="text-xs text-stone-500 font-serif italic hidden sm:inline">
            Use <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px]">←</kbd> and <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px]">→</kbd> to browse days
          </span>

          <button
            type="button"
            onClick={() => handleSelectDay(activeDay + 1)}
            disabled={activeDay >= 30}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeDay >= 30
                ? 'text-stone-300 cursor-not-allowed'
                : 'text-stone-700 hover:bg-parchment-200/80 bg-white/70 border border-parchment-300'
            }`}
          >
            <span>Next: Day {activeDay + 1}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </main>

      {/* Contemplative Footer */}
      <footer className="border-t border-parchment-200/80 bg-parchment-100/50 py-8 text-center text-xs text-stone-500 font-serif transition-colors">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="italic text-stone-600 text-sm">
            "The present moment is ever full of infinite treasures; it contains greater riches than you could possibly grasp."
          </p>
          <p className="text-[11px] text-stone-400 font-sans tracking-wide">
            PROVIDENCE • Contemplative 30-Day Journal based on Jean-Pierre de Caussade • 100% Client-Side Privacy
          </p>
        </div>
      </footer>

      {/* In-App Reader Drawer (Unabridged Public Domain Chapter Text) */}
      <ChapterReaderDrawer
        isOpen={drawerState.isOpen}
        onClose={handleCloseChapter}
        chapterSlug={drawerState.chapterSlug}
        highlightSectionId={drawerState.sectionId}
        excerptText={drawerState.excerpt}
      />

      {/* Data & Backup Management Modal */}
      <DataManagementModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        state={state}
        onExport={exportDataAsJSON}
        onImport={importDataFromJSON}
        onReset={resetAllProgress}
      />

      {/* About & Spiritual Guidance Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

    </div>
  );
}

export default App;

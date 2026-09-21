import { useState, useEffect, useCallback, useRef } from 'react';
import type { UserJournalState, JournalEntry, SurrenderedBurden } from '../types';

const STORAGE_KEY = 'fiat_providence_journal_v1';

const DEFAULT_STATE: UserJournalState = {
  version: 1,
  currentDay: 1,
  completedDays: [],
  entries: {},
  burdens: [],
  themeMode: 'sepia',
};

export type SaveStatus = 'saved' | 'saving' | 'unsaved';

export function useJournalProgress(activeDayNumber: number) {
  // Load initial state safely from localStorage
  const [journalState, setJournalState] = useState<UserJournalState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_STATE, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to parse local journal state, using default:', e);
    }
    return DEFAULT_STATE;
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync state to localStorage whenever it changes
  const persistState = useCallback((stateToSave: UserJournalState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      setSaveStatus('saved');
    } catch (err) {
      console.error('Error saving journal to localStorage:', err);
      setSaveStatus('unsaved');
    }
  }, []);

  // Update current active day in state
  const setCurrentDay = useCallback((day: number) => {
    setJournalState(prev => {
      const next = { ...prev, currentDay: day };
      persistState(next);
      return next;
    });
  }, [persistState]);

  // Current day's entry
  const currentEntry: JournalEntry = journalState.entries[activeDayNumber] || {
    day: activeDayNumber,
    responses: {},
    freeformNotes: '',
    completed: journalState.completedDays.includes(activeDayNumber),
    updatedAt: new Date().toISOString(),
  };

  // Debounced updater for responses
  const updatePromptResponse = useCallback((promptIndex: number, text: string) => {
    setSaveStatus('saving');
    setJournalState(prev => {
      const existingEntry = prev.entries[activeDayNumber] || {
        day: activeDayNumber,
        responses: {},
        freeformNotes: '',
        completed: prev.completedDays.includes(activeDayNumber),
        updatedAt: new Date().toISOString(),
      };

      const updatedEntry: JournalEntry = {
        ...existingEntry,
        responses: {
          ...existingEntry.responses,
          [promptIndex]: text,
        },
        updatedAt: new Date().toISOString(),
      };

      const nextState: UserJournalState = {
        ...prev,
        entries: {
          ...prev.entries,
          [activeDayNumber]: updatedEntry,
        },
      };

      // Debounce the disk persistence
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        persistState(nextState);
      }, 500);

      return nextState;
    });
  }, [activeDayNumber, persistState]);

  // Debounced updater for freeform markdown notes
  const updateFreeformNotes = useCallback((notes: string) => {
    setSaveStatus('saving');
    setJournalState(prev => {
      const existingEntry = prev.entries[activeDayNumber] || {
        day: activeDayNumber,
        responses: {},
        freeformNotes: '',
        completed: prev.completedDays.includes(activeDayNumber),
        updatedAt: new Date().toISOString(),
      };

      const updatedEntry: JournalEntry = {
        ...existingEntry,
        freeformNotes: notes,
        updatedAt: new Date().toISOString(),
      };

      const nextState: UserJournalState = {
        ...prev,
        entries: {
          ...prev.entries,
          [activeDayNumber]: updatedEntry,
        },
      };

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        persistState(nextState);
      }, 500);

      return nextState;
    });
  }, [activeDayNumber, persistState]);

  // Toggle day completion
  const toggleDayCompleted = useCallback((targetDay: number = activeDayNumber) => {
    setJournalState(prev => {
      const isAlreadyCompleted = prev.completedDays.includes(targetDay);
      const newCompletedDays = isAlreadyCompleted
        ? prev.completedDays.filter(d => d !== targetDay)
        : [...prev.completedDays, targetDay];

      const existingEntry = prev.entries[targetDay] || {
        day: targetDay,
        responses: {},
        freeformNotes: '',
        completed: false,
        updatedAt: new Date().toISOString(),
      };

      const updatedEntry: JournalEntry = {
        ...existingEntry,
        completed: !isAlreadyCompleted,
        completedAt: !isAlreadyCompleted ? new Date().toISOString() : undefined,
        updatedAt: new Date().toISOString(),
      };

      const nextState: UserJournalState = {
        ...prev,
        completedDays: newCompletedDays,
        entries: {
          ...prev.entries,
          [targetDay]: updatedEntry,
        },
      };

      persistState(nextState);
      return nextState;
    });
  }, [activeDayNumber, persistState]);

  // Surrender Box: Release a burden
  const surrenderBurden = useCallback((burdenText: string, dayTheme: string): SurrenderedBurden => {
    const newBurden: SurrenderedBurden = {
      id: `burden_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      day: activeDayNumber,
      text: burdenText.trim(),
      surrenderedAt: new Date().toISOString(),
      dayTheme,
    };

    setJournalState(prev => {
      const nextState: UserJournalState = {
        ...prev,
        burdens: [newBurden, ...prev.burdens],
      };
      persistState(nextState);
      return nextState;
    });

    return newBurden;
  }, [activeDayNumber, persistState]);

  // Remove / delete a surrendered burden if needed
  const removeBurden = useCallback((burdenId: string) => {
    setJournalState(prev => {
      const nextState: UserJournalState = {
        ...prev,
        burdens: prev.burdens.filter(b => b.id !== burdenId),
      };
      persistState(nextState);
      return nextState;
    });
  }, [persistState]);

  // Set Theme mode
  const setThemeMode = useCallback((mode: 'light' | 'sepia' | 'dark') => {
    setJournalState(prev => {
      const nextState = { ...prev, themeMode: mode };
      persistState(nextState);
      return nextState;
    });
  }, [persistState]);

  // Export all data as JSON
  const exportDataAsJSON = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(journalState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `fiat_journal_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [journalState]);

  // Import JSON backup
  const importDataFromJSON = useCallback((jsonString: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Invalid JSON file format.' };
      }
      
      const validatedState: UserJournalState = {
        version: parsed.version || 1,
        currentDay: typeof parsed.currentDay === 'number' ? parsed.currentDay : 1,
        completedDays: Array.isArray(parsed.completedDays) ? parsed.completedDays : [],
        entries: typeof parsed.entries === 'object' && parsed.entries !== null ? parsed.entries : {},
        burdens: Array.isArray(parsed.burdens) ? parsed.burdens : [],
        themeMode: ['light', 'sepia', 'dark'].includes(parsed.themeMode) ? parsed.themeMode : 'sepia',
      };

      setJournalState(validatedState);
      persistState(validatedState);
      return { success: true, message: 'Journal data restored successfully.' };
    } catch (err) {
      return { success: false, message: `Failed to import: ${(err as Error).message}` };
    }
  }, [persistState]);

  // Reset all progress
  const resetAllProgress = useCallback(() => {
    setJournalState(DEFAULT_STATE);
    persistState(DEFAULT_STATE);
  }, [persistState]);

  // Cleanup any lingering timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    state: journalState,
    currentDay: journalState.currentDay,
    currentEntry,
    completedDays: journalState.completedDays,
    burdens: journalState.burdens,
    dayBurdens: journalState.burdens.filter(b => b.day === activeDayNumber),
    saveStatus,
    themeMode: journalState.themeMode || 'sepia',
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
  };
}

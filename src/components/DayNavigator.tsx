import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Grid, 
  X, 
  Sparkles,
  Compass
} from 'lucide-react';
import { PROVIDENCE_DAYS, PHASES } from '../data/providenceService';

interface DayNavigatorProps {
  currentDay: number;
  completedDays: number[];
  onSelectDay: (day: number) => void;
}

export const DayNavigator: React.FC<DayNavigatorProps> = ({
  currentDay,
  completedDays,
  onSelectDay,
}) => {
  const [isGridModalOpen, setIsGridModalOpen] = useState(false);

  const activeDayData = PROVIDENCE_DAYS.find(d => d.day === currentDay) || PROVIDENCE_DAYS[0];
  const progressPercent = Math.round((completedDays.length / 30) * 100);

  const handlePrev = () => {
    if (currentDay > 1) {
      onSelectDay(currentDay - 1);
    }
  };

  const handleNext = () => {
    if (currentDay < 30) {
      onSelectDay(currentDay + 1);
    }
  };

  return (
    <>
      {/* Top Bar Navigator */}
      <div className="bg-white/90 backdrop-blur-md border border-parchment-300 rounded-2xl p-4 sm:p-5 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Day Title & Phase Info */}
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => setIsGridModalOpen(true)}
              className="group flex-shrink-0 p-2.5 rounded-xl bg-sacred-50 hover:bg-sacred-100 border border-sacred-200 text-sacred-800 transition-colors flex items-center justify-center cursor-pointer"
              title="View all 30 days roadmap"
            >
              <Grid className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-sacred-700">
                  Day {activeDayData.day} of 30
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-500 hidden sm:inline">
                  {activeDayData.phaseTitle}
                </span>
                {completedDays.includes(currentDay) && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Completed
                  </span>
                )}
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-0.5 leading-tight">
                {activeDayData.theme}
              </h2>
            </div>
          </div>

          {/* Stepper Controls & Grid Modal Trigger */}
          <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-parchment-200">
            {/* Quick Progress Mini-Bar */}
            <div className="hidden lg:flex flex-col items-end mr-3">
              <div className="text-[11px] text-stone-500 font-medium">
                {completedDays.length}/30 Days Contemplated ({progressPercent}%)
              </div>
              <div className="w-32 h-1.5 bg-parchment-200 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-sacred-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handlePrev}
              disabled={currentDay <= 1}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-medium cursor-pointer ${
                currentDay <= 1
                  ? 'border-stone-200 text-stone-300 cursor-not-allowed bg-stone-50'
                  : 'border-parchment-300 text-stone-700 hover:bg-parchment-100 hover:border-parchment-400 bg-white'
              }`}
              aria-label="Previous day"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Quick selector / Roadmap opener */}
            <button
              type="button"
              onClick={() => setIsGridModalOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-sacred-300/80 bg-sacred-50/60 hover:bg-sacred-100 text-sacred-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-sacred-700" />
              <span>30-Day Index</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentDay >= 30}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-medium cursor-pointer ${
                currentDay >= 30
                  ? 'border-stone-200 text-stone-300 cursor-not-allowed bg-stone-50'
                  : 'border-parchment-300 text-stone-700 hover:bg-parchment-100 hover:border-parchment-400 bg-white'
              }`}
              aria-label="Next day"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* 30-Day Quick Scroll Bar */}
        <div className="mt-4 pt-3 border-t border-parchment-200 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {PROVIDENCE_DAYS.map((d) => {
            const isSelected = d.day === currentDay;
            const isDone = completedDays.includes(d.day);

            return (
              <button
                key={d.day}
                onClick={() => onSelectDay(d.day)}
                title={`Day ${d.day}: ${d.theme}`}
                className={`flex-shrink-0 w-8 h-8 rounded-lg text-xs font-medium flex items-center justify-center transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-sacred-700 text-white shadow-xs ring-2 ring-sacred-400/50 font-bold scale-105'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300/70 hover:bg-emerald-200'
                    : 'bg-parchment-100/70 text-stone-600 hover:bg-parchment-200/90 border border-parchment-200'
                }`}
              >
                {d.day}
                {isDone && !isSelected && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-1 ring-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 30-Day Full Index Modal / Roadmap */}
      {isGridModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsGridModalOpen(false)}
          />

          <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
            <div className="relative w-full max-w-4xl bg-parchment-50 border border-parchment-300 rounded-3xl shadow-2xl p-6 sm:p-8 animate-fade-in my-8">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-parchment-200 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-sacred-100 text-sacred-800 rounded-xl">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-stone-900">
                      30-Day Contemplative Journey
                    </h3>
                    <p className="text-xs text-stone-500">
                      Select any day to meditate or review your previous reflections.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsGridModalOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-parchment-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Summary Card */}
              <div className="mb-6 p-4 rounded-2xl bg-white border border-parchment-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-sacred-600" />
                  <span className="text-sm font-serif text-stone-800">
                    <strong className="font-semibold">{completedDays.length} of 30</strong> days completed
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <span className="w-3 h-3 rounded-md bg-sacred-700 inline-block"></span>
                    <span>Current Day</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300 inline-block"></span>
                    <span>Completed</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <span className="w-3 h-3 rounded-md bg-parchment-100 border border-parchment-300 inline-block"></span>
                    <span>Unread</span>
                  </div>
                </div>
              </div>

              {/* Phases & Days Grid */}
              <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-1">
                {PHASES.map((phase) => (
                  <div key={phase.phaseNumber} className="border border-parchment-200 rounded-2xl bg-white/70 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4 pb-2 border-b border-parchment-200/60">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-sacred-700 mr-2">
                          Phase {phase.phaseNumber} • {phase.dayRange}
                        </span>
                        <h4 className="font-serif text-lg font-bold text-stone-900 inline">
                          {phase.title}
                        </h4>
                      </div>
                      <p className="text-xs text-stone-500 italic mt-0.5 sm:mt-0">
                        {phase.subtitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                      {phase.days.map((d) => {
                        const isSelected = d.day === currentDay;
                        const isDone = completedDays.includes(d.day);

                        return (
                          <button
                            key={d.day}
                            type="button"
                            onClick={() => {
                              onSelectDay(d.day);
                              setIsGridModalOpen(false);
                            }}
                            className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-sacred-700 text-white border-sacred-800 shadow-md ring-2 ring-sacred-400'
                                : isDone
                                ? 'bg-emerald-50/80 hover:bg-emerald-100 border-emerald-200 text-stone-800'
                                : 'bg-parchment-50 hover:bg-parchment-100 border-parchment-200 text-stone-700'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className={`text-xs font-bold ${isSelected ? 'text-sacred-200' : 'text-stone-500'}`}>
                                Day {d.day}
                              </span>
                              {isDone ? (
                                <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                              ) : (
                                <Circle className={`w-3.5 h-3.5 ${isSelected ? 'text-sacred-300' : 'text-stone-300'}`} />
                              )}
                            </div>
                            <span className={`font-serif text-sm font-semibold line-clamp-2 leading-tight ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                              {d.theme}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="mt-6 pt-4 border-t border-parchment-200 text-right">
                <button
                  type="button"
                  onClick={() => setIsGridModalOpen(false)}
                  className="px-5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold tracking-wide transition-colors"
                >
                  Close Index
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

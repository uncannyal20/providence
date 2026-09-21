import React, { useEffect, useRef, useState } from 'react';
import { X, BookOpen, ZoomIn, ZoomOut } from 'lucide-react';
import type { FullChapter } from '../types';
import { getChapterBySlug } from '../data/providenceService';

interface ChapterReaderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chapterSlug: string;
  highlightSectionId?: string;
  excerptText?: string;
}

export const ChapterReaderDrawer: React.FC<ChapterReaderDrawerProps> = ({
  isOpen,
  onClose,
  chapterSlug,
  highlightSectionId,
  excerptText,
}) => {
  const chapter: FullChapter | undefined = getChapterBySlug(chapterSlug);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('large');
  const targetSectionRef = useRef<HTMLDivElement | null>(null);
  const drawerBodyRef = useRef<HTMLDivElement | null>(null);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Auto-scroll to highlighted section after drawer opens
  useEffect(() => {
    if (isOpen && (highlightSectionId || targetSectionRef.current)) {
      const timer = setTimeout(() => {
        if (targetSectionRef.current) {
          targetSectionRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        } else if (highlightSectionId) {
          const el = document.getElementById(`chapter-sec-${highlightSectionId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 350); // wait for slide-over transition

      return () => clearTimeout(timer);
    }
  }, [isOpen, highlightSectionId, chapterSlug]);

  if (!isOpen || !chapter) return null;

  const fontClasses = {
    normal: 'text-base leading-relaxed',
    large: 'text-lg leading-loose',
    larger: 'text-xl leading-loose',
  }[fontSize];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-16">
        <div className="w-screen max-w-2xl bg-parchment-50 border-l border-parchment-200 shadow-2xl flex flex-col animate-slide-in-right">
          
          {/* Drawer Header */}
          <div className="px-6 py-4 border-b border-parchment-200 bg-parchment-100/80 backdrop-blur flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-sacred-100 text-sacred-800 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs uppercase tracking-widest text-sacred-700 font-semibold">
                  {chapter.book} • Chapter {chapter.chapter_number}
                </span>
                <h3 className="text-stone-900 font-serif font-bold text-base sm:text-lg line-clamp-1">
                  {chapter.chapter_title}
                </h3>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Font Sizer */}
              <div className="hidden sm:flex items-center bg-parchment-200/60 rounded-md p-0.5 border border-parchment-300/60 text-xs">
                <button
                  type="button"
                  title="Smaller text"
                  onClick={() => setFontSize('normal')}
                  className={`px-2 py-1 rounded transition-colors ${fontSize === 'normal' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Medium text"
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-1 rounded transition-colors ${fontSize === 'large' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  A
                </button>
                <button
                  type="button"
                  title="Larger text"
                  onClick={() => setFontSize('larger')}
                  className={`px-2 py-1 rounded transition-colors ${fontSize === 'larger' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-stone-500 hover:text-stone-800 hover:bg-parchment-200 rounded-lg transition-colors"
                aria-label="Close chapter reader"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Section Pill Bar */}
          <div className="px-6 py-2 bg-parchment-100/40 border-b border-parchment-200/60 flex items-center gap-2 overflow-x-auto text-xs text-stone-600 no-scrollbar">
            <span className="font-semibold text-stone-400 shrink-0 uppercase tracking-wider text-[10px]">Sections:</span>
            {chapter.sections.map((sec, idx) => {
              const isTarget = sec.id === highlightSectionId;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    const el = document.getElementById(`chapter-sec-${sec.id}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`shrink-0 px-2.5 py-1 rounded-full text-xs transition-all ${
                    isTarget 
                      ? 'bg-sacred-200 text-sacred-900 font-semibold border border-sacred-400/50' 
                      : 'bg-white/80 hover:bg-parchment-200 text-stone-700 border border-parchment-200'
                  }`}
                >
                  § {sec.section_number || idx + 1}
                </button>
              );
            })}
          </div>

          {/* Content Body */}
          <div 
            ref={drawerBodyRef}
            className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 space-y-10 focus:outline-hidden"
            tabIndex={0}
          >
            {/* Treatise Header */}
            <div className="text-center pb-6 border-b border-parchment-200">
              <span className="text-xs uppercase tracking-widest text-sacred-600 font-medium">
                Abandonment to Divine Providence • Father Jean-Pierre de Caussade
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-2 mb-2">
                {chapter.chapter_title}
              </h1>
              <p className="text-xs text-stone-500 italic">
                {chapter.book_title}
              </p>
            </div>

            {/* Sections */}
            {chapter.sections.map((section, sIdx) => {
              const isTarget = section.id === highlightSectionId;
              return (
                <div
                  key={section.id}
                  id={`chapter-sec-${section.id}`}
                  ref={isTarget ? targetSectionRef : null}
                  className={`scroll-mt-24 transition-all duration-700 rounded-xl ${
                    isTarget 
                      ? 'p-5 -mx-3 sm:-mx-4 bg-amber-50/70 border-2 border-amber-300/80 shadow-md ring-4 ring-amber-100/50' 
                      : 'p-0'
                  }`}
                >
                  {isTarget && (
                    <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-sacred-600 text-white rounded-full text-xs font-semibold tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      Today's Selected Excerpt in Context
                    </div>
                  )}

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-4 flex items-baseline gap-2">
                    <span className="text-sacred-700 font-sans text-sm font-semibold tracking-wider">
                      § {section.section_number || sIdx + 1}.
                    </span>
                    <span>{section.title}</span>
                  </h3>

                  <div className={`space-y-4 font-serif text-stone-800 ${fontClasses}`}>
                    {section.paragraphs.map((p, pIdx) => {
                      const containsExcerpt = excerptText && p.includes(excerptText.substring(0, 40));
                      return (
                        <p
                          key={pIdx}
                          className={`${
                            sIdx === 0 && pIdx === 0 ? 'serif-dropcap' : ''
                          } ${
                            containsExcerpt 
                              ? 'bg-amber-100/70 px-3 py-1.5 rounded-sm border-l-4 border-sacred-600 font-medium' 
                              : ''
                          }`}
                        >
                          {p}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Footer notice */}
            <div className="pt-8 pb-4 border-t border-parchment-200 text-center text-xs text-stone-400 space-y-1">
              <p>Public Domain text from *L'Abandon à la Providence Divine* by Rev. J.P. de Caussade, S.J.</p>
              <p>Preserved for contemplative meditation and personal devotion.</p>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="px-6 py-3 border-t border-parchment-200 bg-parchment-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              Press <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[11px] font-mono">Esc</kbd> to return to your journal
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-sacred-700 hover:bg-sacred-800 text-white rounded-lg text-xs font-semibold tracking-wide transition-colors"
            >
              Back to Journal
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

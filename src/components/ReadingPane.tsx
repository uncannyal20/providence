import React, { useState } from 'react';
import { BookOpen, Quote, Volume2, VolumeX, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import type { ProvidenceDay } from '../types';

interface ReadingPaneProps {
  day: ProvidenceDay;
  onOpenChapter: (chapterSlug: string, sectionId: string, excerpt: string) => void;
}

export const ReadingPane: React.FC<ReadingPaneProps> = ({ day, onOpenChapter }) => {
  const [copiedScripture, setCopiedScripture] = useState(false);
  const [copiedExcerpt, setCopiedExcerpt] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Copy helper
  const handleCopy = (text: string, type: 'scripture' | 'excerpt') => {
    navigator.clipboard.writeText(text);
    if (type === 'scripture') {
      setCopiedScripture(true);
      setTimeout(() => setCopiedScripture(false), 2000);
    } else {
      setCopiedExcerpt(true);
      setTimeout(() => setCopiedExcerpt(false), 2000);
    }
  };

  // Text-to-speech reflection reader
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const readingText = `Day ${day.day}. ${day.theme}. Scripture: ${day.scripture.reference}. ${day.scripture.text}. Excerpt from Father Jean-Pierre de Caussade: ${day.de_caussade.excerpt}`;
      const utterance = new SpeechSynthesisUtterance(readingText);
      utterance.rate = 0.88; // Calm, meditative pace
      utterance.pitch = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* SECTION 1: SCRIPTURE PASSAGE */}
      <div className="bg-white/90 border border-parchment-200 rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden group">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-sacred-600 rounded-full"></span>
            <span className="text-xs font-semibold text-sacred-800 uppercase tracking-widest">
              Daily Scripture
            </span>
          </div>

          <div className="flex items-center gap-2">
            {'speechSynthesis' in window && (
              <button
                type="button"
                onClick={toggleSpeech}
                title={isSpeaking ? "Stop listening" : "Listen to today's reading"}
                className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isSpeaking 
                    ? 'bg-sacred-100 text-sacred-800 font-medium' 
                    : 'text-stone-400 hover:text-stone-700 hover:bg-parchment-100'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="text-[11px] hidden sm:inline">{isSpeaking ? 'Pause' : 'Listen'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleCopy(`"${day.scripture.text}" — ${day.scripture.reference}`, 'scripture')}
              title="Copy scripture"
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-parchment-100 transition-colors cursor-pointer"
            >
              {copiedScripture ? <Check className="w-4 h-4 text-sacred-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <blockquote className="font-serif text-lg sm:text-xl text-stone-800 leading-relaxed italic pr-4 pl-1">
          "{day.scripture.text}"
        </blockquote>

        <div className="mt-3 text-right">
          <span className="text-xs font-semibold font-sans tracking-wide text-sacred-700 bg-sacred-50 px-2.5 py-1 rounded-md border border-sacred-200/60">
            {day.scripture.reference}
          </span>
        </div>
      </div>

      {/* SECTION 2: JEAN-PIERRE DE CAUSSADE EXCERPT */}
      <div className="bg-white/95 border border-parchment-300 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        
        {/* Decorative Quote Mark */}
        <Quote className="absolute -top-3 -right-3 w-28 h-28 text-parchment-200/40 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-parchment-200/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-sacred-500 rounded-full"></span>
              <span className="text-xs font-semibold text-sacred-800 uppercase tracking-widest">
                Jean-Pierre de Caussade
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500 italic">
                Abandonment to Divine Providence
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(day.de_caussade.excerpt, 'excerpt')}
              title="Copy excerpt"
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-parchment-100 transition-colors cursor-pointer"
            >
              {copiedExcerpt ? <Check className="w-4 h-4 text-sacred-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Core Excerpt Text */}
          <div className="font-serif text-stone-800 text-lg sm:text-xl leading-relaxed sm:leading-loose">
            <p className="serif-dropcap">
              {day.de_caussade.excerpt}
            </p>
          </div>

          {/* Key Quote Callout */}
          <div className="mt-6 p-4 rounded-xl bg-sacred-50/70 border-l-4 border-sacred-600 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-sacred-600 shrink-0 mt-0.5" />
            <p className="text-sm font-serif italic text-sacred-950 font-medium">
              "{day.key_quote}"
            </p>
          </div>

          {/* INLINE BADGE / LINK: READ FULL CHAPTER IN CONTEXT */}
          <div className="mt-6 pt-5 border-t border-parchment-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-stone-500">
              <span className="font-semibold text-stone-700">Source:</span> {day.de_caussade.book}, {day.de_caussade.chapter}
            </div>

            <button
              type="button"
              onClick={() => onOpenChapter(
                day.de_caussade.full_chapter_slug,
                day.de_caussade.section_id,
                day.de_caussade.excerpt
              )}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-parchment-100 hover:bg-sacred-100 text-sacred-900 border border-sacred-200/80 text-xs sm:text-sm font-semibold transition-all hover:shadow-xs group/btn cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-sacred-700 group-hover/btn:scale-110 transition-transform" />
              <span>Read Full Chapter in Context ({day.de_caussade.book}, {day.de_caussade.chapter})</span>
              <ExternalLink className="w-3.5 h-3.5 text-sacred-600 ml-0.5" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

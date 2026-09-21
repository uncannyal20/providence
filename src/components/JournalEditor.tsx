import React, { useState } from 'react';
import { PenLine, CheckCircle, Clock, Eye, Edit3, Check, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { SaveStatus } from '../hooks/useJournalProgress';

interface JournalEditorProps {
  dayNumber: number;
  prompts: string[];
  responses: Record<number, string>;
  freeformNotes?: string;
  saveStatus: SaveStatus;
  isCompleted: boolean;
  onResponseChange: (promptIndex: number, text: string) => void;
  onFreeformChange: (notes: string) => void;
  onToggleCompleted: () => void;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({
  dayNumber,
  prompts,
  responses,
  freeformNotes = '',
  saveStatus,
  isCompleted,
  onResponseChange,
  onFreeformChange,
  onToggleCompleted,
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // Simple markdown renderer for preview tab
  const renderMarkdownPreview = (text: string) => {
    if (!text.trim()) {
      return <p className="text-stone-400 italic">No thoughts written yet for this prompt.</p>;
    }

    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Heading
      if (line.startsWith('### ')) {
        return <h4 key={i} className="font-serif font-bold text-base text-stone-900 mt-2 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={i} className="font-serif font-bold text-lg text-stone-900 mt-3 mb-1">{line.replace('## ', '')}</h3>;
      }
      // Bullets
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={i} className="ml-4 list-disc text-stone-700 font-serif">
            {line.replace(/^[-*]\s+/, '')}
          </li>
        );
      }
      // Blockquote
      if (line.startsWith('> ')) {
        return (
          <blockquote key={i} className="border-l-2 border-sacred-400 pl-3 italic text-stone-600 my-1 font-serif">
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      // Normal paragraph
      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }
      return <p key={i} className="text-stone-800 font-serif leading-relaxed mb-1">{line}</p>;
    });
  };

  // Quick markdown insert helper
  const insertMarkdownSyntax = (promptIdx: number, prefix: string, suffix: string = '') => {
    const currentText = responses[promptIdx] || '';
    const newText = currentText + `${prefix}text${suffix}`;
    onResponseChange(promptIdx, newText);
  };

  const handleCompleteClick = () => {
    if (!isCompleted) {
      try {
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#D4AF37', '#9B6E06', '#E4D1A7', '#4B6A5D'],
        });
      } catch {}
    }
    onToggleCompleted();
  };

  // Calculate total words written across prompts
  const totalWords = Object.values(responses).reduce((sum, text) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return sum + words;
  }, 0) + (freeformNotes.trim() ? freeformNotes.trim().split(/\s+/).length : 0);

  return (
    <div className="bg-white/95 border border-parchment-300 rounded-2xl p-6 sm:p-8 shadow-xs">
      
      {/* Header with Autosave Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-parchment-200 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-parchment-100 border border-parchment-200 flex items-center justify-center text-sacred-700">
            <PenLine className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Reflect & Contemplate
            </h3>
            <p className="text-xs text-stone-500">
              Listen to the movements of grace. Write your honest interior reflections.
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3 text-xs">
          {saveStatus === 'saving' && (
            <span className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 font-medium animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="inline-flex items-center gap-1.5 text-stone-500 bg-parchment-100 px-2.5 py-1 rounded-md border border-parchment-200">
              <Check className="w-3.5 h-3.5 text-sacred-600" />
              Saved locally
            </span>
          )}

          {/* Write / Preview Mode Toggle */}
          <div className="flex items-center bg-parchment-200/70 p-0.5 rounded-lg border border-parchment-300/60">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'write' ? 'bg-white shadow-2xs text-stone-900 font-medium' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Edit3 className="w-3 h-3" />
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'preview' ? 'bg-white shadow-2xs text-stone-900 font-medium' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Eye className="w-3 h-3" />
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Prompts Section */}
      <div className="space-y-6">
        {prompts.map((prompt, pIdx) => {
          const promptValue = responses[pIdx] || '';
          return (
            <div 
              key={pIdx}
              className="p-5 rounded-xl bg-parchment-50/70 border border-parchment-200 space-y-3"
            >
              {/* Prompt Question */}
              <div className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sacred-100 border border-sacred-300/80 text-sacred-800 text-xs font-bold flex items-center justify-center font-sans mt-0.5">
                  {pIdx + 1}
                </span>
                <p className="font-serif text-base sm:text-lg font-medium text-stone-800 leading-snug">
                  {prompt}
                </p>
              </div>

              {/* Markdown Quick Toolbar in Write Mode */}
              {activeTab === 'write' && (
                <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax(pIdx, '**', '**')}
                      className="px-2 py-0.5 bg-white border border-stone-200 rounded hover:bg-parchment-100 font-semibold cursor-pointer"
                      title="Bold (**text**)"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax(pIdx, '*', '*')}
                      className="px-2 py-0.5 bg-white border border-stone-200 rounded hover:bg-parchment-100 italic font-serif cursor-pointer"
                      title="Italic (*text*)"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax(pIdx, '- ')}
                      className="px-2 py-0.5 bg-white border border-stone-200 rounded hover:bg-parchment-100 cursor-pointer"
                      title="List (- item)"
                    >
                      • List
                    </button>
                  </div>
                  <span className="text-[11px] text-stone-400">
                    {promptValue.trim() ? `${promptValue.trim().split(/\s+/).length} words` : 'Empty'}
                  </span>
                </div>
              )}

              {/* Input Area or Preview */}
              {activeTab === 'write' ? (
                <textarea
                  rows={4}
                  value={promptValue}
                  onChange={(e) => onResponseChange(pIdx, e.target.value)}
                  placeholder="Record your prayer, observations, and inner movements..."
                  className="w-full p-3.5 rounded-xl border border-parchment-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-sacred-400 focus:border-sacred-500 text-stone-800 font-serif text-sm sm:text-base leading-relaxed placeholder-stone-400 resize-y shadow-2xs"
                />
              ) : (
                <div className="p-3.5 rounded-xl bg-white border border-parchment-200 min-h-[5rem] text-sm">
                  {renderMarkdownPreview(promptValue)}
                </div>
              )}
            </div>
          );
        })}

        {/* Freeform Contemplative Notes */}
        <div className="p-5 rounded-xl bg-white border border-parchment-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
              Freeform Prayer & Personal Notes (Optional)
            </span>
            <span className="text-[11px] text-stone-400">
              {freeformNotes.trim() ? `${freeformNotes.trim().split(/\s+/).length} words` : ''}
            </span>
          </div>

          {activeTab === 'write' ? (
            <textarea
              rows={3}
              value={freeformNotes}
              onChange={(e) => onFreeformChange(e.target.value)}
              placeholder="Any additional thoughts, scripture verses, or quiet petitions..."
              className="w-full p-3 rounded-xl border border-parchment-300 bg-parchment-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sacred-400 focus:border-sacred-500 text-stone-800 font-serif text-sm sm:text-base leading-relaxed placeholder-stone-400 resize-y"
            />
          ) : (
            <div className="p-3 rounded-xl bg-parchment-50/50 border border-parchment-200 min-h-[4rem] text-sm">
              {renderMarkdownPreview(freeformNotes)}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Completion Bar */}
      <div className="mt-8 pt-5 border-t border-parchment-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs text-stone-500">
          <span className="font-semibold text-stone-700">{totalWords} words</span> written for Day {dayNumber}.
          All entries are kept 100% private in local storage.
        </div>

        <button
          type="button"
          onClick={handleCompleteClick}
          className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-xs cursor-pointer ${
            isCompleted
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
              : 'bg-sacred-700 hover:bg-sacred-800 text-white hover:shadow-md'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-200" />
              <span>Completed Day {dayNumber} (Click to Undo)</span>
            </>
          ) : (
            <>
              <Award className="w-4 h-4 text-sacred-200" />
              <span>Mark Day {dayNumber} as Completed</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

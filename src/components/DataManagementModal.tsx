import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  ShieldCheck, 
  Printer, 
  Trash2, 
  FileJson, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import type { UserJournalState } from '../types';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: UserJournalState;
  onExport: () => void;
  onImport: (jsonString: string) => { success: boolean; message: string };
  onReset: () => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  state,
  onExport,
  onImport,
  onReset,
}) => {
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = onImport(content);
        setImportStatus(result);
        if (result.success) {
          setTimeout(() => {
            setImportStatus(null);
            onClose();
          }, 1500);
        }
      }
    };
    reader.readAsText(file);
  };

  const handlePrint = () => {
    window.print();
  };

  const completedCount = state.completedDays.length;
  const entriesCount = Object.keys(state.entries).length;
  const burdensCount = state.burdens.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-xl bg-parchment-50 border border-parchment-300 rounded-3xl shadow-2xl p-6 sm:p-8 animate-fade-in my-8">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-parchment-200 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sacred-100 text-sacred-800 rounded-xl">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  Data & Backup Management
                </h3>
                <p className="text-xs text-stone-500">
                  Manage your private journal reflections and local storage backup.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-parchment-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Privacy Notice Card */}
          <div className="mb-6 p-4 rounded-2xl bg-sacred-50/80 border border-sacred-200/80 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-sacred-700 shrink-0 mt-0.5" />
            <div className="text-xs text-sacred-950 space-y-1">
              <span className="font-bold">100% Client-Side Privacy Guarantee</span>
              <p className="text-sacred-900/90 leading-relaxed">
                Your entries, prayers, and surrendered burdens are stored solely in your personal browser storage. No servers, zero analytics, zero external tracking.
              </p>
            </div>
          </div>

          {/* Journal Summary Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 bg-white rounded-xl border border-parchment-200 text-center">
              <div className="text-lg sm:text-xl font-serif font-bold text-stone-900">{completedCount}/30</div>
              <div className="text-[11px] text-stone-500">Days Done</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-parchment-200 text-center">
              <div className="text-lg sm:text-xl font-serif font-bold text-stone-900">{entriesCount}</div>
              <div className="text-[11px] text-stone-500">Day Notes</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-parchment-200 text-center">
              <div className="text-lg sm:text-xl font-serif font-bold text-stone-900">{burdensCount}</div>
              <div className="text-[11px] text-stone-500">Burden Logs</div>
            </div>
          </div>

          {/* Actions List */}
          <div className="space-y-3">
            {/* Export JSON */}
            <div className="p-4 rounded-xl bg-white border border-parchment-200 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-stone-900">Export Backup (JSON)</h4>
                <p className="text-xs text-stone-500">Download a complete backup file to your computer.</p>
              </div>
              <button
                type="button"
                onClick={onExport}
                className="px-4 py-2 bg-sacred-700 hover:bg-sacred-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>

            {/* Import JSON */}
            <div className="p-4 rounded-xl bg-white border border-parchment-200 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-stone-900">Import Backup (JSON)</h4>
                <p className="text-xs text-stone-500">Restore your reflections from a previous backup.</p>
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose File</span>
                </button>
              </div>
            </div>

            {/* Print Friendly View */}
            <div className="p-4 rounded-xl bg-white border border-parchment-200 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-stone-900">Print / Save as PDF</h4>
                <p className="text-xs text-stone-500">Open printer dialog formatted for contemplation binder.</p>
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 border border-parchment-300 hover:bg-parchment-100 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Page</span>
              </button>
            </div>
          </div>

          {/* Import Status Feedback */}
          {importStatus && (
            <div className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
              importStatus.success 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {importStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          {/* Reset Safeguard Area */}
          <div className="mt-6 pt-5 border-t border-parchment-200">
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="text-xs text-stone-400 hover:text-red-600 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Stored Journal Data</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-2">
                <p className="font-semibold text-rose-900">
                  Are you sure you want to erase all entries and surrendered burdens?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onReset();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold cursor-pointer"
                  >
                    Yes, Erase Everything
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1 bg-white border border-stone-300 text-stone-700 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

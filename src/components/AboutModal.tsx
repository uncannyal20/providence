import React from 'react';
import { X, BookHeart, Sparkles } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-2xl bg-parchment-50 border border-parchment-300 rounded-3xl shadow-2xl p-6 sm:p-8 animate-fade-in my-8">
          
          <div className="flex items-center justify-between border-b border-parchment-200 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sacred-100 text-sacred-800 rounded-xl">
                <BookHeart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  About Abandonment to Divine Providence
                </h3>
                <p className="text-xs text-stone-500">
                  Jean-Pierre de Caussade, S.J. (1675–1751)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-parchment-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 font-serif text-stone-800 text-base leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
            <p className="serif-dropcap">
              Fr. Jean-Pierre de Caussade was a French Jesuit spiritual director best remembered for his spiritual letters and conferences to the Sisters of the Visitation in Nancy, France.
            </p>

            <p>
              His core insight—often summarized as <em>The Sacrament of the Present Moment</em>—is that holiness does not require extraordinary feats, distant pilgrimages, or complex intellectual systems. Rather, God conceals His presence and His sanctifying will under the ordinary accidents and duties of this exact moment.
            </p>

            <div className="p-4 bg-sacred-50 rounded-2xl border border-sacred-200/80 my-4">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-sacred-700 shrink-0 mt-1" />
                <p className="font-serif text-sm italic text-sacred-950">
                  "Every moment is like an ambassador of the divine will... The soul that wants only what God wants is invulnerable."
                </p>
              </div>
            </div>

            <h4 className="font-serif font-bold text-lg text-stone-900 pt-2">
              The Four Phases of the 30-Day Journey
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
              <div className="p-3 bg-white rounded-xl border border-parchment-200">
                <span className="font-bold text-sacred-800 uppercase tracking-wider block mb-1">
                  Phase 1 (Days 1–7)
                </span>
                <span className="font-semibold text-stone-900 block mb-0.5">Understanding Divine Action</span>
                <span className="text-stone-500">Recognizing God's hidden hand in everyday events and simple duties.</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-parchment-200">
                <span className="font-bold text-sacred-800 uppercase tracking-wider block mb-1">
                  Phase 2 (Days 8–15)
                </span>
                <span className="font-semibold text-stone-900 block mb-0.5">The Heart of Abandonment</span>
                <span className="text-stone-500">The power of the Mary-like 'Fiat' and yielding the helm of life to God.</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-parchment-200">
                <span className="font-bold text-sacred-800 uppercase tracking-wider block mb-1">
                  Phase 3 (Days 16–22)
                </span>
                <span className="font-semibold text-stone-900 block mb-0.5">Freedom from Self-Direction</span>
                <span className="text-stone-500">Dismantling anxious self-scheming and welcoming unexpected interruptions.</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-parchment-200">
                <span className="font-bold text-sacred-800 uppercase tracking-wider block mb-1">
                  Phase 4 (Days 23–30)
                </span>
                <span className="font-semibold text-stone-900 block mb-0.5">Consolation & Interior Freedom</span>
                <span className="text-stone-500">The fire of divine purification, holy indifference, and perpetual peace.</span>
              </div>
            </div>

            <h4 className="font-serif font-bold text-lg text-stone-900 pt-2">
              The Meaning of "Fiat"
            </h4>
            <p className="text-sm font-serif">
              <em>Fiat</em> is the Latin word meaning <em>"Let it be done"</em>. It echoes Genesis 1 ("Fiat lux"), the Annunciation ("Fiat mihi secundum verbum tuum"), and Christ's prayer in Gethsemane ("Fiat voluntas tua"). In this journal, each day invites you into that sacred consent.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-parchment-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-sacred-700 hover:bg-sacred-800 text-white rounded-xl text-xs font-semibold tracking-wide transition-colors cursor-pointer"
            >
              Begin Reflection
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

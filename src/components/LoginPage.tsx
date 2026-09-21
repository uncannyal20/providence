import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const CORRECT_PASSWORD = 'jesuslovesme2';

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const inputPassword = password.trim();

    if (!inputPassword) {
      setError('Please enter the password to enter.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (inputPassword.toLowerCase() === CORRECT_PASSWORD.toLowerCase()) {
        localStorage.setItem('providence_auth', 'true');
        onLogin();
      } else {
        setError('Incorrect password. Please try again.');
        setIsSubmitting(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen parchment-texture bg-parchment-50 flex flex-col justify-between items-center p-4 sm:p-6 text-stone-800 selection:bg-sacred-200">
      
      {/* Top spacer */}
      <div className="w-full pt-4 flex justify-center">
        <span className="text-[11px] font-semibold text-sacred-800 uppercase tracking-widest bg-sacred-100/70 border border-sacred-200 px-3 py-1 rounded-full">
          Private Spiritual Sanctuary
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md my-auto animate-fade-in">
        <div className="bg-white/90 backdrop-blur-md border border-parchment-300 rounded-3xl p-7 sm:p-9 shadow-xl relative overflow-hidden">
          
          {/* Subtle warm decorative glow */}
          <div className="absolute -top-14 -right-14 w-40 h-40 bg-sacred-100/70 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-14 -left-14 w-40 h-40 bg-parchment-200/60 rounded-full blur-2xl pointer-events-none" />

          {/* Logo & Header */}
          <div className="text-center relative z-10 mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-sacred-50 border border-sacred-200 flex items-center justify-center text-sacred-800 mb-4 shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-8 h-8" fill="none">
                <circle cx="16" cy="16" r="14" stroke="#876326" strokeWidth="1.5" strokeDasharray="1.5 2"/>
                <path d="M16 7V25M10 14H22" stroke="#694B1E" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="16" cy="14" r="2" fill="#A78036"/>
              </svg>
            </div>

            <h1 className="font-serif text-3xl font-bold text-stone-900 tracking-wider mb-1">
              PROVIDENCE
            </h1>
            <p className="text-xs text-stone-500 font-serif italic">
              Abandonment to Divine Providence • 30-Day Contemplative Journal
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-1.5">
              <label 
                htmlFor="journal-password" 
                className="block text-xs font-semibold text-stone-700 tracking-wide uppercase"
              >
                Enter Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <KeyRound className="w-4 h-4" />
                </div>

                <input
                  id="journal-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter journal password..."
                  autoFocus
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-parchment-300 bg-parchment-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sacred-400 focus:border-sacred-500 text-stone-900 text-sm font-sans placeholder-stone-400 transition-all shadow-2xs"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <p className="text-xs text-rose-600 pt-1 font-medium animate-fade-in">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-sacred-700 hover:bg-sacred-800 text-white font-medium text-sm rounded-xl transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-sacred-200" />
                  <span>Entering sanctuary...</span>
                </>
              ) : (
                <>
                  <span>Enter Journal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Privacy Footnote */}
          <div className="mt-6 pt-5 border-t border-parchment-200 flex items-center justify-center gap-2 text-stone-400 text-xs text-center">
            <ShieldCheck className="w-4 h-4 text-sacred-700 shrink-0" />
            <span>Private client-side storage • No external servers</span>
          </div>

        </div>
      </div>

      {/* Footer Scriptural Quote */}
      <div className="w-full pb-4 text-center">
        <p className="text-xs text-stone-500 font-serif italic">
          "Be still, and know that I am God." — Psalm 46:10
        </p>
      </div>

    </div>
  );
};

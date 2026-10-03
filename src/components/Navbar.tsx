import React from 'react';
import {
  ShieldCheck,
  Smartphone,
  BookOpen,
  Layout,
  Columns,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Member } from '../types';

export type ViewMode = 'portal' | 'inspector' | 'split';

interface NavbarProps {
  member: Member | null;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onOpenPhoneSimulation: () => void;
  smsCount: number;
  onOpenGuide: () => void;
  onOpenAuth: () => void;
  secondLookScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  member,
  viewMode,
  onChangeViewMode,
  onOpenPhoneSimulation,
  smsCount,
  onOpenGuide,
  onOpenAuth,
  secondLookScore,
}) => {
  return (
    <header className="bg-emerald-950 text-white border-b border-emerald-900 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-inner border border-emerald-500/40">
              <ShieldCheck className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  Mission Oak
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-900/90 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-full">
                  Credit Union
                </span>
              </div>
              <div className="text-[11px] text-emerald-300/80 flex items-center gap-1.5 font-medium">
                <span>Protected by</span>
                <strong className="text-white flex items-center gap-0.5">
                  Second Look™
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                </strong>
                <span className="text-emerald-400 font-mono text-[10px]">
                  (Score: {secondLookScore})
                </span>
              </div>
            </div>
          </div>

          {/* Switchable View Controls */}
          <div className="hidden md:flex items-center bg-emerald-900/60 p-1 rounded-xl border border-emerald-800/80">
            <button
              type="button"
              onClick={() => onChangeViewMode('portal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'portal'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Member Portal</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeViewMode('inspector')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'inspector'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Risk Inspector</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeViewMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'split'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5">
            {/* Guide Button for Judges */}
            <button
              type="button"
              onClick={onOpenGuide}
              className="px-3 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Presentation Guide</span>
            </button>

            {/* Simulated Phone Drawer Trigger */}
            <button
              type="button"
              onClick={onOpenPhoneSimulation}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Open Ana's Simulated Phone"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Ana's Phone</span>
              {smsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-bounce shadow-md">
                  {smsCount}
                </span>
              )}
            </button>

            {/* Member Profile or Login */}
            {member ? (
              <div
                onClick={onOpenAuth}
                className="cursor-pointer pl-2 flex items-center gap-2 border-l border-emerald-800"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-700 border border-emerald-400/40 text-emerald-100 flex items-center justify-center text-xs font-bold shadow-inner">
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="hidden lg:block text-left text-xs">
                  <div className="font-bold text-white leading-tight">{member.name}</div>
                  <div className="text-[10px] text-emerald-300">2FA Verified</div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-sm"
              >
                Sign In & 2FA
              </button>
            )}
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-emerald-900 text-xs font-bold">
          <button
            type="button"
            onClick={() => onChangeViewMode('portal')}
            className={`py-1 px-3 rounded-lg ${
              viewMode === 'portal' ? 'bg-emerald-800 text-white' : 'text-emerald-300'
            }`}
          >
            Member Portal
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode('inspector')}
            className={`py-1 px-3 rounded-lg ${
              viewMode === 'inspector' ? 'bg-emerald-800 text-white' : 'text-emerald-300'
            }`}
          >
            Risk Inspector
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode('split')}
            className={`py-1 px-3 rounded-lg ${
              viewMode === 'split' ? 'bg-emerald-800 text-white' : 'text-emerald-300'
            }`}
          >
            Split
          </button>
        </div>
      </div>
    </header>
  );
};

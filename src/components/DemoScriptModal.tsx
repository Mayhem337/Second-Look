import React from 'react';
import { BookOpen, X, Play, CheckCircle2, ShieldCheck, AlertOctagon, PhoneCall, ArrowRight } from 'lucide-react';

interface DemoScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: 1 | 2 | 3) => void;
}

export const DemoScriptModal: React.FC<DemoScriptModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Second Look: Hackathon Presentation Guide</h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono">
                  JUDGE GUIDE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                "The Social Engineering Shield" • 3-Scenario Comparison Walkthrough
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 leading-relaxed">
            <p className="font-bold text-emerald-900 text-sm">The Core Pitch:</p>
            <p className="mt-1">
              Today, payment-platform fraud alerts go to the institution's risk team, often <em>after</em> the
              money moves. <strong>Second Look</strong> puts the intervention directly in front of the account
              holder, at the moment of payment, while the social engineering scam is actively unfolding.
            </p>
          </div>

          {/* Scenarios Walkthrough */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              The 3 Demo Scenarios (Run Side-by-Side):
            </h3>

            {/* Scenario 1 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">Normal Payment ($412.60)</h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectScenario(1);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Load Scenario 1</span>
                </button>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Dolores pays her usual $412.60 auto loan from her saved checking account. Score stays near 0.
                She experiences no friction or interruption.
              </p>
            </div>

            {/* Scenario 2 */}
            <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 hover:border-amber-400 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Scam, Back-Office Alerts Only (Status Quo)
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectScenario(2);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Load Scenario 2</span>
                </button>
              </div>
              <p className="text-xs text-slate-700 mt-2">
                Fake "fraud department" caller coaches her to add a "protected account" and send $4,800
                same-day. Without Second Look, the money leaves her account immediately while she is still on the
                phone. An alert sits unread in the back-office queue.
              </p>
            </div>

            {/* Scenario 3 */}
            <div className="p-4 rounded-2xl border-2 border-rose-300 bg-rose-50/40 hover:border-rose-400 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Scam Intercepted by Second Look™
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectScenario(3);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Load Scenario 3</span>
                </button>
              </div>
              <p className="text-xs text-slate-700 mt-2">
                Same scam session. Score reaches 80+. At submit, behavioral friction questions appear. Dolores
                answers "Yes". The payment is locked for 24 hours, her daughter Ana receives a protective SMS text,
                and Gemini delivers a plain-language explanation of the scam.
              </p>
            </div>
          </div>

          {/* Signals Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Behavioral Signals & Scoring Ladder
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px] font-semibold">
                  <tr>
                    <th className="p-2.5">Signal</th>
                    <th className="p-2.5">Capture Method</th>
                    <th className="p-2.5 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 text-[11px]">
                  <tr>
                    <td className="p-2.5 font-medium text-slate-800">Phone call active during session</td>
                    <td className="p-2.5">Simulated toggle / Mobile SDK telephony</td>
                    <td className="p-2.5 text-right font-mono font-bold text-amber-700">+10</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-800">Multiple passcode requests in short window</td>
                    <td className="p-2.5">Auth & 2FA events</td>
                    <td className="p-2.5 text-right font-mono font-bold text-amber-700">+12</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-800">Direct navigation to add-account</td>
                    <td className="p-2.5">Navigation sequence & dwell</td>
                    <td className="p-2.5 text-right font-mono font-bold text-amber-700">+8</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-800">Dictation-style typing of account numbers</td>
                    <td className="p-2.5">Keystroke intervals (800ms-2500ms), no paste</td>
                    <td className="p-2.5 text-right font-mono font-bold text-amber-700">+14</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-800">Repeated leaving and returning to page</td>
                    <td className="p-2.5">visibilitychange / blur / focus count &gt;= 3</td>
                    <td className="p-2.5 text-right font-mono font-bold text-amber-700">+8</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-800">Payment destination added minutes ago</td>
                    <td className="p-2.5">Payee age &lt; 15 min</td>
                    <td className="p-2.5 text-right font-mono font-bold text-amber-700">+15</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-800">Amount far above baseline</td>
                    <td className="p-2.5">Ratio to baseline &gt; 3x</td>
                    <td className="p-2.5 text-right font-mono font-bold text-amber-700">+15</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-800">Same-day / expedited timing</td>
                    <td className="p-2.5">Expedited settlement option</td>
                    <td className="p-2.5 text-right font-mono font-bold text-amber-700">+5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

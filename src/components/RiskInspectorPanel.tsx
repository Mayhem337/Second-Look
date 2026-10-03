import React from 'react';
import {
  ShieldAlert,
  Activity,
  PhoneCall,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info,
  Layers,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { RISK_SIGNAL_CONFIGS, EngineState } from '../risk-engine/SecondLookEngine';
import { RiskEvaluation, SignalKey } from '../types';

interface RiskInspectorPanelProps {
  evaluation: RiskEvaluation;
  engineState: EngineState;
  onUpdateEngineState: (partial: Partial<EngineState>) => void;
  onLoadScenario: (scenario: 1 | 2 | 3) => void;
  activeScenario: 1 | 2 | 3 | null;
  secondLookEnabled: boolean;
  onToggleSecondLook: () => void;
}

export const RiskInspectorPanel: React.FC<RiskInspectorPanelProps> = ({
  evaluation,
  engineState,
  onUpdateEngineState,
  onLoadScenario,
  activeScenario,
  secondLookEnabled,
  onToggleSecondLook,
}) => {
  const signalKeys: SignalKey[] = [
    'phoneCallActive',
    'multiplePasscodes',
    'directNavAddAccount',
    'dictationTyping',
    'repeatedTabSwitches',
    'longIdleThenRapid',
    'payeeRecent',
    'amountSpike',
    'expeditedTiming',
  ];

  // Helper to determine if a signal is currently active
  const isSignalActive = (key: SignalKey): boolean => {
    return evaluation.activeSignals.some((s) => s.key === key);
  };

  const getGaugeColor = (score: number) => {
    if (score >= 80) return 'text-rose-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getGaugeBg = (score: number) => {
    if (score >= 80) return 'bg-rose-50 border-rose-200 text-rose-900';
    if (score >= 50) return 'bg-amber-50 border-amber-200 text-amber-900';
    return 'bg-emerald-50 border-emerald-200 text-emerald-900';
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-full">
      {/* Panel Top Header */}
      <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <span>Second Look™ Risk Inspector</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                LIVE TELEMETRY
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              SWIVEL Embeddable Behavioral Risk Engine (No ML, Weighted Rules)
            </p>
          </div>
        </div>

        {/* Protection Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-300 pl-1">Second Look™ Module:</span>
          <button
            type="button"
            onClick={onToggleSecondLook}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              secondLookEnabled
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-rose-700/80 text-rose-100 hover:bg-rose-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${secondLookEnabled ? 'bg-white animate-pulse' : 'bg-rose-300'}`}
            />
            {secondLookEnabled ? 'ACTIVE (Protected)' : 'DISABLED (Status Quo)'}
          </button>
        </div>
      </div>

      {/* Preset Scenario Bar for Judges */}
      <div className="bg-slate-950/60 px-5 py-3 border-b border-slate-800/80">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-slate-400" />
          <span>Hackathon Demo Scenarios:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onLoadScenario(1)}
            className={`p-2.5 rounded-xl text-left border transition-all ${
              activeScenario === 1
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="text-xs font-bold flex items-center justify-between">
              <span>1. Normal Payment</span>
              <span className="text-[10px] text-emerald-400 font-mono">Score: ~0</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
              Dolores pays usual $412.60 auto loan.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onLoadScenario(2)}
            className={`p-2.5 rounded-xl text-left border transition-all ${
              activeScenario === 2
                ? 'bg-amber-950/80 border-amber-500 text-amber-200 ring-1 ring-amber-500'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="text-xs font-bold flex items-center justify-between">
              <span>2. Scam (Status Quo)</span>
              <span className="text-[10px] text-amber-400 font-mono">Unprotected</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
              Back-office alert only; $4,800 moves.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onLoadScenario(3)}
            className={`p-2.5 rounded-xl text-left border transition-all ${
              activeScenario === 3
                ? 'bg-rose-950/80 border-rose-500 text-rose-200 ring-1 ring-rose-500'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="text-xs font-bold flex items-center justify-between">
              <span>3. Scam + Second Look</span>
              <span className="text-[10px] text-rose-400 font-mono">Score: 80+</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
              Friction modal, 24h hold, Ana alerted.
            </p>
          </button>
        </div>
      </div>

      {/* Main Score Tally Banner */}
      <div className="p-5 border-b border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Score Dial */}
        <div className="flex items-center gap-4 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={getGaugeColor(evaluation.score)}
                strokeDasharray={`${evaluation.score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-black text-xl text-white font-mono">
              {evaluation.score}
            </span>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Composite Risk Score
            </div>
            <div className="text-sm font-bold text-white mt-0.5 capitalize">
              {evaluation.level} Risk Level
            </div>
            <div className="text-[10px] text-slate-400">
              Clamped 0 to 100 ({evaluation.activeSignals.length} signals active)
            </div>
          </div>
        </div>

        {/* Response Ladder Trigger */}
        <div className="md:col-span-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Response Ladder Thresholds
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div
              className={`p-2 rounded-xl border transition-all ${
                evaluation.score < 50
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono">&lt; 50 pts</div>
              <div className="text-xs mt-0.5">Pass Through</div>
              <div className="text-[9px] text-slate-400 mt-0.5">No user friction</div>
            </div>

            <div
              className={`p-2 rounded-xl border transition-all ${
                evaluation.score >= 50 && evaluation.score < 80
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono">50 – 79 pts</div>
              <div className="text-xs mt-0.5">Friction Questions</div>
              <div className="text-[9px] text-slate-400 mt-0.5">Verify behavior</div>
            </div>

            <div
              className={`p-2 rounded-xl border transition-all ${
                evaluation.score >= 80
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono">80+ pts</div>
              <div className="text-xs mt-0.5">Friction + 24h Hold</div>
              <div className="text-[9px] text-slate-400 mt-0.5">SMS to Ana Delgado</div>
            </div>
          </div>
        </div>
      </div>

      {/* Signals List & Interactive Simulator Toggles */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
          <span>Captured Risk Signals (9 Signal Engine)</span>
          <span className="text-[11px] text-slate-500">Click toggle to simulate live signal</span>
        </div>

        <div className="space-y-2">
          {signalKeys.map((key) => {
            const cfg = RISK_SIGNAL_CONFIGS[key];
            const active = isSignalActive(key);

            // Handler for manual toggles
            const handleToggle = () => {
              switch (key) {
                case 'phoneCallActive':
                  onUpdateEngineState({ phoneCallActive: !engineState.phoneCallActive });
                  break;
                case 'multiplePasscodes':
                  onUpdateEngineState({
                    passcodeRequestCount: engineState.passcodeRequestCount >= 2 ? 0 : 2,
                  });
                  break;
                case 'directNavAddAccount':
                  onUpdateEngineState({
                    navigatedDirectlyToAddAccount: !engineState.navigatedDirectlyToAddAccount,
                  });
                  break;
                case 'dictationTyping':
                  onUpdateEngineState({ dictationDetected: !engineState.dictationDetected });
                  break;
                case 'repeatedTabSwitches':
                  onUpdateEngineState({
                    tabSwitchCount: engineState.tabSwitchCount >= 3 ? 0 : 4,
                  });
                  break;
                case 'longIdleThenRapid':
                  onUpdateEngineState({
                    longIdleThenRapidDetected: !engineState.longIdleThenRapidDetected,
                  });
                  break;
                case 'payeeRecent':
                  onUpdateEngineState({
                    selectedPayeeAddedAt: engineState.selectedPayeeAddedAt ? null : Date.now() - 3 * 60 * 1000,
                  });
                  break;
                case 'amountSpike':
                  onUpdateEngineState({
                    amount: engineState.amount > 1000 ? 412.60 : 4800,
                  });
                  break;
                case 'expeditedTiming':
                  onUpdateEngineState({ isExpedited: !engineState.isExpedited });
                  break;
              }
            };

            return (
              <div
                key={key}
                onClick={handleToggle}
                className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start justify-between gap-3 ${
                  active
                    ? 'bg-slate-800/90 border-amber-500/60 text-white shadow-xs'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${
                      active ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {active ? '✓' : ''}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${active ? 'text-white' : 'text-slate-300'}`}>
                        {cfg.label}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          active
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        +{cfg.points} pts
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{cfg.detail}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 italic">
                      Capture: {cfg.howCaptured}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 self-center">
                  <span
                    className={`text-[11px] font-semibold px-2 py-1 rounded-md ${
                      active
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {active ? 'FIRING' : 'IDLE'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-time keystroke cadence & visibility listeners mounted</span>
        </div>
        <span className="font-mono text-slate-500">v1.4.2-hackathon</span>
      </div>
    </div>
  );
};

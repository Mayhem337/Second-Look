import { SignalKey, RiskSignalConfig, ActiveSignal, RiskEvaluation, PaymentAccount } from '../types';

export const RISK_SIGNAL_CONFIGS: Record<SignalKey, RiskSignalConfig> = {
  phoneCallActive: {
    key: 'phoneCallActive',
    label: 'Phone call active during session',
    points: 10,
    howCaptured: 'Simulated toggle on web (Mobile SDK telephony state in production)',
    detail: 'Account holder is engaged in a live audio call while navigating financial controls.',
  },
  multiplePasscodes: {
    key: 'multiplePasscodes',
    label: 'Multiple passcode requests in short window',
    points: 12,
    howCaptured: 'Authentication / MFA event telemetry',
    detail: '2FA passcode requested 2+ times within 5 minutes, indicating potential third-party prompting or social coaching.',
  },
  directNavAddAccount: {
    key: 'directNavAddAccount',
    label: 'Direct navigation to add-account / payment-method change',
    points: 8,
    howCaptured: 'Session navigation breadcrumbs & dwell telemetry',
    detail: 'User navigated directly from login to adding an external account without typical account viewing.',
  },
  dictationTyping: {
    key: 'dictationTyping',
    label: 'Dictation-style entry of account numbers',
    points: 14,
    howCaptured: 'Keystroke inter-arrival cadence, lack of paste, backspace corrections',
    detail: 'Rhythmic 800ms–2000ms key intervals matching verbal read-back from a telephone caller.',
  },
  repeatedTabSwitches: {
    key: 'repeatedTabSwitches',
    label: 'Repeated leaving and returning to page',
    points: 8,
    howCaptured: 'visibilitychange, window blur, and focus event counts',
    detail: 'Tab switches or window blur events >= 3 during sensitive input.',
  },
  longIdleThenRapid: {
    key: 'longIdleThenRapid',
    label: 'Long idle followed by rapid entry',
    points: 8,
    howCaptured: 'Input timestamp delta analysis',
    detail: 'Extended pause (>45s) followed by a burst of rapid submission inputs.',
  },
  payeeRecent: {
    key: 'payeeRecent',
    label: 'Payment destination added minutes ago',
    points: 15,
    howCaptured: 'Payee entity age verification timestamp',
    detail: 'Destination bank account was created less than 15 minutes ago in this session.',
  },
  amountSpike: {
    key: 'amountSpike',
    label: 'Amount far above usual payment baseline',
    points: 15,
    howCaptured: 'Ratio to member historical loan payment baseline',
    detail: 'Transaction amount exceeds 3x typical monthly payment (current ratio: >10x).',
  },
  expeditedTiming: {
    key: 'expeditedTiming',
    label: 'Same-day / expedited payment timing',
    points: 5,
    howCaptured: 'Settlement rails selection in payment payload',
    detail: 'Urgent immediate / wire same-day settlement requested rather than standard ACH.',
  },
};

export interface EngineState {
  phoneCallActive: boolean;
  passcodeRequestCount: number;
  navigatedDirectlyToAddAccount: boolean;
  dictationDetected: boolean;
  tabSwitchCount: number;
  longIdleThenRapidDetected: boolean;
  selectedPayeeAddedAt: number | null;
  amount: number;
  baseline: number;
  isExpedited: boolean;
}

export function evaluateRisk(state: EngineState): RiskEvaluation {
  const activeSignals: ActiveSignal[] = [];
  let rawScore = 0;

  // 1. Phone call active
  if (state.phoneCallActive) {
    const cfg = RISK_SIGNAL_CONFIGS.phoneCallActive;
    rawScore += cfg.points;
    activeSignals.push({
      key: cfg.key,
      label: cfg.label,
      points: cfg.points,
      detail: 'Caller simulated active (mobile SDK call-state emulation)',
      timestamp: Date.now(),
    });
  }

  // 2. Multiple passcode requests in short window
  if (state.passcodeRequestCount >= 2) {
    const cfg = RISK_SIGNAL_CONFIGS.multiplePasscodes;
    rawScore += cfg.points;
    activeSignals.push({
      key: cfg.key,
      label: cfg.label,
      points: cfg.points,
      detail: `${state.passcodeRequestCount} passcode requests logged within 5 minutes`,
      timestamp: Date.now(),
    });
  }

  // 3. Direct navigation to add account
  if (state.navigatedDirectlyToAddAccount) {
    const cfg = RISK_SIGNAL_CONFIGS.directNavAddAccount;
    rawScore += cfg.points;
    activeSignals.push({
      key: cfg.key,
      label: cfg.label,
      points: cfg.points,
      detail: 'Immediate jump to external funding setup upon authentication',
      timestamp: Date.now(),
    });
  }

  // 4. Dictation typing detected
  if (state.dictationDetected) {
    const cfg = RISK_SIGNAL_CONFIGS.dictationTyping;
    rawScore += cfg.points;
    activeSignals.push({
      key: cfg.key,
      label: cfg.label,
      points: cfg.points,
      detail: 'Inter-keystroke timing (avg 1.1s) indicates verbal dictation',
      timestamp: Date.now(),
    });
  }

  // 5. Repeated tab switches
  if (state.tabSwitchCount >= 3) {
    const cfg = RISK_SIGNAL_CONFIGS.repeatedTabSwitches;
    rawScore += cfg.points;
    activeSignals.push({
      key: cfg.key,
      label: cfg.label,
      points: cfg.points,
      detail: `${state.tabSwitchCount} blur/visibilitychange events recorded during session`,
      timestamp: Date.now(),
    });
  }

  // 6. Long idle then rapid
  if (state.longIdleThenRapidDetected) {
    const cfg = RISK_SIGNAL_CONFIGS.longIdleThenRapid;
    rawScore += cfg.points;
    activeSignals.push({
      key: cfg.key,
      label: cfg.label,
      points: cfg.points,
      detail: 'Dwell pause > 45s followed by burst form submission',
      timestamp: Date.now(),
    });
  }

  // 7. Payee added minutes ago (< 15 mins)
  if (state.selectedPayeeAddedAt) {
    const ageMinutes = (Date.now() - state.selectedPayeeAddedAt) / (1000 * 60);
    if (ageMinutes < 15) {
      const cfg = RISK_SIGNAL_CONFIGS.payeeRecent;
      rawScore += cfg.points;
      activeSignals.push({
        key: cfg.key,
        label: cfg.label,
        points: cfg.points,
        detail: `Payee created ${Math.max(1, Math.round(ageMinutes))} min ago in this session`,
        timestamp: Date.now(),
      });
    }
  }

  // 8. Amount far above usual baseline
  if (state.amount && state.baseline && state.amount > state.baseline * 2.5) {
    const ratio = (state.amount / state.baseline).toFixed(1);
    const cfg = RISK_SIGNAL_CONFIGS.amountSpike;
    rawScore += cfg.points;
    activeSignals.push({
      key: cfg.key,
      label: cfg.label,
      points: cfg.points,
      detail: `$${state.amount.toLocaleString()} is ${ratio}x normal baseline of $${state.baseline.toFixed(2)}`,
      timestamp: Date.now(),
    });
  }

  // 9. Expedited timing
  if (state.isExpedited) {
    const cfg = RISK_SIGNAL_CONFIGS.expeditedTiming;
    rawScore += cfg.points;
    activeSignals.push({
      key: cfg.key,
      label: cfg.label,
      points: cfg.points,
      detail: 'Expedited / same-day settlement requested',
      timestamp: Date.now(),
    });
  }

  // Clamp 0 to 100
  const score = Math.min(100, Math.max(0, rawScore));

  let level: 'low' | 'medium' | 'high' = 'low';
  let action: 'pass' | 'friction' | 'hold' = 'pass';

  if (score >= 80) {
    level = 'high';
    action = 'hold';
  } else if (score >= 50) {
    level = 'medium';
    action = 'friction';
  } else {
    level = 'low';
    action = 'pass';
  }

  return {
    score,
    level,
    action,
    activeSignals,
  };
}

export const FRICTION_QUESTIONS = [
  {
    id: 'q1_phoneCall',
    number: 1,
    question: 'Is someone on the phone with you right now telling you what to do?',
    contextNote: 'Bank and utility imposters frequently coach victims continuously on live calls.',
  },
  {
    id: 'q2_keepSecret',
    number: 2,
    question: 'Did they ask you to keep this payment a secret, even from the credit union?',
    contextNote: 'Scammers instruct targets not to speak to branch tellers or customer service.',
  },
  {
    id: 'q3_moneyInDanger',
    number: 3,
    question: 'Did they say your money is in danger and needs to be moved to stay safe?',
    contextNote: 'Credit unions will NEVER advise moving money to a third-party account to "protect" it.',
  },
];

export interface TrustedContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  checkingBalance: number;
  savingsBalance: number;
  autoLoanBalance: number;
  usualAutoPayment: number; // default $412.60
  trustedContact: TrustedContact;
  isRegisteredUser?: boolean;
}

export interface PaymentAccount {
  id: string;
  nickname: string;
  bankName: string;
  accountType: 'checking' | 'savings' | 'external';
  accountNumber: string;
  routingNumber: string;
  addedAt: number; // Timestamp ms
  isVerified: boolean;
}

export type SignalKey =
  | 'phoneCallActive'
  | 'multiplePasscodes'
  | 'directNavAddAccount'
  | 'dictationTyping'
  | 'repeatedTabSwitches'
  | 'longIdleThenRapid'
  | 'payeeRecent'
  | 'amountSpike'
  | 'expeditedTiming';

export interface RiskSignalConfig {
  key: SignalKey;
  label: string;
  points: number;
  howCaptured: string;
  detail: string;
}

export interface ActiveSignal {
  key: SignalKey;
  label: string;
  points: number;
  detail?: string;
  timestamp: number;
}

export interface RiskEvaluation {
  score: number; // Clamped 0-100
  level: 'low' | 'medium' | 'high'; // low: <50, medium: 50-79, high: >=80
  action: 'pass' | 'friction' | 'hold';
  activeSignals: ActiveSignal[];
}

export interface FrictionQuestion {
  id: string;
  number: number;
  question: string;
  contextNote: string;
}

export interface FrictionAnswers {
  q1_phoneCall: boolean | null;
  q2_keepSecret: boolean | null;
  q3_moneyInDanger: boolean | null;
}

export type InterventionOutcome =
  | 'pass'
  | 'friction_dismissed'
  | 'hold_24h'
  | 'delay_30m'
  | 'backoffice_unprotected';

export interface PaymentSubmission {
  id: string;
  amount: number;
  baseline: number;
  destinationAccount: PaymentAccount;
  expedited: boolean;
  scheduledDate: string;
  timestamp: number;
  riskEvaluation: RiskEvaluation;
  outcome: InterventionOutcome;
  explanation?: string;
  trustedContactNotified?: boolean;
}

export interface SMSNotification {
  id: string;
  timestamp: string;
  from: string;
  to: string;
  toName: string;
  body: string;
  read: boolean;
  type: '2fa_passcode' | 'trusted_contact_alert' | 'cu_followup';
}

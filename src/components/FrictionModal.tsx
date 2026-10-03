import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneOff,
  AlertOctagon,
  Clock,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { FRICTION_QUESTIONS } from '../risk-engine/SecondLookEngine';
import { FrictionAnswers, RiskEvaluation, PaymentAccount, TrustedContact } from '../types';

interface FrictionModalProps {
  isOpen: boolean;
  riskEvaluation: RiskEvaluation;
  transactionAmount: number;
  baselineAmount: number;
  destinationAccount: PaymentAccount;
  trustedContact: TrustedContact;
  onProceedAnyway?: () => void;
  onConfirmHold: (answers: FrictionAnswers, outcome: 'hold_24h' | 'delay_30m', explanation: string) => void;
  onCancelPayment: () => void;
  isLoadingExplanation: boolean;
  geminiExplanation: string | null;
}

export const FrictionModal: React.FC<FrictionModalProps> = ({
  isOpen,
  riskEvaluation,
  transactionAmount,
  baselineAmount,
  destinationAccount,
  trustedContact,
  onConfirmHold,
  onCancelPayment,
  isLoadingExplanation,
  geminiExplanation,
}) => {
  const [answers, setAnswers] = useState<FrictionAnswers>({
    q1_phoneCall: null,
    q2_keepSecret: null,
    q3_moneyInDanger: null,
  });

  const [step, setStep] = useState<'questions' | 'outcome'>('questions');

  if (!isOpen) return null;

  const allAnswered =
    answers.q1_phoneCall !== null &&
    answers.q2_keepSecret !== null &&
    answers.q3_moneyInDanger !== null;

  const hasAnyYes =
    answers.q1_phoneCall === true ||
    answers.q2_keepSecret === true ||
    answers.q3_moneyInDanger === true;

  const handleAnswer = (key: keyof FrictionAnswers, val: boolean) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleReviewAnswers = () => {
    setStep('outcome');
    const outcome = hasAnyYes ? 'hold_24h' : 'delay_30m';
    const explanation =
      geminiExplanation ||
      `This transfer of $${transactionAmount.toLocaleString()} matches patterns seen in imposter scams. Mission Oak will never instruct you to move money or keep secrets.`;
    onConfirmHold(answers, outcome, explanation);
  };

  const ratio = (transactionAmount / baselineAmount).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-amber-500 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Banner */}
        <div className="bg-amber-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-700/80 flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider bg-amber-800/80 px-2 py-0.5 rounded">
                  Second Look™ Safety Check
                </span>
                <span className="text-xs font-mono bg-amber-900/60 px-2 py-0.5 rounded text-amber-200">
                  Risk Score: {riskEvaluation.score}/100
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Please take a moment before sending this payment
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'questions' ? (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-950">
                <p className="font-semibold text-amber-900">
                  Mission Oak Credit Union fraud prevention noticed unusual activity:
                </p>
                <ul className="mt-2 space-y-1 text-xs text-amber-800 list-disc list-inside">
                  <li>
                    Transfer amount of <strong>${transactionAmount.toLocaleString()}</strong> is{' '}
                    <strong>{ratio}x</strong> your usual payment baseline (${baselineAmount.toFixed(2)}).
                  </li>
                  <li>
                    Destination account at <strong>{destinationAccount.bankName}</strong> was added only minutes ago.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-800">
                  Please answer these 3 quick questions about your current situation:
                </p>

                {FRICTION_QUESTIONS.map((q) => {
                  const key = q.id as keyof FrictionAnswers;
                  const currentVal = answers[key];
                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-colors"
                    >
                      <div className="text-sm font-semibold text-slate-900 mb-1 flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                          {q.number}
                        </span>
                        <span>{q.question}</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3 ml-7">{q.contextNote}</p>

                      <div className="flex gap-3 ml-7">
                        <button
                          type="button"
                          onClick={() => handleAnswer(key, true)}
                          className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                            currentVal === true
                              ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                              : 'bg-white border-slate-300 text-slate-700 hover:border-amber-400'
                          }`}
                        >
                          {currentVal === true && <CheckCircle2 className="w-4 h-4" />}
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAnswer(key, false)}
                          className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                            currentVal === false
                              ? 'bg-emerald-700 border-emerald-700 text-white shadow-xs'
                              : 'bg-white border-slate-300 text-slate-700 hover:border-emerald-500'
                          }`}
                        >
                          {currentVal === false && <CheckCircle2 className="w-4 h-4" />}
                          No
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onCancelPayment}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline"
                >
                  Cancel Payment
                </button>

                <button
                  type="button"
                  disabled={!allAnswered}
                  onClick={handleReviewAnswers}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                    allAnswered
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Submit & Review Protection</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Step 2: Protection Outcome */
            <div className="space-y-5 animate-in fade-in duration-300">
              {hasAnyYes ? (
                /* 24-HOUR HOLD APPLIED */
                <div className="space-y-4">
                  <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                        <AlertOctagon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs uppercase font-bold text-rose-700 tracking-wider">
                          Intervention Applied (Score {riskEvaluation.score}/100)
                        </div>
                        <h3 className="text-lg font-black text-rose-950">
                          Payment Paused for 24 Hours
                        </h3>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-rose-900 leading-relaxed">
                      Your funds have NOT been transferred. We have safely locked this payment to protect your savings.
                    </p>
                  </div>

                  {/* Gemini Plain-Language Explanation */}
                  <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-700 relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-2">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        Plain-Language Analysis (Second Look™ AI)
                      </span>
                      <span className="text-[10px] text-slate-400">Powered by Gemini 3.8 Flash</span>
                    </div>

                    {isLoadingExplanation ? (
                      <div className="py-4 text-center text-xs text-slate-300 animate-pulse">
                        Analyzing behavioral signals and formatting plain-language explanation...
                      </div>
                    ) : (
                      <p className="text-sm text-slate-100 leading-relaxed font-sans">
                        {geminiExplanation ||
                          `This looks like a "safe account" social engineering scam. Mission Oak Credit Union will never call asking you to move money or keep a transaction secret. This transfer of $${transactionAmount.toLocaleString()} is ${ratio}x your normal loan payment, sent to an account added just minutes ago while you were on the phone.`}
                      </p>
                    )}
                  </div>

                  {/* Trusted Contact Alert Notice */}
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                    <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0 mt-0.5">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div className="text-xs text-emerald-950">
                      <span className="font-bold block text-emerald-900">
                        Trusted Contact Notified via SMS:
                      </span>
                      <p className="text-emerald-800 mt-0.5">
                        A protective SMS alert was sent to your designated contact,{' '}
                        <strong>{trustedContact.name} ({trustedContact.relationship})</strong> at{' '}
                        <span className="font-mono">{trustedContact.phone}</span>:
                      </p>
                      <blockquote className="mt-2 italic border-l-2 border-emerald-600 pl-2 text-slate-700 font-mono text-[11px] bg-white/70 py-1 rounded-r">
                        "Mission Oak: Your mom just tried to send ${transactionAmount.toLocaleString()} to a new account while on a phone call. We paused it for 24 hours. Please call her."
                      </blockquote>
                    </div>
                  </div>

                  {/* Immediate Action Directive */}
                  <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                      <PhoneOff className="w-5 h-5 text-amber-700" />
                      What you should do right now:
                    </div>
                    <ol className="text-xs text-amber-950 space-y-1 list-decimal list-inside leading-relaxed font-medium">
                      <li>
                        <strong>Hang up the phone immediately</strong> if someone is on the line coaching you.
                      </li>
                      <li>
                        Do NOT give anyone one-time passcodes, passwords, or personal PINs.
                      </li>
                      <li>
                        Call Mission Oak Fraud Prevention directly at{' '}
                        <strong className="text-emerald-800">1-800-555-OAK1 (6251)</strong> or visit your local branch.
                      </li>
                    </ol>
                  </div>
                </div>
              ) : (
                /* 30-MINUTE DELAY (All "No" at 80+) */
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Clock className="w-8 h-8 text-amber-700" />
                      <div>
                        <h3 className="text-base font-bold text-amber-950">
                          Safety Hold: 30-Minute Security Window
                        </h3>
                        <p className="text-xs text-amber-800 mt-1">
                          Because this payment of ${transactionAmount.toLocaleString()} is significantly larger than your baseline and went to a newly linked account, we have placed a short 30-minute safety buffer.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    A Mission Oak representative will call your registered phone to confirm this transfer before settlement. You can cancel at any time from your dashboard without penalty.
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={onCancelPayment}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-sm shadow-md"
                >
                  Return to Member Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

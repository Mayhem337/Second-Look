import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Building,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  PhoneCall,
  Clock,
  PlusCircle,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Send,
  Sparkles,
  Lock,
  LogOut,
} from 'lucide-react';
import { Member, PaymentAccount, RiskEvaluation, PaymentSubmission } from '../types';

interface MemberPortalProps {
  member: Member;
  paymentAccounts: PaymentAccount[];
  selectedAccount: PaymentAccount;
  onSelectAccount: (acct: PaymentAccount) => void;
  onOpenAddAccount: () => void;
  amount: number;
  onChangeAmount: (val: number) => void;
  isExpedited: boolean;
  onToggleExpedited: () => void;
  onSubmitPayment: () => void;
  phoneCallActive: boolean;
  onTogglePhoneCall: () => void;
  riskEvaluation: RiskEvaluation;
  secondLookEnabled: boolean;
  onLogout: () => void;
  onTabSwitchRecorded: () => void;
}

export const MemberPortal: React.FC<MemberPortalProps> = ({
  member,
  paymentAccounts,
  selectedAccount,
  onSelectAccount,
  onOpenAddAccount,
  amount,
  onChangeAmount,
  isExpedited,
  onToggleExpedited,
  onSubmitPayment,
  phoneCallActive,
  onTogglePhoneCall,
  riskEvaluation,
  secondLookEnabled,
  onLogout,
  onTabSwitchRecorded,
}) => {
  // Listen for visibility / tab switches
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        onTabSwitchRecorded();
      }
    };
    const handleBlur = () => {
      onTabSwitchRecorded();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
    };
  }, [onTabSwitchRecorded]);

  const ratio = (amount / member.usualAutoPayment).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Active Phone Call Simulation Bar */}
      <div
        className={`px-4 py-3 rounded-2xl border transition-all flex items-center justify-between ${
          phoneCallActive
            ? 'bg-rose-950/40 border-rose-500/80 text-rose-200'
            : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              phoneCallActive
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold flex items-center gap-2">
              <span>{phoneCallActive ? 'ACTIVE AUDIO CALL SIMULATION' : 'No Phone Call Active'}</span>
              {phoneCallActive && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono">
                  +10 pts Risk
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {phoneCallActive
                ? 'Simulated incoming call: "CU Fraud Dept Imposter" coaching Dolores to move $4,800 to a "safe account".'
                : 'Account holder is browsing privately (no background phone call detected).'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onTogglePhoneCall}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
            phoneCallActive
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'bg-slate-800 hover:bg-slate-900 text-white'
          }`}
        >
          {phoneCallActive ? 'Hang Up Call' : 'Simulate Scammer Call'}
        </button>
      </div>

      {/* Top Banner: Member Welcome & Accounts Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                Welcome back, {member.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                Member ID: {member.id.replace('mem_', '')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Mission Oak CU • Trusted Contact:{' '}
              <strong className="text-slate-700">
                {member.trustedContact.name} ({member.trustedContact.relationship})
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Second Look Protection Status Badge */}
            <div
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                secondLookEnabled
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-slate-100 border-slate-300 text-slate-600'
              }`}
            >
              {secondLookEnabled ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-slate-500" />
              )}
              <span>Second Look™: {secondLookEnabled ? 'Active' : 'Bypassed'}</span>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 font-medium p-1.5 rounded-lg hover:bg-slate-50"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Member Balances Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Primary Checking (...4012)
            </span>
            <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
              ${member.checkingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">Available balance</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              High-Yield Savings (...8821)
            </span>
            <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
              ${member.savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">4.15% APY</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-900 uppercase tracking-wider block">
                Auto Loan (...5519)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-900 font-bold">
                Payment Due
              </span>
            </div>
            <div className="text-xl font-bold text-emerald-950 mt-1 font-mono">
              ${member.autoLoanBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-emerald-800 font-medium">
              Regular monthly payment: ${member.usualAutoPayment.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Interface: The Focus of the Hackathon Demo */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Make an Account Payment / Transfer</h2>
              <p className="text-xs text-slate-500">
                Loan settlement or electronic funds transfer to linked accounts
              </p>
            </div>
          </div>

          {/* Ratio Warning Tag if high amount */}
          {amount > member.usualAutoPayment * 2.5 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Unusual Amount: {ratio}x baseline</span>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-6">
          {/* Funding Account Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Destination / Payment Account
              </label>
              <button
                type="button"
                onClick={onOpenAddAccount}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 hover:underline"
              >
                <PlusCircle className="w-4 h-4 text-emerald-700" />
                <span>+ Add New Payment Account</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paymentAccounts.map((acct) => {
                const isSelected = selectedAccount.id === acct.id;
                const isRecentlyAdded = Date.now() - acct.addedAt < 15 * 60 * 1000;

                return (
                  <div
                    key={acct.id}
                    onClick={() => onSelectAccount(acct)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-600" />
                        <span className="font-bold text-sm text-slate-900">{acct.nickname}</span>
                      </div>
                      {isRecentlyAdded && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                          Added Just Now
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 font-mono">
                      {acct.bankName} • Acct ending ...{acct.accountNumber.slice(-4) || '3581'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Amount Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Payment Amount
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChangeAmount(member.usualAutoPayment)}
                  className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Dolores Regular (${member.usualAutoPayment.toFixed(2)})
                </button>
                <button
                  type="button"
                  onClick={() => onChangeAmount(4800.00)}
                  className="px-2.5 py-1 text-xs rounded-md bg-rose-50 hover:bg-rose-100 text-rose-800 font-medium border border-rose-200"
                >
                  Scam Amount ($4,800.00)
                </button>
              </div>
            </div>

            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 text-lg font-bold">
                $
              </div>
              <input
                type="number"
                step="0.01"
                value={amount || ''}
                onChange={(e) => onChangeAmount(parseFloat(e.target.value) || 0)}
                className="w-full pl-9 pr-4 py-3 text-xl font-bold font-mono text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Settlement Rails Selection */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Settlement Speed & Transfer Rails
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => isExpedited && onToggleExpedited()}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  !isExpedited
                    ? 'border-emerald-700 bg-white shadow-xs'
                    : 'border-slate-200 bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Standard ACH Settlement</span>
                  <span className="text-emerald-700">Free</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">2-3 business days clearing</p>
              </div>

              <div
                onClick={() => !isExpedited && onToggleExpedited()}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  isExpedited
                    ? 'border-amber-600 bg-amber-50/50 shadow-xs'
                    : 'border-slate-200 bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <span>Expedited Same-Day Wire</span>
                    <span className="text-[10px] px-1 bg-amber-200 text-amber-900 rounded font-mono">
                      +5 pts
                    </span>
                  </span>
                  <span className="text-amber-800">$15.00</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Urgent immediate transfer (scammer requirement)
                </p>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onSubmitPayment}
              className="w-full py-4 px-6 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Submit Payment (${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })})</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Encrypted via Mission Oak CU Core Banking Gateway
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

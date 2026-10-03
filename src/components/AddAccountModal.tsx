import React, { useState, useRef } from 'react';
import { Building2, X, AlertCircle, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { PaymentAccount } from '../types';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountAdded: (account: PaymentAccount) => void;
  onDictationDetected: () => void;
  dictationActive: boolean;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onAccountAdded,
  onDictationDetected,
  dictationActive,
}) => {
  const [bankName, setBankName] = useState('First Secure National Bank');
  const [nickname, setNickname] = useState('Protected Safe Account');
  const [routingNumber, setRoutingNumber] = useState('121000358');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState<'checking' | 'savings' | 'external'>('external');
  const [isSimulatingTyping, setIsSimulatingTyping] = useState(false);

  const lastKeyTimeRef = useRef<number>(0);
  const strokeIntervalsRef = useRef<number[]>([]);

  if (!isOpen) return null;

  const handleAccountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const now = Date.now();
    if (lastKeyTimeRef.current > 0) {
      const delta = now - lastKeyTimeRef.current;
      strokeIntervalsRef.current.push(delta);

      // Check if intervals look like phone dictation (800ms to 2500ms)
      if (strokeIntervalsRef.current.length >= 3) {
        const recent = strokeIntervalsRef.current.slice(-4);
        const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
        if (avg >= 700 && avg <= 2500) {
          onDictationDetected();
        }
      }
    }
    lastKeyTimeRef.current = now;
  };

  // 1-Click Presenter Tool: Simulate caller dictating account number
  const handleSimulateDictatedTyping = () => {
    setIsSimulatingTyping(true);
    setAccountNumber('');
    const fakeAcct = '9832481029';
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < fakeAcct.length) {
        setAccountNumber((prev) => prev + fakeAcct[idx]);
        idx++;
        onDictationDetected();
      } else {
        clearInterval(interval);
        setIsSimulatingTyping(false);
      }
    }, 900); // 900ms dictation cadence
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber) return;

    const newAccount: PaymentAccount = {
      id: 'acct_' + Date.now(),
      nickname: nickname.trim() || 'External Account',
      bankName: bankName.trim() || 'External Institution',
      accountType,
      routingNumber: routingNumber.trim(),
      accountNumber: accountNumber.trim(),
      addedAt: Date.now(), // Age = 0 min!
      isVerified: true,
    };

    onAccountAdded(newAccount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Link External Payment Account</h2>
              <p className="text-xs text-slate-400">ACH Transfer Destination Setup</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Scam Pattern Demonstration:</span> Scammers coach victims to link a
              new "safe/protected account" and immediately move funds into it before bank teller intervention.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Account Nickname
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              placeholder="e.g. My Safe Account"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Destination Bank / Institution
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              placeholder="e.g. Chase, Wells Fargo, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Routing Number (9 Digits)
              </label>
              <input
                type="text"
                maxLength={9}
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, ''))}
                required
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Type
              </label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden bg-white"
              >
                <option value="external">External Checking</option>
                <option value="savings">External Savings</option>
              </select>
            </div>
          </div>

          {/* Account number with dictation listener */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Account Number
              </label>
              {dictationActive && (
                <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  Dictation Cadence Detected (+14 pts)
                </span>
              )}
            </div>

            <input
              type="text"
              value={accountNumber}
              onKeyDown={handleAccountKeyDown}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter account number"
              required
              className={`w-full px-3 py-2.5 font-mono text-base border rounded-lg focus:outline-hidden transition-all ${
                dictationActive
                  ? 'border-amber-500 ring-2 ring-amber-200 bg-amber-50/30'
                  : 'border-slate-300 focus:ring-2 focus:ring-emerald-600'
              }`}
            />

            {/* Presenter Helper to simulate dictation */}
            <div className="mt-2 flex items-center justify-between">
              <button
                type="button"
                disabled={isSimulatingTyping}
                onClick={handleSimulateDictatedTyping}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 underline"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                {isSimulatingTyping ? 'Typing with pauses...' : 'Simulate Dictated Typing (Judge Demo)'}
              </button>
              <span className="text-[10px] text-slate-400">
                Interval: 900ms / stroke
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm"
            >
              Link Destination Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

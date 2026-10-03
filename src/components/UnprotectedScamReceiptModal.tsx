import React from 'react';
import { AlertTriangle, CheckCircle2, ArrowRight, ShieldX, Clock, PhoneCall } from 'lucide-react';
import { PaymentAccount } from '../types';

interface UnprotectedScamReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  destinationAccount: PaymentAccount;
  onSwitchToSecondLookDemo: () => void;
}

export const UnprotectedScamReceiptModal: React.FC<UnprotectedScamReceiptModalProps> = ({
  isOpen,
  onClose,
  amount,
  destinationAccount,
  onSwitchToSecondLookDemo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-rose-500 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Warning Banner for Judges */}
        <div className="bg-rose-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldX className="w-6 h-6 text-white shrink-0" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider bg-rose-900/60 px-2 py-0.5 rounded inline-block">
                SCENARIO 2: STATUS QUO SIMULATION
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">
                The Money Has Moved (Back-Office Alert Only)
              </h2>
            </div>
          </div>
        </div>

        {/* Dolores' Screen vs Reality */}
        <div className="p-6 space-y-5">
          {/* Dolores Perspective */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>MEMBER RECEIPT (WHAT DOLORES SEES)</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Transfer Initiated
              </span>
            </div>
            <div className="text-xl font-bold text-slate-900 font-mono">
              ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-600">
              Sent to <strong>{destinationAccount.bankName}</strong> (...{destinationAccount.accountNumber.slice(-4)})
              via expedited settlement.
            </p>
          </div>

          {/* The Flaw in Status Quo */}
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-950">Why Detection Alone Fails:</h4>
                <p className="text-xs text-rose-900 mt-1 leading-relaxed">
                  The credit union's internal fraud monitor flagged unusual activity, but the alert went to the
                  institution's back-office risk queue. Dolores is <strong>still on the phone with the scammer</strong>,
                  having lost ${amount.toLocaleString()}.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-rose-200 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Risk Queue SLA</span>
                <span className="font-bold text-rose-800 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5" /> 4 to 6 Hours Delay
                </span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Account Holder</span>
                <span className="font-bold text-rose-800 flex items-center gap-1 mt-0.5">
                  <PhoneCall className="w-3.5 h-3.5" /> Still Coached on Call
                </span>
              </div>
            </div>
          </div>

          {/* CTA to compare with Second Look */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs"
            >
              Close Receipt
            </button>
            <button
              type="button"
              onClick={onSwitchToSecondLookDemo}
              className="flex-1 py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <span>See How Second Look™ Stops This</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

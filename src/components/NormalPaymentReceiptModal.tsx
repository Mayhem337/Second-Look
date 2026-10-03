import React from 'react';
import { CheckCircle2, ShieldCheck, ArrowRight, Printer } from 'lucide-react';
import { PaymentAccount } from '../types';

interface NormalPaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  destinationAccount: PaymentAccount;
}

export const NormalPaymentReceiptModal: React.FC<NormalPaymentReceiptModalProps> = ({
  isOpen,
  onClose,
  amount,
  destinationAccount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-emerald-800 text-white px-6 py-6 text-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-lg font-bold">Payment Successfully Scheduled</h2>
          <p className="text-xs text-emerald-200 mt-1">Transaction Ref: #MO-{Date.now().toString().slice(-6)}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center py-2">
            <div className="text-3xl font-extrabold text-slate-900 font-mono">
              ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-1">Applied to Auto Loan (...5519)</p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Funding Source:</span>
              <span className="font-semibold text-slate-800">{destinationAccount.bankName}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Account Number:</span>
              <span className="font-mono text-slate-800">...{destinationAccount.accountNumber.slice(-4)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Settlement:</span>
              <span className="font-semibold text-slate-800">Standard ACH (2 Business Days)</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Second Look™ checked session signals: Clean baseline. No friction required.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            Done & Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

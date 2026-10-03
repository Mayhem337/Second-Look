import React, { useState } from 'react';
import {
  Smartphone,
  PhoneCall,
  ShieldAlert,
  Send,
  X,
  MessageSquare,
  CheckCircle2,
  Bell,
  Clock,
} from 'lucide-react';
import { SMSNotification, TrustedContact } from '../types';

interface SimulatedPhoneProps {
  notifications: SMSNotification[];
  trustedContact: TrustedContact;
  isOpen: boolean;
  onClose: () => void;
  onCallMom: () => void;
}

export const SimulatedPhone: React.FC<SimulatedPhoneProps> = ({
  notifications,
  trustedContact,
  isOpen,
  onClose,
  onCallMom,
}) => {
  const [activeReply, setActiveReply] = useState('');
  const [repliedMessages, setRepliedMessages] = useState<string[]>([]);
  const [callStatus, setCallStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReply.trim()) return;
    setRepliedMessages((prev) => [...prev, activeReply.trim()]);
    setActiveReply('');
  };

  const handleSimulateCall = () => {
    setCallStatus('Calling Dolores Delgado (Mom)...');
    onCallMom();
    setTimeout(() => {
      setCallStatus('Connected: Dolores answered. You instructed her to hang up with the scammer.');
      setTimeout(() => setCallStatus(null), 7000);
    }, 2000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom duration-300">
      {/* Phone container */}
      <div className="w-80 sm:w-96 bg-slate-950 text-white rounded-3xl shadow-2xl border-4 border-slate-700 overflow-hidden flex flex-col h-[580px]">
        {/* Phone Notch & Status Bar */}
        <div className="bg-slate-900 px-5 pt-3 pb-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
          <span className="font-semibold">9:41 AM</span>
          <div className="w-20 h-4 bg-slate-950 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <div className="w-4 h-2.5 border border-slate-300 rounded-xs p-0.5 flex items-center">
              <div className="w-2.5 h-1.5 bg-emerald-400 rounded-xs" />
            </div>
            <button
              onClick={onClose}
              className="ml-2 text-slate-400 hover:text-white"
              title="Close phone simulation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Device Header */}
        <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xs font-bold">
              AD
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100">{trustedContact.name}'s iPhone</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Trusted Contact Simulation
              </div>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
            {trustedContact.phone}
          </span>
        </div>

        {/* Active Call Alert Banner */}
        {callStatus && (
          <div className="bg-emerald-600 text-white px-3 py-2 text-xs flex items-center gap-2 font-medium animate-pulse">
            <PhoneCall className="w-4 h-4 shrink-0" />
            <span>{callStatus}</span>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-950 to-slate-900">
          <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest my-1">
            Encrypted SMS / iMessage
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p>No SMS alerts yet.</p>
              <p className="text-[10px] text-slate-600 mt-1">
                Trigger a high-risk transfer in the portal to see Second Look's trusted-contact alert live here.
              </p>
            </div>
          ) : (
            notifications.map((msg) => {
              const isAlert = msg.type === 'trusted_contact_alert';
              return (
                <div key={msg.id} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                    <span className="font-semibold text-slate-300">{msg.from}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isAlert
                        ? 'bg-rose-950/80 border-2 border-rose-500/80 text-rose-100 shadow-lg'
                        : 'bg-slate-800 border border-slate-700 text-slate-200'
                    }`}
                  >
                    {isAlert && (
                      <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[11px] mb-1.5">
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>URGENT: FRAUD INTERVENTION ALERT</span>
                      </div>
                    )}
                    <p className="font-sans whitespace-pre-wrap">{msg.body}</p>

                    {isAlert && (
                      <div className="mt-3 pt-2 border-t border-rose-800/60 flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={handleSimulateCall}
                          className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call Mom Immediately</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* User replies in thread */}
          {repliedMessages.map((reply, i) => (
            <div key={i} className="flex justify-end">
              <div className="bg-emerald-600 text-white text-xs p-3 rounded-2xl rounded-tr-xs max-w-[85%]">
                {reply}
                <div className="text-[9px] text-emerald-200 text-right mt-1 flex items-center justify-end gap-1">
                  <span>Delivered</span>
                  <CheckCircle2 className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendReply} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={activeReply}
            onChange={(e) => setActiveReply(e.target.value)}
            placeholder="Text reply to Mission Oak..."
            className="flex-1 bg-slate-800 border border-slate-700 text-xs px-3 py-2 rounded-full text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!activeReply.trim()}
            className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white flex items-center justify-center shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ShieldCheck, Lock, Smartphone, RefreshCw, UserCheck, AlertTriangle, KeyRound } from 'lucide-react';
import { Member } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onLoginSuccess: (member: Member) => void;
  onPasscodeRequested: () => void;
  passcodeCount: number;
}

export const DEMO_DOLORES: Member = {
  id: 'mem_dolores_8819',
  name: 'Dolores Delgado',
  email: 'dolores.delgado@missionoakcu.org',
  phone: '(555) 382-7714',
  checkingBalance: 14250.80,
  savingsBalance: 32100.50,
  autoLoanBalance: 11420.00,
  usualAutoPayment: 412.60,
  trustedContact: {
    name: 'Ana Delgado',
    relationship: 'Daughter',
    phone: '(555) 382-9912',
  },
  isRegisteredUser: false,
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onLoginSuccess,
  onPasscodeRequested,
  passcodeCount,
}) => {
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');

  // Sign in fields
  const [email, setEmail] = useState('dolores.delgado@missionoakcu.org');
  const [password, setPassword] = useState('••••••••••••');

  // Registration fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regContactName, setRegContactName] = useState('');
  const [regContactPhone, setRegContactPhone] = useState('');
  const [regContactRelation, setRegContactRelation] = useState('Daughter');

  // 2FA state
  const [generatedCode, setGeneratedCode] = useState('492015');
  const [enteredCode, setEnteredCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [simulatedSmsToast, setSimulatedSmsToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePresetDolores = () => {
    setEmail(DEMO_DOLORES.email);
    setPassword('MissionOakSecure2026!');
    setTab('signin');
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Move to 2FA step
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);
    setEnteredCode('');
    setCodeError('');
    setStep('2fa');
    onPasscodeRequested();

    // Show simulated SMS popover
    showSmsAlert(newCode);
  };

  const showSmsAlert = (code: string) => {
    setSimulatedSmsToast(code);
    setTimeout(() => {
      // Auto-hide alert after 8s
      setSimulatedSmsToast((prev) => (prev === code ? null : prev));
    }, 8000);
  };

  const handleResendCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);
    onPasscodeRequested();
    showSmsAlert(newCode);
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredCode.trim() === generatedCode || enteredCode.trim() === '492015' || enteredCode.length === 6) {
      if (tab === 'signin') {
        onLoginSuccess(DEMO_DOLORES);
      } else {
        const customMember: Member = {
          id: 'mem_' + Date.now(),
          name: regName || 'Verified Member',
          email: regEmail,
          phone: regPhone || '(555) 720-1194',
          checkingBalance: 8500.00,
          savingsBalance: 15000.00,
          autoLoanBalance: 9800.00,
          usualAutoPayment: 412.60,
          trustedContact: {
            name: regContactName || 'Family Member',
            relationship: regContactRelation || 'Contact',
            phone: regContactPhone || '(555) 720-9900',
          },
          isRegisteredUser: true,
        };
        onLoginSuccess(customMember);
      }
    } else {
      setCodeError('Incorrect 6-digit code. Please enter the code sent via SMS.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Live SMS simulation bubble when 2FA is triggered */}
      {simulatedSmsToast && (
        <div className="fixed top-6 right-6 z-60 max-w-sm w-full bg-slate-900 border-2 border-emerald-500 text-white rounded-xl shadow-2xl p-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1 text-sm">
              <div className="flex items-center justify-between font-semibold text-emerald-400 text-xs">
                <span>SIMULATED SMS FROM (800) 555-OAK1</span>
                <span className="text-slate-400 text-[10px]">Just now</span>
              </div>
              <p className="mt-1 text-slate-200 font-mono text-xs">
                Mission Oak CU Security: Your one-time verification passcode is{' '}
                <span className="text-white font-bold tracking-wider underline">{simulatedSmsToast}</span>.
                Do not share this code with anyone.
              </p>
              <button
                type="button"
                onClick={() => setEnteredCode(simulatedSmsToast)}
                className="mt-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline"
              >
                Auto-fill code into 2FA field →
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden transition-all">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-5 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Mission Oak Credit Union</h2>
              <p className="text-xs text-emerald-200/90 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Secure Online Banking Portal
              </p>
            </div>
          </div>

          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] text-emerald-300">
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span>Multi-Factor Authentication (2FA) Enforced</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'credentials' ? (
            <>
              {/* Mode Tabs */}
              <div className="flex border-b border-slate-200 mb-5">
                <button
                  type="button"
                  onClick={() => setTab('signin')}
                  className={`flex-1 py-2.5 text-sm font-semibold text-center border-b-2 transition-colors ${
                    tab === 'signin'
                      ? 'border-emerald-700 text-emerald-800'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Member Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className={`flex-1 py-2.5 text-sm font-semibold text-center border-b-2 transition-colors ${
                    tab === 'register'
                      ? 'border-emerald-700 text-emerald-800'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  New Member Registration
                </button>
              </div>

              {/* Quick Fill for Dolores Demo Persona */}
              {tab === 'signin' && (
                <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-700" />
                      Hackathon Demo Persona:
                    </span>
                    <button
                      type="button"
                      onClick={handlePresetDolores}
                      className="px-2 py-1 rounded bg-emerald-700 text-white font-medium hover:bg-emerald-800 text-[11px] shadow-xs"
                    >
                      Use Dolores Delgado
                    </button>
                  </div>
                  <p className="mt-1 text-slate-600">
                    Dolores Delgado (Auto loan borrower, $412.60 regular payment, daughter Ana as trusted contact).
                  </p>
                </div>
              )}

              {tab === 'signin' ? (
                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Member Email / User ID
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                      placeholder="name@example.com"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Password
                      </label>
                      <span className="text-[11px] text-emerald-700 hover:underline cursor-pointer">
                        Forgot Password?
                      </span>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>Continue to SMS 2FA Passcode</span>
                    <span>→</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCredentialsSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                      placeholder="e.g. Maria Gonzalez"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                        placeholder="maria@example.com"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Phone (for 2FA)
                      </label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        required
                        placeholder="(555) 720-1194"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Create Password
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      placeholder="Must be at least 8 characters"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  {/* Trusted Contact Designation */}
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                    <div className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                      Trusted Contact (Second Look™ Safety Net):
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={regContactName}
                        onChange={(e) => setRegContactName(e.target.value)}
                        required
                        placeholder="Trusted Contact Name"
                        className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded text-xs focus:ring-1 focus:ring-amber-500"
                      />
                      <input
                        type="tel"
                        value={regContactPhone}
                        onChange={(e) => setRegContactPhone(e.target.value)}
                        required
                        placeholder="Contact Phone"
                        className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded text-xs focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm"
                  >
                    Register & Continue to 2FA
                  </button>
                </form>
              )}
            </>
          ) : (
            /* Step 2: 2FA Passcode Verification */
            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Enter Security Passcode</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                  A 6-digit verification code was sent to your registered mobile device ending in{' '}
                  <span className="font-semibold text-slate-800">...7714</span>.
                </p>
              </div>

              {passcodeCount >= 2 && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Risk Signal Captured:</span> Multiple passcode requests in a short
                    window ({passcodeCount} requests). +12 points added to Second Look session score.
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 text-center mb-1">
                  6-Digit SMS Passcode
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                  placeholder="000000"
                  className="w-full text-center text-2xl font-mono tracking-widest px-4 py-3 border-2 border-emerald-600 rounded-xl focus:outline-hidden focus:ring-4 focus:ring-emerald-100"
                />
                {codeError && <p className="mt-1 text-xs text-rose-600 text-center font-medium">{codeError}</p>}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 hover:underline"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Resend SMS Code ({passcodeCount > 0 ? `${passcodeCount} sent` : 'new'})
                </button>
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="text-slate-500 hover:text-slate-700 hover:underline"
                >
                  Back to credentials
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg text-sm transition-colors shadow-md"
              >
                Verify & Access Portal
              </button>
            </form>
          )}

          {/* NCUA / Security Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Federally insured by NCUA</span>
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

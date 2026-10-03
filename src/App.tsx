import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar, ViewMode } from './components/Navbar';
import { AuthModal, DEMO_DOLORES } from './components/AuthModal';
import { MemberPortal } from './components/MemberPortal';
import { RiskInspectorPanel } from './components/RiskInspectorPanel';
import { FrictionModal } from './components/FrictionModal';
import { AddAccountModal } from './components/AddAccountModal';
import { SimulatedPhone } from './components/SimulatedPhone';
import { DemoScriptModal } from './components/DemoScriptModal';
import { NormalPaymentReceiptModal } from './components/NormalPaymentReceiptModal';
import { UnprotectedScamReceiptModal } from './components/UnprotectedScamReceiptModal';
import { evaluateRisk, EngineState } from './risk-engine/SecondLookEngine';
import { Member, PaymentAccount, FrictionAnswers, SMSNotification } from './types';
import { fetchScamExplanation, logAuditEntry } from './services/apiService';

// Default initial accounts for Dolores
const INITIAL_ACCOUNTS: PaymentAccount[] = [
  {
    id: 'acct_primary_chk',
    nickname: 'Mission Oak Checking',
    bankName: 'Mission Oak Credit Union',
    accountType: 'checking',
    accountNumber: '4012984102',
    routingNumber: '321172810',
    addedAt: Date.now() - 3 * 365 * 24 * 60 * 60 * 1000, // 3 years ago
    isVerified: true,
  },
  {
    id: 'acct_chase_ext',
    nickname: 'Personal Checking',
    bankName: 'JPMorgan Chase Bank',
    accountType: 'external',
    accountNumber: '8812903144',
    routingNumber: '021000021',
    addedAt: Date.now() - 2 * 365 * 24 * 60 * 60 * 1000, // 2 years ago
    isVerified: true,
  },
];

export default function App() {
  // Authentication State
  const [member, setMember] = useState<Member | null>(DEMO_DOLORES);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [passcodeCount, setPasscodeCount] = useState(0);

  // View Mode: 'portal' | 'inspector' | 'split'
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  // Second Look System Toggle (Enable vs Disable to show Status Quo vs Solution)
  const [secondLookEnabled, setSecondLookEnabled] = useState(true);

  // Active Demo Scenario: 1, 2, or 3
  const [activeScenario, setActiveScenario] = useState<1 | 2 | 3 | null>(3);

  // Accounts state
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>(INITIAL_ACCOUNTS);
  const [selectedAccount, setSelectedAccount] = useState<PaymentAccount>(INITIAL_ACCOUNTS[0]);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

  // Transaction state
  const [amount, setAmount] = useState<number>(4800.00);
  const [isExpedited, setIsExpedited] = useState<boolean>(true);

  // Risk Engine State
  const [engineState, setEngineState] = useState<EngineState>({
    phoneCallActive: true,
    passcodeRequestCount: 2,
    navigatedDirectlyToAddAccount: true,
    dictationDetected: true,
    tabSwitchCount: 4,
    longIdleThenRapidDetected: true,
    selectedPayeeAddedAt: Date.now() - 3 * 60 * 1000, // 3 mins ago
    amount: 4800.00,
    baseline: 412.60,
    isExpedited: true,
  });

  // Modals state
  const [isFrictionOpen, setIsFrictionOpen] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isNormalReceiptOpen, setIsNormalReceiptOpen] = useState(false);
  const [isUnprotectedReceiptOpen, setIsUnprotectedReceiptOpen] = useState(false);

  // Gemini AI Explanation state
  const [geminiExplanation, setGeminiExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  // SMS Notifications for Ana (and Dolores)
  const [notifications, setNotifications] = useState<SMSNotification[]>([
    {
      id: 'sms_init_1',
      timestamp: '9:32 AM',
      from: 'Mission Oak CU',
      to: DEMO_DOLORES.trustedContact.phone,
      toName: DEMO_DOLORES.trustedContact.name,
      body: 'Welcome to Second Look™ protective alerts for Dolores Delgado. You are designated as her trusted family safety contact.',
      read: true,
      type: 'cu_followup',
    },
  ]);

  // Synchronize payment amounts and payee age into engine state
  useEffect(() => {
    setEngineState((prev) => ({
      ...prev,
      amount,
      baseline: member?.usualAutoPayment || 412.60,
      isExpedited,
      selectedPayeeAddedAt: selectedAccount?.addedAt || null,
    }));
  }, [amount, member, isExpedited, selectedAccount]);

  // Evaluate Risk Score
  const evaluation = useMemo(() => {
    return evaluateRisk(engineState);
  }, [engineState]);

  // Handle Scenario Switcher
  const handleLoadScenario = useCallback((scenario: 1 | 2 | 3) => {
    setActiveScenario(scenario);

    if (scenario === 1) {
      // Scenario 1: Normal payment ($412.60)
      setSecondLookEnabled(true);
      setAmount(412.60);
      setIsExpedited(false);
      setSelectedAccount(INITIAL_ACCOUNTS[0]);
      setEngineState({
        phoneCallActive: false,
        passcodeRequestCount: 1,
        navigatedDirectlyToAddAccount: false,
        dictationDetected: false,
        tabSwitchCount: 0,
        longIdleThenRapidDetected: false,
        selectedPayeeAddedAt: INITIAL_ACCOUNTS[0].addedAt,
        amount: 412.60,
        baseline: 412.60,
        isExpedited: false,
      });
    } else if (scenario === 2) {
      // Scenario 2: Scam, back-office alerts only (Status Quo without Second Look)
      setSecondLookEnabled(false);
      setAmount(4800.00);
      setIsExpedited(true);
      const scamAccount: PaymentAccount = {
        id: 'acct_scam_safe_1',
        nickname: 'Protected Safe Account',
        bankName: 'First Secure National Bank',
        accountType: 'external',
        accountNumber: '9832481029',
        routingNumber: '121000358',
        addedAt: Date.now() - 3 * 60 * 1000,
        isVerified: true,
      };
      setPaymentAccounts((prev) => [scamAccount, ...prev.filter((a) => a.id !== scamAccount.id)]);
      setSelectedAccount(scamAccount);
      setEngineState({
        phoneCallActive: true,
        passcodeRequestCount: 2,
        navigatedDirectlyToAddAccount: true,
        dictationDetected: true,
        tabSwitchCount: 4,
        longIdleThenRapidDetected: true,
        selectedPayeeAddedAt: scamAccount.addedAt,
        amount: 4800.00,
        baseline: 412.60,
        isExpedited: true,
      });
    } else if (scenario === 3) {
      // Scenario 3: Scam, with Second Look
      setSecondLookEnabled(true);
      setAmount(4800.00);
      setIsExpedited(true);
      const scamAccount: PaymentAccount = {
        id: 'acct_scam_safe_1',
        nickname: 'Protected Safe Account',
        bankName: 'First Secure National Bank',
        accountType: 'external',
        accountNumber: '9832481029',
        routingNumber: '121000358',
        addedAt: Date.now() - 3 * 60 * 1000,
        isVerified: true,
      };
      setPaymentAccounts((prev) => [scamAccount, ...prev.filter((a) => a.id !== scamAccount.id)]);
      setSelectedAccount(scamAccount);
      setEngineState({
        phoneCallActive: true,
        passcodeRequestCount: 2,
        navigatedDirectlyToAddAccount: true,
        dictationDetected: true,
        tabSwitchCount: 4,
        longIdleThenRapidDetected: true,
        selectedPayeeAddedAt: scamAccount.addedAt,
        amount: 4800.00,
        baseline: 412.60,
        isExpedited: true,
      });
    }
  }, []);

  // Update engine state from inspector toggles
  const handleUpdateEngineState = (partial: Partial<EngineState>) => {
    setEngineState((prev) => ({ ...prev, ...partial }));
  };

  // Submit Payment Handler: The Core Response Ladder
  const handleSubmitPayment = async () => {
    // If Second Look is disabled (Scenario 2: Status Quo)
    if (!secondLookEnabled) {
      logAuditEntry({
        type: 'unprotected_payment_submitted',
        amount,
        destination: selectedAccount.bankName,
        riskScore: evaluation.score,
        alertQueuedToBackoffice: true,
      });
      setIsUnprotectedReceiptOpen(true);
      return;
    }

    // Second Look is ACTIVE:
    if (evaluation.action === 'pass') {
      // Clean baseline payment (Scenario 1)
      setIsNormalReceiptOpen(true);
      logAuditEntry({
        type: 'clean_payment_completed',
        amount,
        destination: selectedAccount.bankName,
        riskScore: evaluation.score,
      });
    } else {
      // High or Medium risk (50+ or 80+): Trigger Friction Questions Modal
      setIsFrictionOpen(true);

      // Trigger Gemini plain-language explanation generation asynchronously
      setIsLoadingExplanation(true);
      try {
        const result = await fetchScamExplanation({
          signals: evaluation.activeSignals,
          transaction: {
            amount,
            baseline: member?.usualAutoPayment || 412.60,
            destination: selectedAccount.bankName,
            expedited: isExpedited,
          },
          answers: { q1_phoneCall: true, q2_keepSecret: true, q3_moneyInDanger: true },
          memberName: member?.name || 'Dolores Delgado',
        });
        setGeminiExplanation(result.explanation);
      } catch (err) {
        console.error('Explanation fetch failed:', err);
      } finally {
        setIsLoadingExplanation(false);
      }
    }
  };

  // Confirmation of Hold after answering friction questions
  const handleConfirmHold = (
    answers: FrictionAnswers,
    outcome: 'hold_24h' | 'delay_30m',
    explanation: string
  ) => {
    logAuditEntry({
      type: 'second_look_intervention',
      outcome,
      riskScore: evaluation.score,
      amount,
      destination: selectedAccount.bankName,
      answers,
      explanation,
    });

    if (outcome === 'hold_24h') {
      // Send urgent SMS to Ana Delgado (Trusted Contact)
      const newSms: SMSNotification = {
        id: 'sms_alert_' + Date.now(),
        timestamp: 'Just now',
        from: 'Mission Oak CU',
        to: member?.trustedContact.phone || '(555) 382-9912',
        toName: member?.trustedContact.name || 'Ana Delgado',
        body: `Mission Oak: Your mom just tried to send $${amount.toLocaleString()} to a new account while on a phone call. We paused it for 24 hours. Please call her.`,
        read: false,
        type: 'trusted_contact_alert',
      };

      setNotifications((prev) => [newSms, ...prev]);
      // Open Ana's phone widget automatically to highlight intervention
      setIsPhoneOpen(true);
    }
  };

  const handleAccountAdded = (newAcct: PaymentAccount) => {
    setPaymentAccounts((prev) => [newAcct, ...prev]);
    setSelectedAccount(newAcct);
    setEngineState((prev) => ({
      ...prev,
      selectedPayeeAddedAt: newAcct.addedAt,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        member={member}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onOpenPhoneSimulation={() => setIsPhoneOpen(true)}
        smsCount={notifications.filter((n) => !n.read).length}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        secondLookScore={evaluation.score}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {viewMode === 'portal' && member && (
          <div className="max-w-4xl mx-auto">
            <MemberPortal
              member={member}
              paymentAccounts={paymentAccounts}
              selectedAccount={selectedAccount}
              onSelectAccount={setSelectedAccount}
              onOpenAddAccount={() => {
                setEngineState((prev) => ({ ...prev, navigatedDirectlyToAddAccount: true }));
                setIsAddAccountOpen(true);
              }}
              amount={amount}
              onChangeAmount={setAmount}
              isExpedited={isExpedited}
              onToggleExpedited={() => setIsExpedited((prev) => !prev)}
              onSubmitPayment={handleSubmitPayment}
              phoneCallActive={engineState.phoneCallActive}
              onTogglePhoneCall={() =>
                setEngineState((prev) => ({ ...prev, phoneCallActive: !prev.phoneCallActive }))
              }
              riskEvaluation={evaluation}
              secondLookEnabled={secondLookEnabled}
              onLogout={() => {
                setMember(null);
                setIsAuthModalOpen(true);
              }}
              onTabSwitchRecorded={() =>
                setEngineState((prev) => ({ ...prev, tabSwitchCount: prev.tabSwitchCount + 1 }))
              }
            />
          </div>
        )}

        {viewMode === 'inspector' && (
          <div className="h-[calc(100vh-140px)]">
            <RiskInspectorPanel
              evaluation={evaluation}
              engineState={engineState}
              onUpdateEngineState={handleUpdateEngineState}
              onLoadScenario={handleLoadScenario}
              activeScenario={activeScenario}
              secondLookEnabled={secondLookEnabled}
              onToggleSecondLook={() => setSecondLookEnabled((prev) => !prev)}
            />
          </div>
        )}

        {viewMode === 'split' && member && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 cols: Member Portal */}
            <div className="lg:col-span-7">
              <MemberPortal
                member={member}
                paymentAccounts={paymentAccounts}
                selectedAccount={selectedAccount}
                onSelectAccount={setSelectedAccount}
                onOpenAddAccount={() => {
                  setEngineState((prev) => ({ ...prev, navigatedDirectlyToAddAccount: true }));
                  setIsAddAccountOpen(true);
                }}
                amount={amount}
                onChangeAmount={setAmount}
                isExpedited={isExpedited}
                onToggleExpedited={() => setIsExpedited((prev) => !prev)}
                onSubmitPayment={handleSubmitPayment}
                phoneCallActive={engineState.phoneCallActive}
                onTogglePhoneCall={() =>
                  setEngineState((prev) => ({ ...prev, phoneCallActive: !prev.phoneCallActive }))
                }
                riskEvaluation={evaluation}
                secondLookEnabled={secondLookEnabled}
                onLogout={() => {
                  setMember(null);
                  setIsAuthModalOpen(true);
                }}
                onTabSwitchRecorded={() =>
                  setEngineState((prev) => ({ ...prev, tabSwitchCount: prev.tabSwitchCount + 1 }))
                }
              />
            </div>

            {/* Right 5 cols: Live Risk Inspector for Judges */}
            <div className="lg:col-span-5 sticky top-20">
              <RiskInspectorPanel
                evaluation={evaluation}
                engineState={engineState}
                onUpdateEngineState={handleUpdateEngineState}
                onLoadScenario={handleLoadScenario}
                activeScenario={activeScenario}
                secondLookEnabled={secondLookEnabled}
                onToggleSecondLook={() => setSecondLookEnabled((prev) => !prev)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Auth & 2FA Modal */}
      <AuthModal
        isOpen={isAuthModalOpen || !member}
        onLoginSuccess={(newMember) => {
          setMember(newMember);
          setIsAuthModalOpen(false);
        }}
        onPasscodeRequested={() => {
          setPasscodeCount((prev) => {
            const next = prev + 1;
            setEngineState((e) => ({ ...e, passcodeRequestCount: next }));
            return next;
          });
        }}
        passcodeCount={passcodeCount}
      />

      {/* Add External Payment Account Modal */}
      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        onAccountAdded={handleAccountAdded}
        onDictationDetected={() =>
          setEngineState((prev) => ({ ...prev, dictationDetected: true }))
        }
        dictationActive={engineState.dictationDetected}
      />

      {/* Second Look™ Friction Intervention Modal */}
      {member && (
        <FrictionModal
          isOpen={isFrictionOpen}
          riskEvaluation={evaluation}
          transactionAmount={amount}
          baselineAmount={member.usualAutoPayment}
          destinationAccount={selectedAccount}
          trustedContact={member.trustedContact}
          onConfirmHold={handleConfirmHold}
          onCancelPayment={() => setIsFrictionOpen(false)}
          isLoadingExplanation={isLoadingExplanation}
          geminiExplanation={geminiExplanation}
        />
      )}

      {/* Normal Clean Payment Receipt Modal (Scenario 1) */}
      <NormalPaymentReceiptModal
        isOpen={isNormalReceiptOpen}
        onClose={() => setIsNormalReceiptOpen(false)}
        amount={amount}
        destinationAccount={selectedAccount}
      />

      {/* Unprotected Scam Receipt Modal (Scenario 2 Status Quo) */}
      <UnprotectedScamReceiptModal
        isOpen={isUnprotectedReceiptOpen}
        onClose={() => setIsUnprotectedReceiptOpen(false)}
        amount={amount}
        destinationAccount={selectedAccount}
        onSwitchToSecondLookDemo={() => {
          setIsUnprotectedReceiptOpen(false);
          handleLoadScenario(3);
        }}
      />

      {/* Presentation Script & Walkthrough Guide Modal */}
      <DemoScriptModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onSelectScenario={handleLoadScenario}
      />

      {/* Ana Delgado's Simulated iPhone SMS Drawer */}
      {member && (
        <SimulatedPhone
          isOpen={isPhoneOpen}
          onClose={() => setIsPhoneOpen(false)}
          notifications={notifications}
          trustedContact={member.trustedContact}
          onCallMom={() => {
            setEngineState((prev) => ({ ...prev, phoneCallActive: false }));
          }}
        />
      )}
    </div>
  );
}

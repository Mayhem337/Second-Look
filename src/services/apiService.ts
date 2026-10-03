import { ActiveSignal, FrictionAnswers } from '../types';

export interface ExplainScamPayload {
  signals: ActiveSignal[];
  transaction: {
    amount: number;
    baseline: number;
    destination: string;
    expedited: boolean;
  };
  answers: FrictionAnswers;
  memberName: string;
}

export async function fetchScamExplanation(payload: ExplainScamPayload): Promise<{
  explanation: string;
  source: string;
}> {
  try {
    const res = await fetch('/api/explain-scam', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return {
      explanation: data.explanation || getDefaultFallback(payload),
      source: data.source || 'server',
    };
  } catch (err) {
    console.warn('Fallback to local explanation generator:', err);
    return {
      explanation: getDefaultFallback(payload),
      source: 'client-fallback',
    };
  }
}

export async function logAuditEntry(entry: any) {
  try {
    await fetch('/api/audit-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
  } catch (err) {
    console.error('Audit log failed:', err);
  }
}

function getDefaultFallback(payload: ExplainScamPayload): string {
  const ratio = (payload.transaction.amount / payload.transaction.baseline).toFixed(1);
  return `This looks like a "safe account" imposter scam. Mission Oak Credit Union will never ask you to move your money or keep a transaction secret from our branch. This transfer of $${payload.transaction.amount.toLocaleString()} is ${ratio}x your normal loan payment, sent to an account added just minutes ago while you were on the phone.`;
}

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Plain-language scam explanation powered by Gemini
app.post('/api/explain-scam', async (req, res) => {
  try {
    const { signals, transaction, answers, memberName } = req.body;

    const signalDescriptions = (signals || [])
      .map((s: { label: string; points: number }) => `- ${s.label} (+${s.points} risk points)`)
      .join('\n');

    const prompt = `You are Second Look, a protective fraud prevention system embedded in Mission Oak Credit Union's member portal.
An unusual high-risk transaction was just intercepted and held for member ${memberName || 'the account holder'}.

Transaction Details:
- Amount: $${transaction?.amount || '4,800.00'} (Usual baseline: $${transaction?.baseline || '412.60'})
- Destination: ${transaction?.destination || 'Newly added external account'}
- Timing: ${transaction?.expedited ? 'Same-day expedited' : 'Standard'}

Triggered Behavioral Risk Signals:
${signalDescriptions}

Member's answers to friction questions:
${JSON.stringify(answers || {})}

Write a compassionate, crystal-clear, 2-to-3 sentence explanation to the member explaining why their credit union paused this payment.
Strict rules:
1. Speak directly to the member in reassuring, non-judgmental, protective language.
2. Explicitly state the scam pattern (e.g. "safe account" or "government/bank fraud imposter" scam).
3. Remind them firmly that Mission Oak Credit Union will NEVER call asking members to move funds to protect them, nor ask them to keep payments secret.
4. Mention the specific triggers gently (e.g., amount is far above normal, account was added minutes ago while on an active call).
5. Keep it strictly to 2-3 sentences.`;

    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const explanation = response.text?.trim();
      return res.json({
        success: true,
        explanation: explanation || getDefaultExplanation(transaction),
        source: 'gemini-3.8-flash',
      });
    } else {
      return res.json({
        success: true,
        explanation: getDefaultExplanation(transaction),
        source: 'rule-engine-fallback',
      });
    }
  } catch (error: any) {
    console.error('Error generating scam explanation:', error);
    return res.json({
      success: true,
      explanation: getDefaultExplanation(req.body?.transaction),
      source: 'fallback',
      error: error.message,
    });
  }
});

function getDefaultExplanation(transaction?: any) {
  const amount = transaction?.amount || '4,800';
  const ratio = transaction?.baseline ? (transaction.amount / transaction.baseline).toFixed(1) : '11.6';
  return `This looks like a "safe account" social engineering scam. Mission Oak Credit Union will never call asking you to move money or keep a transaction secret. This transfer of $${amount} is ${ratio}x your usual payment to an account added just minutes ago while you were on the phone.`;
}

// In-memory simulation audit log store
const auditLogs: any[] = [];
app.post('/api/audit-log', (req, res) => {
  const entry = {
    id: 'log_' + Date.now(),
    timestamp: new Date().toISOString(),
    ...req.body,
  };
  auditLogs.unshift(entry);
  if (auditLogs.length > 50) auditLogs.pop();
  res.json({ success: true, entry });
});

app.get('/api/audit-logs', (_req, res) => {
  res.json({ logs: auditLogs });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();

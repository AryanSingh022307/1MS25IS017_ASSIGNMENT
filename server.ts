import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { SYSTEM_INSTRUCTIONS } from './src/prompt/systemInstructions.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));

// Helper to parse reasoning steps and final answer
export function parseSections(rawText: string) {
  let reasoningSteps = '';
  let finalAnswer = '';

  // 1. Primary format: ## REASONING STEPS and ## FINAL ANSWER (markdown headings)
  const reasoningHeaderMatch = rawText.match(/(?:^|\n)(?:#{1,3}\s*)?REASONING STEPS:?([\s\S]*?)(?=(?:^|\n)(?:#{1,3}\s*)?FINAL ANSWER:?|$)/i);
  const finalAnswerHeaderMatch = rawText.match(/(?:^|\n)(?:#{1,3}\s*)?FINAL ANSWER:?([\s\S]*$)/i);

  if (reasoningHeaderMatch && finalAnswerHeaderMatch && reasoningHeaderMatch[1].trim() && finalAnswerHeaderMatch[1].trim()) {
    reasoningSteps = reasoningHeaderMatch[1].trim();
    finalAnswer = finalAnswerHeaderMatch[1].trim();
    return { reasoningSteps, finalAnswer, rawText };
  }

  // 2. Secondary format: XML tags <reasoning_steps> and <final_answer>
  const reasoningMatch = rawText.match(/<reasoning_steps>([\s\S]*?)<\/reasoning_steps>/i);
  const finalAnswerMatch = rawText.match(/<final_answer>([\s\S]*?)<\/final_answer>/i);

  if (reasoningMatch && reasoningMatch[1]) {
    reasoningSteps = reasoningMatch[1].trim();
  }
  if (finalAnswerMatch && finalAnswerMatch[1]) {
    finalAnswer = finalAnswerMatch[1].trim();
  }

  // 3. Fallbacks
  if (!reasoningSteps && !finalAnswer) {
    if (reasoningHeaderMatch && reasoningHeaderMatch[1].trim()) {
      reasoningSteps = reasoningHeaderMatch[1].trim();
    } else {
      finalAnswer = rawText.trim();
    }
  }

  return { reasoningSteps, finalAnswer, rawText };
}

// Clean error message helper
function formatErrorMessage(err: any): string {
  if (!err) return 'An unexpected error occurred.';
  const msg = typeof err === 'string' ? err : err.message || JSON.stringify(err);
  try {
    const parsed = JSON.parse(msg);
    if (parsed.error && parsed.error.message) {
      return parsed.error.message;
    }
  } catch {
    // Not JSON
  }
  return msg;
}

// API Route for literature review generation
app.post('/api/generate-plan', async (req: Request, res: Response) => {
  try {
    const { topic, level = 'Masters', focusDetails = '' } = req.body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({ error: 'Please provide a valid research topic.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is configured in Settings > Secrets.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const userPrompt = `Topic: ${topic.trim()}${level ? ` (Academic Level: ${level})` : ''}${focusDetails ? ` [Scope: ${focusDetails.trim()}]` : ''}`;

    // Attempt generation with retry on transient 503 / 429
    let rawOutput = '';
    const maxAttempts = 3;
    let lastError: any = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTIONS,
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.LOW,
            },
          },
        });

        rawOutput = response.text || '';
        if (rawOutput) break;
      } catch (apiErr: any) {
        lastError = apiErr;
        const errMsg = formatErrorMessage(apiErr);
        const isTransient = errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('UNAVAILABLE');
        
        if (isTransient && attempt < maxAttempts) {
          console.warn(`Transient Gemini error (attempt ${attempt}/${maxAttempts}). Retrying in ${attempt * 1500}ms...`);
          await new Promise((r) => setTimeout(r, attempt * 1500));
          continue;
        }
        throw apiErr;
      }
    }

    if (!rawOutput) {
      throw new Error('Received an empty response from the AI model.');
    }

    const parsed = parseSections(rawOutput);

    return res.json({
      success: true,
      topic: topic.trim(),
      level,
      focusDetails: focusDetails?.trim() || null,
      reasoningSteps: parsed.reasoningSteps,
      finalAnswer: parsed.finalAnswer,
      rawText: parsed.rawText,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating literature review plan:', error);
    const cleanMsg = formatErrorMessage(error);
    return res.status(500).json({
      error: cleanMsg,
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`PaperPilot server is listening on port ${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
